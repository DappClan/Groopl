import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  // Wait for hydration
  if (!isHydrated.value) {
    await new Promise<void>(resolve => onHydrated(() => resolve()))
  }

  // Wait for wallet initialization to complete
  const { isInitializingWallet, onWalletInitialized } = await import('~/composables/wallet/initialization')
  if (isInitializingWallet.value) {
    await new Promise<void>(resolve => onWalletInitialized(() => resolve()))
  }

  return handleAuth(to)
})

async function handleAuth(to: RouteLocationNormalized) {
  // Import the persisted wallet connection state
  const { isWalletConnected } = await import('~/composables/wallet/initialization')


  const isConnected = isWalletConnected.value


  // NOT connected: Only allow landing page (/)
  if (!isConnected) {
    if (to.path !== '/') {
      return navigateTo('/')
    }
  }

  // Connected: Allow all pages EXCEPT landing page (/)
  if (isConnected) {
    if (to.path === '/') {
      return navigateTo('/home')
    }
  }
}
