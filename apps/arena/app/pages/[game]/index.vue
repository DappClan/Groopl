<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const route = useRoute()
const router = useRouter()
const gameSlug = route.params.game as string

const { getGame } = useGames()
const game = getGame(gameSlug)

const { load, isLoaded, cleanup } = useGameLoader(gameSlug)

// Auto-load game on mount
onMounted(async () => {
  await load()
})

onBeforeUnmount(() => {
  cleanup()
})

function exitGame() {
  router.push(`/${gameSlug}/play`)
}
</script>

<template>
  <div min-h-screen :style="{ backgroundColor: game?.backgroundColor }" flex="~ col">
    <!-- Header Bar with Exit Button -->
    <div
      v-if="isLoaded"
      fixed top-0 left-0 right-0 z-50
      bg-black bg-op-80 backdrop-blur
      px-4 py-3
      flex items-center justify-between
      border-b border-gray-800
    >
      <div flex="~ gap-3" items-center>
        <div :class="game?.icon || 'i-ri:gamepad-fill'" text-xl text-primary />
        <span text-white font-semibold>{{ game?.title }}</span>
      </div>
      <button
        btn-text
        flex="~ gap-2"
        items-center
        text-white
        hover:text-primary
        transition-colors
        @click="exitGame"
      >
        <div i-ri:close-line text-xl />
        <span>Exit Game</span>
      </button>
    </div>

    <!-- Loading State -->
    <!-- <div
      v-if="isLoading"
      flex-1 flex="~ col" items-center justify-center
    >
      <div :class="game?.icon || 'i-ri:gamepad-fill'" text-6xl text-primary mb-4 animate-pulse />
      <p text-white text-xl>
        Loading {{ game?.title }}...
      </p>
    </div> -->

    <!-- Game Container -->
    <div
      flex-1 flex items-center justify-center
      pt-14
    >
      <div
        w-full h-full
        flex items-center justify-center
      >
        <div w-full>
          <div id="mygame" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#mygame {
  width: 100%;
  max-width: 100%;
  height: 100%;
}
</style>
