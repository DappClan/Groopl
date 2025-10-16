<script setup lang="ts">
import { appName } from '@/config'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* @import '@unocss/reset/tailwind.css'; */
@import './globals.css';
</style>
