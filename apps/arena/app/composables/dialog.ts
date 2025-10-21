// Web3 Connect dialog state (new wagmi-based)
export const isWeb3ConnectDialogOpen = ref(false)

export function openWeb3ConnectDialog() {
  isWeb3ConnectDialogOpen.value = true
}

export function closeWeb3ConnectDialog() {
  isWeb3ConnectDialogOpen.value = false
}
