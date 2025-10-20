<script setup lang="ts">
import { useWalletInterface } from '@/composables/wallet/useWalletInterface'
import { openWalletDialog } from '~/composables/dialog'

const { accountId, walletInterface } = useWalletInterface()

function handleConnect() {
  if (accountId.value) {
    walletInterface.value?.disconnect()
  }
  else {
    openWalletDialog()
  }
}
</script>

<template>
  <header class="mb-10 mt-16 pt-14 relative before:h-1px before:content-empty before:top-0 before:absolute before:from-zinc-700/0 before:to-zinc-700/0 before:via-zinc-500/50 before:bg-gradient-to-r before:-inset-x-80">
    <div flex items-center justify-between>
      <Logo />
      <div class="flex-1" />
      <!-- connect button -->
      <button
        flex="~ row"
        gap-x-2
        items-center
        btn-solid
        rounded-3
        type="button"
        @click="handleConnect"
      >
        <span aria-hidden="true" block i-ri:wallet-line />
        {{ accountId ? 'Disconnect' : 'Connect Wallet' }}
      </button>
    </div>
  </header>
</template>
