<script setup lang="ts">
defineProps<{
  activeClass: string
}>()
</script>

<template>
  <NuxtLink to="/profile" :aria-label="$t('nav.profile')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div i-ri:user-line />
  </NuxtLink>
</template>
