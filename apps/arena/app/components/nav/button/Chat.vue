<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink to="/chat" :aria-label="$t('nav.chat')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:chat-3-line />
  </NuxtLink>
</template>
