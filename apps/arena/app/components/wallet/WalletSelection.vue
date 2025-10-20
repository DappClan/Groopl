<script setup lang="ts">
import { connectToMetamask } from '@/composables/wallet/metamaskClient'
import { openWalletConnectModal } from '@/composables/wallet/walletConnectClient'
import { closeWalletDialog } from '~/composables/dialog'

const busy = ref(false)

async function handleWalletConnect() {
  if (busy.value)
    return
  busy.value = true
  try {
    await openWalletConnectModal()
    closeWalletDialog()
  }
  finally {
    busy.value = false
  }
}

async function handleMetamask() {
  if (busy.value)
    return
  busy.value = true
  try {
    await connectToMetamask()
    closeWalletDialog()
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div flex="~ col" gap-4>
    <h1 text-2xl font-bold>
      {{ $t('wallet.select_provider') }}
    </h1>

    <div flex="~ col" gap-3>
      <button
        type="button"
        flex="~ row"
        gap-x-3
        items-center
        justify-start
        btn-solid
        rounded-3
        px-6
        py-3
        w-full
        :disabled="busy"
        @click="handleWalletConnect"
      >
        <span v-if="busy" aria-hidden="true" block animate-spin>
          <span block i-ri:loader-2-fill />
        </span>
        <span v-else aria-hidden="true" block i-ri:wallet-3-line />
        <span flex-1 text-start>WalletConnect</span>
      </button>

      <button
        type="button"
        flex="~ row"
        gap-x-3
        items-center
        justify-start
        btn-solid
        rounded-3
        px-6
        py-3
        w-full
        :disabled="busy"
        @click="handleMetamask"
      >
        <span v-if="busy" aria-hidden="true" block animate-spin>
          <span block i-ri:loader-2-fill />
        </span>
        <span v-else aria-hidden="true" block i-ri:wallet-line />
        <span flex-1 text-start>MetaMask</span>
      </button>
    </div>
  </div>
</template>
