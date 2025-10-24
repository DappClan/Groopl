<script setup lang="ts">

const route = useRoute()
const gameSlug = computed(() => route.params.game as string)

const { getGame } = useGames()
const game = computed(() => getGame(gameSlug.value))

// Handle 404 for non-existent games
if (!game.value) {
  throw createError({
    statusCode: 404,
    message: 'Game not found',
  })
}

useHydratedHead({
  title: `${game.value.title} - Arena`,
})
</script>

<template>
  <Game
    v-if="game"
    :title="game.title"
    :subtitle="game.subtitle"
    :icon="game.icon"
    :banner-gradient="game.bannerGradient"
    :tabs="game.tabs"
  />
</template>
