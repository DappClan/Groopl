<script setup lang="ts">

</script>

<template>
  <main class="native:grid native:sm:grid-cols-[auto_1fr] native:lg:grid-cols-[auto_minmax(600px,2fr)_1fr] mxa flex w-full lg:max-w-80rem">
    <aside class="zen-hide w-1/8 lg:w-1/5 md:w-1/6 xl:w-1/4" hidden justify-end relative xl:me-4 sm:flex>
      <div flex="~ col" h-100dvh w-20 top-0 sticky xl:w-100 lt-xl-items-center>
        <slot name="left">
          <div flex="~ col" h-full max-w-full justify-between overflow-x-hidden overflow-y-auto>
            <NavTitle />
            <NavSide command />
            <div flex-auto />
            <div v-if="isHydrated" bg-base flex flex-col bottom-0 sticky>
              <div hidden xl:block>
                <UserSignInEntry v-if="!currentUser" />
              </div>
              <div v-if="currentUser" p6 pb8 w-full>
                <div hidden xl-block>
                  <UserPicker v-if="showUserPicker" />
                  <div v-else flex="~" items-center justify-between>
                    <NuxtLink

                      hover:bg-active text-primary text-start rounded-3 w-full hidden cursor-pointer transition-100 xl:block
                      :to="getAccountRoute(currentUser.account)"
                    >
                      <AccountInfo :account="currentUser.account" square md:break-words />
                    </NuxtLink>
                    <UserDropdown />
                  </div>
                </div>
                <UserDropdown xl:hidden />
              </div>
            </div>
          </div>
        </slot>
      </div>
    </aside>
    <div :class="isHydrated && wideLayout ? 'xl:w-full sm:w-600px' : 'sm:w-600px md:shrink-0'" border-base min-h-screen w-full>
      <div min-h="[calc(100vh-3.5rem)]" sm:min-h-screen>
        <slot />
      </div>
      <div bg-base bottom-0 left-0 right-0 sticky z-10 pb="[env(safe-area-inset-bottom)]" transition="padding 20">
        <CommonOfflineChecker v-if="isHydrated" />
        <NavBottom v-if="isHydrated" sm:hidden />
      </div>
    </div>
    <aside v-if="isHydrated && !wideLayout" class="sm:none zen-hide hidden lg:w-1/5 xl:w-1/4 xl:block">
      <div flex="~ col" ms-2 py3 gap-2 h-100dvh top-0 sticky>
        <slot name="right">
          <SearchWidget mx-1 mt-4 hidden xl:block />

          <!-- server info -->
          <div v-if="!currentUser" m3 gap-3 grid>
            <span text-size-lg text-primary font-bold>{{ instance.title }}</span>
            <img rounded-3 :src="instance.thumbnail.url">
            <p text-secondary>
              {{ instance.description }}
            </p>
          </div>

          <div flex-auto />
          <PwaPrompt />
          <PwaInstallPrompt />
          <LazyCommonPreviewPrompt v-if="info.env === 'preview'" />
          <NavFooter />
        </slot>
      </div>
    </aside>
  </main>
</template>
