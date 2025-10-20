import { useWalletInterface } from '~/composables/wallet/useWalletInterface'

// Wallet dialog state
export const isWalletDialogOpen = ref(false)

export function openWalletDialog() {
  isWalletDialogOpen.value = true
}

export function closeWalletDialog() {
  isWalletDialogOpen.value = false
}

// Auto-close wallet dialog when account connects
if (import.meta.client) {
  const { accountId } = useWalletInterface()
  watch(accountId, (newAccountId) => {
    if (newAccountId && isWalletDialogOpen.value) {
      closeWalletDialog()
    }
  })
}
