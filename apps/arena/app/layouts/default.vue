<script setup lang="ts">
import { usePreferences } from '~/composables/settings'

const route = useRoute()

const wideLayout = computed(() => route.meta.wideLayout ?? false)
const isGrayscale = usePreferences('grayscaleMode')
const networkInfo = useHederaNetwork()

// Wallet state from composables/users.ts
const wallet = currentWallet
const isConnected = isWalletConnected
</script>

<template>
  <div h-full :data-mode="isHydrated && isGrayscale ? 'grayscale' : ''">
    <main mxa flex w-full lg:max-w-80rem>
      <aside class="zen-hide w-1/8 lg:w-1/5 md:w-1/6 xl:w-1/4" hidden justify-end relative xl:me-4 sm:flex>
        <div flex="~ col" h-100dvh w-20 top-0 sticky xl:w-100 lt-xl-items-center>
          <slot name="left">
            <div flex="~ col" h-full max-w-full justify-between overflow-x-hidden overflow-y-auto>
              <NavTitle />
              <NavSide command />
              <div flex-auto />
              <div v-if="isHydrated" bg-base flex flex-col bottom-0 sticky>
                <!-- Wallet Connection Section -->
                <div v-if="isConnected && wallet" p6 pb8 w-full>
                  <div hidden xl-block>
                    <div flex="~" items-center justify-between>
                      <NuxtLink
                        hover:bg-active text-primary text-start rounded-3 w-full hidden cursor-pointer transition-100 xl:block
                        to="/profile"
                      >
                        <div flex="~ col" p-3 gap-2>
                          <div flex gap-2 items-center>
                            <div bg-primary-500 text-white font-bold rounded-full flex h-10 w-10 items-center justify-center>
                              {{ wallet.connection.accountId.split('.')[2].slice(0, 2) }}
                            </div>
                            <div flex="~ col" min-w-0>
                              <span text-sm font-semibold truncate>{{ wallet.profile?.username || 'Player' }}</span>
                              <span text-xs text-secondary truncate>{{ wallet.connection.accountId }}</span>
                            </div>
                          </div>
                          <div v-if="wallet.profile" text-xs text-secondary flex justify-between>
                            <span>Level {{ wallet.profile.level }}</span>
                            <span>{{ wallet.profile.totalWins }}W</span>
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                  <!-- Mobile compact view -->
                  <div xl:hidden>
                    <NuxtLink
                      to="/profile"
                      bg-primary-500 text-white font-bold rounded-full flex h-10 w-10 items-center justify-center
                    >
                      {{ wallet.connection.accountId.split('.')[2].slice(0, 2) }}
                    </NuxtLink>
                  </div>
                </div>
                <!-- Connect Wallet Button -->
              </div>
            </div>
          </slot>
        </div>
      </aside>
      <div :class="isHydrated && wideLayout ? 'xl:w-full sm:w-600px' : 'sm:w-600px md:shrink-0'" sm:border-x border-base min-h-screen w-full>
        <div min-h="[calc(100vh-3.5rem)]" sm:min-h-screen>
          <slot />
        </div>
        <div bg-base bottom-0 left-0 right-0 sticky z-10 pb="[env(safe-area-inset-bottom)]" transition="padding 20">
          <CommonOfflineChecker v-if="isHydrated" />
          <NavBottom v-if="isHydrated" sm:hidden />
        </div>
      </div>
      <aside v-if="isHydrated && !wideLayout" class="sm:none zen-hide hidden lg:w-1/5 xl:w-1/4 xl:block">
        <div flex="~ col" ms-2 py3 gap-2 h-100dvh top-0 sticky>
          <slot name="right">
            <!-- Hedera Network Info -->
            <div m3 gap-3 grid>
              <span text-size-lg text-primary font-bold>{{ networkInfo.network }}</span>
              <div flex="~ col" bg-base p-3 rounded-2 gap-2 border="~ base">
                <div flex items-center justify-between>
                  <span text-xs text-secondary>Mirror Node</span>
                  <div
                    rounded-full h-2 w-2
                    :class="networkInfo.network === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'"
                  />
                </div>
                <p text-xs text-secondary break-all>
                  {{ networkInfo.mirrorNodeUrl }}
                </p>
              </div>

              <!-- Wallet Balance (if connected) -->
              <div v-if="isConnected && wallet" flex="~ col" bg-base p-3 rounded-2 gap-2 border="~ base">
                <span text-xs text-secondary>Your Balance</span>
                <div flex gap-2 items-center>
                  <span text-lg font-bold>{{ (parseFloat(wallet.hbarBalance) / 100000000).toFixed(2) }}</span>
                  <span text-sm text-secondary>HBAR</span>
                </div>
              </div>
            </div>

            <div flex-auto />

            <!-- Gaming Stats (if connected) -->
            <div v-if="isConnected && wallet?.profile" bg-base m3 p-3 rounded-2 border="~ base">
              <div flex="~ col" gap-2>
                <span text-xs text-secondary font-semibold>Your Stats</span>
                <div grid="~ cols-2" gap-3>
                  <div flex="~ col" items-center>
                    <span text-xl text-primary font-bold>{{ wallet.profile.totalGamesPlayed }}</span>
                    <span text-xs text-secondary>Games</span>
                  </div>
                  <div flex="~ col" items-center>
                    <span text-xl text-green-500 font-bold>{{ wallet.profile.totalWins }}</span>
                    <span text-xs text-secondary>Wins</span>
                  </div>
                  <div flex="~ col" items-center>
                    <span text-xl text-purple-500 font-bold>{{ wallet.profile.level }}</span>
                    <span text-xs text-secondary>Level</span>
                  </div>
                  <div flex="~ col" items-center>
                    <span text-xl text-blue-500 font-bold>{{ wallet.profile.xp }}</span>
                    <span text-xs text-secondary>XP</span>
                  </div>
                </div>
              </div>
            </div>

            <PwaPrompt />
            <PwaInstallPrompt />
          </slot>
        </div>
      </aside>
    </main>
    <ModalContainer />
  </div>
</template>
