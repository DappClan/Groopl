<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { connectToMetamask } from '@/composables/useMetamask'
import { openWalletConnectModal } from '@/composables/useWalletConnect'

const open = ref(false)

function handleClose() {
  open.value = false
}

async function handleWalletConnect() {
  await openWalletConnectModal()
  handleClose()
}

async function handleMetamask() {
  await connectToMetamask()
  // Note: Dialog will close automatically when accountId updates
}
</script>

<template>
  <Dialog v-model:open="open">
    <slot />
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Connect Wallet</DialogTitle>
      </DialogHeader>
      <div class="py-4 flex flex-col gap-3">
        <Button
          variant="outline"
          class="gap-3 w-full justify-start"
          @click="handleWalletConnect"
        >
          <!-- <img
            src="/assets/walletconnect-logo.svg"
            alt="WalletConnect logo"
            class="h-6 w-6"
          > -->
          <span>WalletConnect</span>
        </Button>
        <Button
          variant="outline"
          class="gap-3 w-full justify-start"
          @click="handleMetamask"
        >
          <!-- <img
            src="/assets/metamask-logo.svg"
            alt="MetaMask logo"
            class="h-6 w-6"
          > -->
          <span>MetaMask</span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
