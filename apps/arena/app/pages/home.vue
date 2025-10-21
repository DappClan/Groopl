<script setup lang="ts">
import { isWalletConnected } from '~/composables/wallet/initialization'

useHydratedHead({
  title: 'Home',
})
</script>

<template>
  <div min-h-screen>
    <div p-6>
      <h1 text-2xl font-bold mb-4>
        Welcome to Groopl Arena
      </h1>
      <div v-if="isWalletConnected" flex="~ col" gap-4>
        <p text-secondary>
          Connected as {{ currentWallet?.connection.accountId }}
        </p>
        <div grid="~ cols-1 md:cols-2" gap-4>
          <NuxtLink
            to="/games"
            bg-base p-6 rounded-3 border="~ base"
            hover:bg-active transition-100
          >
            <div flex="~ col" gap-2>
              <div i-ri:gamepad-line text-3xl text-primary />
              <h2 text-xl font-bold>
                Browse Games
              </h2>
              <p text-sm text-secondary>
                Discover and join multiplayer games
              </p>
            </div>
          </NuxtLink>
          <NuxtLink
            to="/rooms"
            bg-base p-6 rounded-3 border="~ base"
            hover:bg-active transition-100
          >
            <div flex="~ col" gap-2>
              <div i-ri:door-open-line text-3xl text-primary />
              <h2 text-xl font-bold>
                My Rooms
              </h2>
              <p text-sm text-secondary>
                Join or create game rooms
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-else bg-base p-6 rounded-3 border="~ base">
        <p text-secondary>
          Please connect your wallet to access the arena
        </p>
      </div>
    </div>
  </div>
</template>
