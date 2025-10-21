<script setup lang="ts">
import { useAccount, useConnect } from 'use-wagmi'
import { isWeb3ConnectDialogOpen } from '~/composables/dialog'

const images: Record<string, string> = {
  'Brave Wallet': '/media/brave.svg',
  'Coinbase Wallet': '/media/icon-coinbase.svg',
  'Frame': '/media/frame.png',
  'MetaMask': '/media/icon-metamask.svg',
  'Safe': '/media/safe.svg',
  'WalletConnect': '/media/icon-walletconnect.svg',
  'Window Provider': '/media/icon-metamask.svg', // Fallback for injected provider
}

const { connector, isReconnecting } = useAccount()
const { connect, connectors } = useConnect()

function handleConnect(cc: any) {
  connect({ connector: cc })
}
</script>

<template>
  <template v-if="isHydrated">
    <ModalDialog v-model="isWeb3ConnectDialogOpen" py-4 px-8 max-w-125>
      <div flex="~ col" gap-4>
        <h1 text-2xl font-bold text-center>
          Connect Wallet
        </h1>
        <p text-center text-secondary text-sm>
          Connect with one of our available wallet providers.
        </p>

        <div flex="~ col" gap-3 my-4>
          <button
            v-for="cc in connectors"
            :key="cc.uid"
            type="button"
            flex="~ row"
            gap-x-3
            items-center
            justify-between
            btn-solid
            rounded-3
            px-6
            py-3
            w-full
            :disabled="isReconnecting || connector?.uid === cc.uid"
            :data-test="`modal-web3-connect-button-${cc.name}`"
            @click="handleConnect(cc)"
          >
            <div flex items-center gap-3>
              <img v-if="images[cc.name]" :src="images[cc.name]" class="w-6 h-6" :alt="cc.name">
              <span v-else aria-hidden="true" block class="i-ri:wallet-line w-6 h-6" />
              <span flex-1 text-start>{{ cc.name }}</span>
            </div>
            <span v-if="isReconnecting || connector?.uid === cc.uid" text-sm text-secondary>
              Connected
            </span>
          </button>
        </div>
      </div>
    </ModalDialog>
  </template>
</template>
