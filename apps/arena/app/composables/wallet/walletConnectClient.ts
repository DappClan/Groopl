import type { ContractId, TokenId } from '@hashgraph/sdk'
import type { SignClientTypes } from '@walletconnect/types'
import type { Ref } from 'vue'
import type { ContractFunctionParameterBuilder } from '@/utils/contractFunctionParameterBuilder'
import type { WalletInterface } from '@/utils/walletInterface'
// eslint-disable-next-line unicorn/prefer-node-protocol
import EventEmitter from 'events'
import { DAppConnector, HederaChainId, HederaJsonRpcMethod, HederaSessionEvent } from '@hashgraph/hedera-wallet-connect'
import { AccountId, Client, ContractExecuteTransaction, LedgerId, TokenAssociateTransaction, TransferTransaction } from '@hashgraph/sdk'
import { onMounted, onUnmounted, ref } from 'vue'
import { appConfig } from '@/config'

// Created refreshEvent because `dappConnector.walletConnectClient.on(eventName, syncWithWalletConnectContext)` would not call syncWithWalletConnectContext
// Reference usage from walletconnect implementation https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/lib/dapp/index.ts#L120C1-L124C9
const refreshEvent = new EventEmitter()

// Create a new project in walletconnect cloud to generate a project id
const walletConnectProjectId = '377d75bb6f86a2ffd427d032ff6ea7d3'
const currentNetworkConfig = appConfig.networks.testnet
const hederaNetwork = currentNetworkConfig.network
Client.forName(hederaNetwork)

// Adapted from walletconnect dapp example:
// https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/examples/typescript/dapp/main.ts#L87C1-L101C4
let metadata: SignClientTypes.Metadata = {} as any

if (import.meta.client) {
  metadata = {
    name: 'Hedera CRA Template',
    description: 'Hedera CRA Template',
    url: window.location.origin,
    icons: [`${window.location.origin}/logo192.png`],
  }
}
const dappConnector = new DAppConnector(
  metadata,
  LedgerId.fromString(hederaNetwork),
  walletConnectProjectId,
  Object.values(HederaJsonRpcMethod),
  [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
  [HederaChainId.Testnet],
)

// ensure walletconnect is initialized only once
let walletConnectInitPromise: Promise<void> | undefined
async function initializeWalletConnect() {
  if (walletConnectInitPromise === undefined) {
    walletConnectInitPromise = dappConnector.init()
  }
  await walletConnectInitPromise
}

export async function openWalletConnectModal() {
  await initializeWalletConnect()
  await dappConnector.openModal().then((_x) => {
    refreshEvent.emit('sync')
  })
}

class WalletConnectWallet implements WalletInterface {
  private getSigner() {
    if (dappConnector.signers.length === 0) {
      throw new Error('No signers found!')
    }
    return dappConnector.signers[0]!
  }

  private getAccountId() {
    // Need to convert from walletconnect's AccountId to hashgraph/sdk's AccountId because walletconnect's AccountId and hashgraph/sdk's AccountId are not the same!
    return AccountId.fromString(this.getSigner().getAccountId().toString())
  }

  async transferHBAR(toAddress: AccountId, amount: number) {
    const transferHBARTransaction = new TransferTransaction()
      .addHbarTransfer(this.getAccountId(), -amount)
      .addHbarTransfer(toAddress, amount)

    const signer = this.getSigner()
    await transferHBARTransaction.freezeWithSigner(signer)
    const txResult = await transferHBARTransaction.executeWithSigner(signer)
    return txResult ? txResult.transactionId : null
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const transferTokenTransaction = new TransferTransaction()
      .addTokenTransfer(tokenId, this.getAccountId(), -amount)
      .addTokenTransfer(tokenId, toAddress.toString(), amount)

    const signer = this.getSigner()
    await transferTokenTransaction.freezeWithSigner(signer)
    const txResult = await transferTokenTransaction.executeWithSigner(signer)
    return txResult ? txResult.transactionId : null
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const transferTokenTransaction = new TransferTransaction()
      .addNftTransfer(tokenId, serialNumber, this.getAccountId(), toAddress)

    const signer = this.getSigner()
    await transferTokenTransaction.freezeWithSigner(signer)
    const txResult = await transferTokenTransaction.executeWithSigner(signer)
    return txResult ? txResult.transactionId : null
  }

  async associateToken(tokenId: TokenId) {
    const associateTokenTransaction = new TokenAssociateTransaction()
      .setAccountId(this.getAccountId())
      .setTokenIds([tokenId])

    const signer = this.getSigner()
    await associateTokenTransaction.freezeWithSigner(signer)
    const txResult = await associateTokenTransaction.executeWithSigner(signer)
    return txResult ? txResult.transactionId : null
  }

  // Purpose: build contract execute transaction and send to wallet for signing and execution
  // Returns: Promise<TransactionId | null>
  async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
    const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(gasLimit)
      .setFunction(functionName, functionParameters.buildHAPIParams())

    const signer = this.getSigner()
    await tx.freezeWithSigner(signer)
    const txResult = await tx.executeWithSigner(signer)

    // in order to read the contract call results, you will need to query the contract call's results form a mirror node using the transaction id
    // after getting the contract call results, use ethers and abi.decode to decode the call_result
    return txResult ? txResult.transactionId : null
  }

  disconnect() {
    dappConnector.disconnectAll().then(() => {
      refreshEvent.emit('sync')
    })
  }
}

export const walletConnectWallet = new WalletConnectWallet()

// Vue Composable for WalletConnect
export function useWalletConnect() {
  const accountId: Ref<string> = ref('')
  const isConnected: Ref<boolean> = ref(false)

  // sync the walletconnect state with the reactive refs
  const syncWithWalletConnectContext = () => {
    const currentAccountId = dappConnector.signers[0]?.getAccountId()?.toString()
    if (currentAccountId) {
      accountId.value = currentAccountId
      isConnected.value = true
    }
    else {
      accountId.value = ''
      isConnected.value = false
    }
  }

  const handleSync = () => {
    syncWithWalletConnectContext()
  }

  onMounted(async () => {
    // Sync after walletconnect finishes initializing
    refreshEvent.addListener('sync', handleSync)

    await initializeWalletConnect()
    syncWithWalletConnectContext()
  })

  onUnmounted(() => {
    refreshEvent.removeListener('sync', handleSync)
  })

  return {
    accountId,
    isConnected,
  }
}
