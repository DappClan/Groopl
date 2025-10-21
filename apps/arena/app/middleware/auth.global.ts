import type { RouteLocationNormalized } from 'vue-router'
import { isInitializingWallet, onWalletInitialized } from '~/composables/wallet/initialization'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  // Wait for hydration
  if (!isHydrated.value) {
    await new Promise<void>(resolve => onHydrated(() => resolve()))
  }

  // Wait for wallet initialization to complete
  if (isInitializingWallet.value) {
    await new Promise<void>(resolve => onWalletInitialized(() => resolve()))
  }

  return handleAuth(to)
})

async function handleAuth(to: RouteLocationNormalized) {
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
