import { computed } from 'vue'
import { metamaskWallet, useMetaMask } from './useMetamask'
import { useWalletConnect, walletConnectWallet } from './useWalletConnect'

// Purpose: This composable is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: ComputedRef<string | null>, walletInterface: ComputedRef<WalletInterface | null> }
export function useWalletInterface() {
  const { metamaskAccountAddress } = useMetaMask()
  const { accountId: walletConnectAccountId } = useWalletConnect()

  const accountId = computed(() => {
    if (metamaskAccountAddress.value) {
      return metamaskAccountAddress.value
    }
    else if (walletConnectAccountId.value) {
      return walletConnectAccountId.value
    }
    else {
      return null
    }
  })

  const walletInterface = computed(() => {
    if (metamaskAccountAddress.value) {
      return metamaskWallet
    }
    else if (walletConnectAccountId.value) {
      return walletConnectWallet
    }
    else {
      return null
    }
  })

  return {
    accountId,
    walletInterface,
  }
}
