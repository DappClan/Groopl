<script setup lang="ts">
const route = useRoute()
const gameSlug = route.params.game as string

const { getGame } = useGames()
const game = getGame(gameSlug)
</script>

<template>
  <!-- Fallback "Coming Soon" screen -->
  <div flex="~ col" items-center justify-center min-h-96>
    <div
      bg-base border border-base rounded-2xl p-12
      flex="~ col" items-center text-center max-w-md
    >
      <div :class="game?.icon || 'i-ri:gamepad-fill'" text-8xl text-primary mb-6 />
      <h2 text-2xl font-bold mb-3>
        Play Now
      </h2>
      <p text-secondary mb-8>
        {{ game?.title || 'This game' }}
      </p>
      <NuxtLink
        to="/{{ gameSlug }}/"
        btn-outline
        flex="~ gap-2"
        items-center
        text-lg px-8 py-4
      >
        <div  i-ri:gamepad-fill />
        <span>Start Matchmaking</span>
      </NuxtLink>
    </div>
  </div>
</template>
