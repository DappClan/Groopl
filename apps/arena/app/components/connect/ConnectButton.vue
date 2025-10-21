<script setup lang="ts">
import { useAccount, useDisconnect } from 'use-wagmi'
import { openWeb3ConnectDialog } from '~/composables/dialog'

const isConnected = ref(false)
const disconnect = ref<any>()

onMounted(async () => {
  if (import.meta.client) {
    const account = useAccount()
    const disconnectHook = useDisconnect()

    isConnected.value = account.isConnected.value
    disconnect.value = disconnectHook.disconnect

    // Watch for changes
    watch(account.isConnected, (val) => {
      isConnected.value = val
      window.location.reload()
    })
  }
})

function handleDisconnect() {
  if (disconnect.value) {
    disconnect.value()
    // Navigate to home page after disconnect
    // if (import.meta.client) {
    window.location.reload()
    // }
  }
}
</script>

<template>
  <div>
    <button
      v-if="!isConnected"
      type="button"
      btn-solid
      @click="openWeb3ConnectDialog"
    >
      Connect
    </button>
    <button
      v-else
      type="button"
      btn-outline
      @click="handleDisconnect"
    >
      Disconnect
    </button>
  </div>
</template>
