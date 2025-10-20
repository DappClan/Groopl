<template>
  <div
    v-if="useNuxtApp().$pwa?.showInstallPrompt && !useNuxtApp().$pwa?.needRefresh"
    bg="primary-fade"
    m-2 p5 rounded-lg relative of-hidden
    flex="~ col gap-3"
    v-bind="$attrs"
  >
    <h2 flex="~ gap-2" items-center>
      {{ $t('pwa.install_title') }}
    </h2>
    <div flex="~ gap-1">
      <button type="button" btn-solid px-4 py-1 text-center text-sm @click="useNuxtApp().$pwa?.install()">
        {{ $t('pwa.install') }}
      </button>
      <button type="button" btn-text filter-saturate-0 px-4 py-1 text-center text-sm @click="useNuxtApp().$pwa?.cancelInstall()">
        {{ $t('pwa.dismiss') }}
      </button>
    </div>
    <div i-material-symbols:install-desktop-rounded text-6em text-primary op10 inset-ie--2 bottom--2 absolute dark:text-white class="rtl-flip -z-1" />
  </div>
</template>
