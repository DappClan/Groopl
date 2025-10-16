import type { AccountId, TokenId } from '@hashgraph/sdk'
import type { Ref } from 'vue'
import type { WalletInterface } from '@/utils/walletInterface'
import { ContractId } from '@hashgraph/sdk'
import { ethers } from 'ethers'
import { onMounted, onUnmounted, ref } from 'vue'
import { appConfig } from '@/config'
import { ContractFunctionParameterBuilder } from '@/utils/contractFunctionParameterBuilder'

const currentNetworkConfig = appConfig.networks.testnet

export async function switchToHederaNetwork(ethereum: any) {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currentNetworkConfig.chainId }], // chainId must be in hexadecimal numbers
    })
  }
  catch (error: any) {
    if (error.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: `Hedera (${currentNetworkConfig.network})`,
              chainId: currentNetworkConfig.chainId,
              nativeCurrency: {
                name: 'HBAR',
                symbol: 'HBAR',
                decimals: 18,
              },
              rpcUrls: [currentNetworkConfig.jsonRpcUrl],
            },
          ],
        })
      }
      catch (addError) {
        console.error(addError)
      }
    }
    console.error(error)
  }
}

let { ethereum } = {} as any
if (import.meta.client)
  ethereum = (window as any).ethereum

function getProvider() {
  if (!ethereum) {
    // eslint-disable-next-line no-alert
    alert('Metamask is not installed! Go install the extension!')
  }

  return new ethers.BrowserProvider(ethereum)
}

// returns a list of accounts
// otherwise empty array
export async function connectToMetamask() {
  const provider = getProvider()

  // keep track of accounts returned
  let accounts: string[] = []

  try {
    await switchToHederaNetwork(ethereum)
    accounts = await provider.send('eth_requestAccounts', [])
  }
  catch (error: any) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.warn('Please connect to Metamask.')
    }
    else {
      console.error(error)
    }
  }

  return accounts
}

class MetaMaskWallet implements WalletInterface {
  private convertAccountIdToSolidityAddress(accountId: AccountId): string {
    const accountIdString = accountId.evmAddress !== null
      ? accountId.evmAddress.toString()
      : accountId.toSolidityAddress()

    return `0x${accountIdString}`
  }

  // Purpose: Transfer HBAR
  // Returns: Promise<string>
  // Note: Use JSON RPC Relay to search by transaction hash
  async transferHBAR(toAddress: AccountId, amount: number) {
    const provider = getProvider()
    const signer = await provider.getSigner()
    // build the transaction
    const tx = await signer.populateTransaction({
      to: this.convertAccountIdToSolidityAddress(toAddress),
      value: ethers.parseEther(amount.toString()),
    })
    try {
      // send the transaction
      const { hash } = await signer.sendTransaction(tx)
      await provider.waitForTransaction(hash)

      return hash
    }
    catch (error: any) {
      console.warn(error.message ? error.message : error)
      return null
    }
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transfer',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: 'address',
          name: 'recipient',
          value: this.convertAccountIdToSolidityAddress(toAddress),
        })
        .addParam({
          type: 'uint256',
          name: 'amount',
          value: amount,
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_FT,
    )

    return hash
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const provider = getProvider()
    const addresses = await provider.listAccounts()
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transferFrom',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: 'address',
          name: 'from',
          value: addresses[0],
        })
        .addParam({
          type: 'address',
          name: 'to',
          value: this.convertAccountIdToSolidityAddress(toAddress),
        })
        .addParam({
          type: 'uint256',
          name: 'nftId',
          value: serialNumber,
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_NFT,
    )

    return hash
  }

  async associateToken(tokenId: TokenId) {
    // send the transaction
    // convert tokenId to contract id
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'associate',
      new ContractFunctionParameterBuilder(),
      appConfig.constants.METAMASK_GAS_LIMIT_ASSOCIATE,
    )

    return hash
  }

  // Purpose: build contract execute transaction and send to hashconnect for signing and execution
  // Returns: Promise<TransactionId | null>
  async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
    const provider = getProvider()
    const signer = await provider.getSigner()
    const abi = [
      `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`,
    ]

    // create contract instance for the contract id
    // to call the function, use contract[functionName](...functionParameters, ethersOverrides)
    const contract = new ethers.Contract(`0x${contractId.toSolidityAddress()}`, abi, signer)
    try {
      const txResult = await contract[functionName]!(
        ...functionParameters.buildEthersParams(),
        {
          gasLimit: gasLimit === -1 ? undefined : gasLimit,
        },
      )
      return txResult.hash
    }
    catch (error: any) {
      console.warn(error.message ? error.message : error)
      return null
    }
  }

  disconnect() {
    // eslint-disable-next-line no-alert
    alert('Please disconnect using the Metamask extension.')
  }
}

export const metamaskWallet = new MetaMaskWallet()

// Vue Composable for MetaMask
export function useMetaMask() {
  const metamaskAccountAddress: Ref<string> = ref('')

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length !== 0) {
      metamaskAccountAddress.value = accounts[0]!
    }
    else {
      metamaskAccountAddress.value = ''
    }
  }

  onMounted(async () => {
    try {
      const provider = getProvider()
      const signers = await provider.listAccounts()

      if (signers.length !== 0) {
        metamaskAccountAddress.value = signers[0] as unknown as string
      }
      else {
        metamaskAccountAddress.value = ''
      }

      // listen for account changes and update the account address
      ethereum.on('accountsChanged', handleAccountsChanged)
    }
    catch (error: any) {
      console.error(error.message ? error.message : error)
    }
  })

  onUnmounted(() => {
    try {
      ethereum.removeAllListeners('accountsChanged')
    }
    catch {
      // Ethereum might not be available
    }
  })

  return {
    metamaskAccountAddress,
  }
}
