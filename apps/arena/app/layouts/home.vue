<script setup lang="ts">
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'

const { accountId, walletInterface } = useWalletInterface()

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
  <main class="grid select-none bottom-0 left-0 right-0 top-0 justify-center place-items-center fixed">
    <Dots />
    <div class="content text-foreground flex flex-col bottom-0 left-0 right-0 top-0 place-items-center fixed z-20 bg-none">
      <!-- Nav -->
      <div class="px-4 py-6 border-b border-border bg-background flex w-full">
        <div class="text-2xl text-cyan-600 font-bold">
          Groopl
        </div>
        <div class="flex-1" />
        <!-- connect button -->
        <WalletSelectionDialog>
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
      <div class="px-8 py-20 flex flex-col items-center justify-center">
        <!-- CTA -->
        <h1 class="text-5xl font-bold mb-6">
          Connect your wallet
        </h1>
      </div>
    </div>
  </main>
</template>

<style scoped>
.content {
  filter: invert(1) hue-rotate(180deg);
}
</style>
