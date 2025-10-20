<script setup lang="ts">
import { usePreferences, useUserSettings } from '~/composables/settings'

useHydratedHead({
  title: 'Settings',
})

const grayscaleMode = usePreferences('grayscaleMode')
const zenMode = usePreferences('zenMode')
const showFpsCounter = usePreferences('showFpsCounter')
const enableSoundEffects = usePreferences('enableSoundEffects')
const enableVibration = usePreferences('enableVibration')
const graphicsQuality = usePreferences('graphicsQuality')
const showPlayerUsernames = usePreferences('showPlayerUsernames')

const userSettings = useUserSettings()
</script>

<template>
  <div min-h-screen p-6>
    <h1 text-2xl font-bold mb-6>
      Settings
    </h1>

    <div flex="~ col" gap-6>
      <!-- Display Settings -->
      <div bg-base p-6 rounded-3 border="~ base">
        <h2 text-xl font-bold mb-4>
          Display
        </h2>
        <div flex="~ col" gap-4>
          <div flex items-center justify-between>
            <div>
              <div font-semibold>
                Grayscale Mode
              </div>
              <div text-sm text-secondary>
                Reduce colors for focus
              </div>
            </div>
            <input v-model="grayscaleMode" type="checkbox">
          </div>
          <div flex items-center justify-between>
            <div>
              <div font-semibold>
                Zen Mode
              </div>
              <div text-sm text-secondary>
                Hide distracting elements
              </div>
            </div>
            <input v-model="zenMode" type="checkbox">
          </div>
          <div flex items-center justify-between>
            <div>
              <div font-semibold>
                Show FPS Counter
              </div>
              <div text-sm text-secondary>
                Display frames per second
              </div>
            </div>
            <input v-model="showFpsCounter" type="checkbox">
          </div>
          <div flex items-center justify-between>
            <div>
              <div font-semibold>
                Show Player Usernames
              </div>
              <div text-sm text-secondary>
                Display usernames in game
              </div>
            </div>
            <input v-model="showPlayerUsernames" type="checkbox">
          </div>
        </div>
      </div>

      <!-- Graphics Settings -->
      <div bg-base p-6 rounded-3 border="~ base">
        <h2 text-xl font-bold mb-4>
          Graphics
        </h2>
        <div flex="~ col" gap-4>
          <div>
            <div font-semibold mb-2>
              Graphics Quality
            </div>
            <select v-model="graphicsQuality" w-full p-2 rounded bg-base border="~ base">
              <option value="low">
                Low
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="high">
                High
              </option>
            </select>
          </div>
          <div>
            <div font-semibold mb-2>
              Font Size
            </div>
            <input
              v-model="userSettings.fontSize"
              type="text"
              w-full p-2 rounded bg-base border="~ base"
              placeholder="15px"
            >
          </div>
        </div>
      </div>

      <!-- Audio Settings -->
      <div bg-base p-6 rounded-3 border="~ base">
        <h2 text-xl font-bold mb-4>
          Audio & Haptics
        </h2>
        <div flex="~ col" gap-4>
          <div flex items-center justify-between>
            <div>
              <div font-semibold>
                Sound Effects
              </div>
              <div text-sm text-secondary>
                Play game sounds
              </div>
            </div>
            <input v-model="enableSoundEffects" type="checkbox">
          </div>
          <div flex items-center justify-between>
            <div>
              <div font-semibold>
                Vibration
              </div>
              <div text-sm text-secondary>
                Haptic feedback
              </div>
            </div>
            <input v-model="enableVibration" type="checkbox">
          </div>
        </div>
      </div>

      <!-- Network Settings -->
      <div v-if="isWalletConnected" bg-base p-6 rounded-3 border="~ base">
        <h2 text-xl font-bold mb-4>
          Wallet
        </h2>
        <div flex="~ col" gap-3>
          <div flex justify-between>
            <span text-secondary>Connected Wallet</span>
            <span font-semibold>{{ currentWallet?.connection.accountId }}</span>
          </div>
          <div flex justify-between>
            <span text-secondary>Network</span>
            <span font-semibold>{{ currentWallet?.connection.network }}</span>
          </div>
          <button
            mt-2 btn-text text-red-500
            @click="disconnectWallet"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
