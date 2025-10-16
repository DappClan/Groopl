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
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  filter: invert(1) hue-rotate(180deg);
}

body {
  background: white;
}
</style>
