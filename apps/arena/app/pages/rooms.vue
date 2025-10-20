<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

useHydratedHead({
  title: 'Rooms',
})
</script>

<template>
  <div min-h-screen p-6>
    <div flex items-center justify-between mb-6>
      <h1 text-2xl font-bold>
        Game Rooms
      </h1>
      <button
        btn-solid px-4 py-2 rounded-2
        flex items-center gap-2
      >
        <div i-ri:add-line />
        Create Room
      </button>
    </div>

    <div v-if="isWalletConnected" flex="~ col" gap-4>
      <!-- Room list will be populated dynamically -->
      <div bg-base p-6 rounded-3 border="~ base" text-center>
        <div i-ri:door-open-line text-4xl text-secondary mx-auto mb-3 />
        <p text-secondary>
          No active rooms. Create one to get started!
        </p>
      </div>
    </div>

    <div v-else bg-base p-6 rounded-3 border="~ base">
      <p text-secondary>
        Please connect your wallet to access game rooms
      </p>
    </div>
  </div>
</template>
