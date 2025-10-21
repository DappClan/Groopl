// Track wallet initialization and connection state with localStorage persistence
// Synced with wagmi connection state via plugin
export const isWalletConnected = import.meta.server
  ? ref(false)
  : useLocalStorage('groopl-wallet-connected', false)

export const isInitializingWallet = ref(false)

export function onWalletInitialized(cb: () => unknown) {
  watchOnce(isInitializingWallet, () => {
    if (!isInitializingWallet.value) cb()
  }, { immediate: !isInitializingWallet.value })
}

export function setWalletConnected() {
  isWalletConnected.value = true
  isInitializingWallet.value = false
}

export function setWalletDisconnected() {
  isWalletConnected.value = false
  isInitializingWallet.value = false
}

export function setWalletConnecting() {
  isInitializingWallet.value = true
}

export function setWalletInitialized() {
  isInitializingWallet.value = false
}
