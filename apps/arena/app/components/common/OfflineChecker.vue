<script setup lang="ts">
const online = useOnline()
</script>

<template>
  <div
    v-if="!online"
    bg-base text-primary px4 py3 min-h-30px w-full
    border="t base" flex="~ gap-2 center"
  >
    <div i-ri:wifi-off-line />
    Seems like you are offline. Please check your internet connection
  </div>
</template>
