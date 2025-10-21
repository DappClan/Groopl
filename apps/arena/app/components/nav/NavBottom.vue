<script setup lang="ts">
import type { Component } from 'vue'

interface NavButton {
  name: string
  component: Component
}

const navButtons: NavButton[] = [
  { name: 'home', component: resolveComponent('NavButtonHome') as Component },
  { name: 'games', component: resolveComponent('NavButtonGames') as Component },
  { name: 'rooms', component: resolveComponent('NavButtonRooms') as Component },
  { name: 'chat', component: resolveComponent('NavButtonChat') as Component },
  { name: 'profile', component: resolveComponent('NavButtonProfile') as Component },
]

const selectedNavButtons = computed(() => navButtons)
</script>

<template>
  <nav
    h-14 border="t base" flex flex-row text-xl
    of-y-scroll scrollbar-hide overscroll-none
    class="after-content-empty after:(h-[calc(100%+0.5px)] w-0.1px pointer-events-none)"
  >
    <Component :is="navButton.component" v-for="navButton in selectedNavButtons" :key="navButton.name" active-class="text-primary" />
  </nav>
</template>
