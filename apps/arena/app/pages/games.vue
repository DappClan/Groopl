<script setup lang="ts">
useHydratedHead({
  title: 'Games',
})

const { getAllGames } = useGames()
const games = getAllGames()
</script>

<template>
  <div min-h-screen p-6>
    <h1 text-2xl font-bold mb-6>
      Available Games
    </h1>

    <div grid="~ cols-1 md:cols-2 lg:cols-3" gap-4>
      <!-- Dynamic Game Cards -->
      <GameCard
        v-for="game in games"
        :key="game.id"
        :title="game.title"
        :description="game.description"
        :icon="game.icon"
        :to="`/${game.id}/play`"
        :tags="game.tags"
        :available="game.available"
      />

      <!-- Coming Soon Card -->
      <GameCard
        title="Coming Soon"
        description="More games are being added to the arena"
        icon="i-ri:gamepad-line"
        :available="false"
      />
    </div>
  </div>
</template>
