<script setup lang="ts">
import { isWalletDialogOpen } from '~/composables/dialog'
</script>

<template>
  <template v-if="isHydrated">
    <ModalDialog v-model="isWalletDialogOpen" py-4 px-8 max-w-125>
      <WalletSelection />
    </ModalDialog>
  </template>
</template>
