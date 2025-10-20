<template>
  <button
    v-if="useNuxtApp().$pwa?.needRefresh"
    bg="primary-fade"
    flex="~ gap-1 center" text-primary px3 py1 rounded relative
    @click="useNuxtApp().$pwa?.updateServiceWorker()"
  >
    <div i-ri-download-cloud-2-line />
    <h2 flex="~ gap-2" items-center>
      {{ $t('pwa.update_available_short') }}
    </h2>
  </button>
</template>
