export default defineNuxtPlugin(() => {
  // Mark as hydrated when the plugin loads on client
  if (import.meta.client) {
    isHydrated.value = true
  }
})
