<script setup lang="ts">
useHydratedHead({
  title: 'Games',
})
</script>

<template>
  <div min-h-screen p-6>
    <h1 text-2xl font-bold mb-6>
      Available Games
    </h1>

    <div grid="~ cols-1 md:cols-2 lg:cols-3" gap-4>
      <!-- Game cards will be populated dynamically -->
      <div bg-base p-6 rounded-3 border="~ base" hover:bg-active transition-100>
        <div flex="~ col" gap-3>
          <div i-ri:gamepad-line text-4xl text-primary />
          <h3 text-xl font-bold>
            Coming Soon
          </h3>
          <p text-sm text-secondary>
            New games are being added to the arena
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
