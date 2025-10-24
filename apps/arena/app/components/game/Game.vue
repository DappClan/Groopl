<script setup lang="ts">
import type { CommonRouteTabOption } from '#shared/types'

interface GameProps {
  title: string
  subtitle?: string
  icon?: string
  bannerGradient?: string
  tabs: CommonRouteTabOption[]
}

withDefaults(defineProps<GameProps>(), {
  icon: 'i-ri:gamepad-fill',
  bannerGradient: 'from-emerald-600 to-teal-700',
})
</script>

<template>
  <div v-if="tabs.filter((v) => v.to === $route.path).length !== 0" min-h-screen bg-base>
    <!-- Game Banner -->
    <div relative h-48 bg-gradient-to-br :class="bannerGradient" overflow-hidden>
      <!-- Back Button Overlay -->
      <NuxtLink
        to="/games"
        absolute top-4 left-4 z-10
        btn-text
        sm:hidden
        flex="~ gap-2"
        items-center
        bg-black bg-op-20 px-4 py-2 rounded-lg
        hover:bg-op-30 transition-colors
      >
        <div i-ri:arrow-left-line />
        <span>Back</span>
      </NuxtLink>

      <!-- Game Title -->
      <div absolute inset-0 flex="~ col" items-center justify-center text-white>
        <div :class="icon" text-6xl mb-3 />
        <h1 text-4xl font-bold tracking-tight>
          {{ title }}
        </h1>
        <p v-if="subtitle" text-lg mt-2 op-90>
          {{ subtitle }}
        </p>
      </div>

      <!-- Decorative Pattern -->
      <div absolute inset-0 op-10>
        <div absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full />
        <div absolute bottom-10 left-10 w-24 h-24 border-4 border-white rounded-full />
      </div>
    </div>

    <!-- Tabs -->
    <CommonRouteTabs replace :options="tabs" />

    <!-- Content -->
    <div max-w-6xl mx-auto p-4>
      <NuxtPage />
    </div>
  </div>
  <NuxtPage v-else />
</template>
