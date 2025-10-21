import type { RouteLocationNormalized } from 'vue-router'
import { useWalletInterface } from '~/composables/wallet/useWalletInterface'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server)
    return

  if (isHydrated.value) {
    console.log("hydrated")
    return handleAuth(to)
  }

  onHydrated(() => handleAuth(to))
})

function handleAuth(to: RouteLocationNormalized) {
  const { accountId } = useWalletInterface()
  const isConnected = !!accountId.value

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
