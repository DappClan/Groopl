import { useAccount } from 'use-wagmi'
import { closeWeb3ConnectDialog, isWeb3ConnectDialogOpen } from '../dialog'
import { currentWalletAccountId } from '../users'
import { setWalletConnected, setWalletDisconnected } from './initialization'

/**
 * Syncs wagmi connection state with localStorage-backed state
 * Should be called after wagmi plugins are initialized
 */
export function useWagmiSync() {
  const { isConnected, address } = useAccount()

  // Watch connection state and sync to localStorage
  watch(isConnected, (connected) => {
    if (connected) {
      setWalletConnected()
    }
    else {
      setWalletDisconnected()
    }
  }, { immediate: true })

  // Watch address and sync to currentWalletAccountId
  watch(address, (newAddress) => {
    if (newAddress) {
      currentWalletAccountId.value = newAddress
      setWalletConnected()

      // Auto-close connect dialog when wallet connects
      if (isWeb3ConnectDialogOpen.value) {
        closeWeb3ConnectDialog()
      }
    }
    else {
      currentWalletAccountId.value = ''
      if (!isConnected.value) {
        setWalletDisconnected()
      }
    }
  }, { immediate: true })

  return {
    isConnected,
    address,
  }
}
