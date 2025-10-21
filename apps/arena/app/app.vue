<script setup lang="ts">
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { UseWagmiPlugin } from 'use-wagmi'
import { appName } from '@/config'
import { useWagmi } from '~/composables/useWagmi'
import { useWagmiSync } from '~/composables/wallet/useWagmiSync'

useHead({
  title: appName,
})

const nuxtApp = useNuxtApp()
const isLoading = ref(true)

function onSetup() {
  // Get RPC URLs
  const rpc = 'https://testnet.hashio.io/api'
  const fallbackRpc = 'https://testnet.hashio.io/api'

  // Create wagmi config
  const wagmiConfig = useWagmi(rpc, fallbackRpc)
  const queryClient = new QueryClient()

  // Install plugins
  nuxtApp.vueApp.use(UseWagmiPlugin, { config: wagmiConfig })
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
}

// Initialize wagmi and sync state
onMounted(() => {
  // Setup wagmi plugins first
  onSetup()

  // Then initialize state sync
  useWagmiSync()

  // Hide loading state
  isLoading.value = false
})
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <div v-if="isLoading" class="h-dvh flex items-center justify-center">
    <Loader />
  </div>
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>

  <svg absolute op0 width="0" height="0">
    <defs>
      <clipPath id="avatar-mask" clipPathUnits="objectBoundingBox">
        <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5" />
      </clipPath>
    </defs>
  </svg>
</template>
