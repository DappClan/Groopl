import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server)
    return

  if (isHydrated.value)
    return handleAuth(to)

  onHydrated(() => handleAuth(to))
})

function handleAuth(to: RouteLocationNormalized) {
  // If user is not connected and trying to access a protected route, redirect to home
  if (!isWalletConnected.value) {
    // Allow access to public pages
    const publicPages = ['/home', '/games', '/settings', '/']
    if (!publicPages.includes(to.path)) {
      return navigateTo('/home')
    }
  }

  // Redirect root to home
  if (to.path === '/')
    return navigateTo('/home')
}
