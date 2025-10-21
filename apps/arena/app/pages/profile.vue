<script setup lang="ts">
import { isWalletConnected } from '~/composables/wallet/initialization'

useHydratedHead({
  title: 'Profile',
})
</script>

<template>
  <div min-h-screen p-6>
    <h1 text-2xl font-bold mb-6>
      Player Profile
    </h1>

    <div v-if="isWalletConnected && currentWallet" flex="~ col" gap-6>
      <!-- Profile Header -->
      <div bg-base p-6 rounded-3 border="~ base">
        <div flex="~ col md:row" gap-6 items-start>
          <div
            bg-primary-500 text-white font-bold rounded-full
            flex h-24 w-24 items-center justify-center text-3xl
          >
            {{ currentWallet.connection.accountId.slice(0, 2) }}
          </div>
          <div flex="~ col" gap-2 flex-1>
            <h2 text-2xl font-bold>
              {{ currentWallet.profile?.username || 'Player' }}
            </h2>
            <p text-sm text-secondary>
              {{ currentWallet.connection.accountId }}
            </p>
            <div v-if="currentWallet.profile" flex gap-4 mt-2>
              <div flex="~ col">
                <span text-xl font-bold>{{ currentWallet.profile.level }}</span>
                <span text-xs text-secondary>Level</span>
              </div>
              <div flex="~ col">
                <span text-xl font-bold>{{ currentWallet.profile.xp }}</span>
                <span text-xs text-secondary>XP</span>
              </div>
              <div flex="~ col">
                <span text-xl font-bold>{{ currentWallet.profile.totalGamesPlayed }}</span>
                <span text-xs text-secondary>Games</span>
              </div>
              <div flex="~ col">
                <span text-xl font-bold>{{ currentWallet.profile.totalWins }}</span>
                <span text-xs text-secondary>Wins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wallet Info -->
      <div bg-base p-6 rounded-3 border="~ base">
        <h3 text-xl font-bold mb-4>
          Wallet Information
        </h3>
        <div flex="~ col" gap-3>
          <div flex justify-between>
            <span text-secondary>Network</span>
            <span font-semibold>{{ currentWallet.connection.network }}</span>
          </div>
          <div flex justify-between>
            <span text-secondary>Provider</span>
            <span font-semibold>{{ currentWallet.connection.provider }}</span>
          </div>
          <div flex justify-between>
            <span text-secondary>Balance</span>
            <span font-semibold>{{ (parseFloat(currentWallet.hbarBalance) / 100000000).toFixed(2) }} HBAR</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else bg-base p-6 rounded-3 border="~ base">
      <p text-secondary>
        Please connect your wallet to view your profile
      </p>
    </div>
  </div>
</template>
