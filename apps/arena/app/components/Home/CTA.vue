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
  <main flex-1>
    <div class="text-zinc-400/88 pb-14 relative space-y-4 before:h-1px before:content-empty before:bottom-0 before:absolute before:from-zinc-700/0 before:to-zinc-700/0 before:via-zinc-500/50 before:bg-gradient-to-r before:-inset-x-64" />
    <div class="py-8 flex flex-row">
      <div text-start class="flex w-full" flex-col gap-2 items-start>
        <div class="font-serif space-y-2">
          <h1 class="font-uppercase font-regular text-5xl tracking-tight pb-8 flex gap-4 md:text-7xl sm:text-6xl">
            <span class="text-foreground block">Welcome To</span>
            <span class="text-primary font-pacifico block">
              Groopl
            </span>
          </h1>
        </div>

        <div class="font-sans space-y-1">
          <p class="text-xl font-semibold md:text-3xl sm:text-2xl">
            Play. Compete. Win. Repeat.
          </p>
        </div>

        <div class="mx-auto pb-8 max-w-2xl">
          <p class="sm:text-md text-sm text-muted-foreground leading-relaxed md:text-lg">
            Challenge friends in fast-paced multiplayer games, climb the leaderboards, and own your victories forever.
          </p>
        </div>

        <WalletSelectionDialog v-model:open="open">
          <DialogTrigger as-child>
            <UxButton
              class="w-fit"
              text="Start Playing Now"
              type="button"
              @click="handleConnect"
            />
          </DialogTrigger>
        </WalletSelectionDialog>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Optional: Add smooth animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex.w-full > * {
  animation: fadeInUp 0.6s ease-out backwards;
}

.flex.w-full > *:nth-child(1) {
  animation-delay: 0.1s;
}

.flex.w-full > *:nth-child(2) {
  animation-delay: 0.2s;
}

.flex.w-full > *:nth-child(3) {
  animation-delay: 0.3s;
}

.flex.w-full > *:nth-child(4) {
  animation-delay: 0.4s;
}

.flex.w-full > *:nth-child(5) {
  animation-delay: 0.5s;
}

.flex.w-full > *:nth-child(6) {
  animation-delay: 0.6s;
}

.flex.w-full > *:nth-child(7) {
  animation-delay: 0.7s;
}

.flex.w-full > *:nth-child(8) {
  animation-delay: 0.8s;
}
</style>
