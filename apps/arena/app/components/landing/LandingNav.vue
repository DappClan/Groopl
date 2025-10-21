<script setup lang="ts">
</script>

<template>
  <header class="mb-10 mt-16 pt-14 relative before:h-1px before:content-empty before:top-0 before:absolute before:from-zinc-700/0 before:to-zinc-700/0 before:via-zinc-500/50 before:bg-gradient-to-r before:-inset-x-80">
    <div flex items-center justify-between>
      <Logo />
      <div class="flex-1" />
      <!-- Connect button using new wagmi component -->
      <ConnectButton />
    </div>
  </header>
</template>
