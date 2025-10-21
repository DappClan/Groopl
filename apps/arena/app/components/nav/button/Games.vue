<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink to="/games" :aria-label="$t('nav.games')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:gamepad-line />
  </NuxtLink>
</template>
