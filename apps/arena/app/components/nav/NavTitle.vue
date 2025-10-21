<script setup lang="ts">
const router = useRouter()
const back = ref<any>('')

const nuxtApp = useNuxtApp()

function onClickLogo() {
  nuxtApp.hooks.callHook('groopl-logo:click')
}

onMounted(() => {
  back.value = router.options.history.state.back
})
router.afterEach(() => {
  back.value = router.options.history.state.back
})
</script>

<template>
  <div bg-base py-4 flex top-0 justify-between sticky z-1>
    <NuxtLink

      text-2xl px-5 py2 flex gap-3 select-none items-end
      focus-visible:ring="2 current"
      to="/home"
      @click.prevent="onClickLogo"
    >
      <Logo shrink-0 aspect="1/1" sm:h-8 xl:h-10 class="rtl-flip" />
    </NuxtLink>
    <div me-6 mt-2 gap-1 hidden items-center xl:flex>
      <CommonTooltip :content="back" :distance="0">
        <button
          type="button"
          aria-label="back"
          btn-text p-3 :class="{ 'pointer-events-none op0': !back || back === '/', 'xl:flex': $route.name !== 'tag' }"
          @click="$router.go(-1)"
        >
          <div i-ri:arrow-left-line text-xl class="rtl-flip" />
        </button>
      </CommonTooltip>
    </div>
  </div>
</template>
