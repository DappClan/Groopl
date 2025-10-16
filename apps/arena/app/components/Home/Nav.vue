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

watch(accountId, (a) => {
  if (a) {
    open.value = false
  }
})
</script>

<template>
  <nav class="px-4 py-6 flex w-full">
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
  </nav>
</template>
