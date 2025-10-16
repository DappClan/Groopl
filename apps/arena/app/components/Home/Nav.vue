<script setup lang="ts">
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'

const { accountId, walletInterface } = useWalletInterface()

const open = ref(false)

async function handleConnect() {
  if (accountId.value) {
    walletInterface.value?.disconnect()
  }
  else {
    open.value = true
  }
}

watch([accountId, open], (a, o) => {
  if (a && o) {
    open.value = false
  }
})
</script>

<template>
  <header class="mb-10 mt-16 pt-14 relative before:h-1px before:content-empty before:top-0 before:absolute before:from-zinc-700/0 before:to-zinc-700/0 before:via-zinc-500/50 before:bg-gradient-to-r before:-inset-x-80">
    <div flex items-center justify-between>
      <Logo />
      <div class="flex-1" />
      <!-- connect button -->
      <WalletSelectionDialog v-model:open="open">
        <DialogTrigger as-child>
          <UxButton
            class="w-fit"
            text="Connect Wallet"
            type="button"
            @click="handleConnect"
          />
        </DialogTrigger>
      </WalletSelectionDialog>
    </div>
  </header>
</template>
