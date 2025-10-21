import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/core'
import type { EffectScope, Ref } from 'vue'
import type { NetworkConfig, NetworkName } from '~/config'
import { useWalletInterface } from '~/composables/wallet/useWalletInterface'
import { appConfig } from '~/config'
import { networkConfig } from '~/config/networks'
import {
  STORAGE_KEY_CURRENT_WALLET,
  STORAGE_KEY_HEDERA_NETWORK,
  STORAGE_KEY_TOKEN_BALANCES,
  STORAGE_KEY_WALLETS,
} from '~/constants'
import { isWalletConnected } from './wallet/initialization'

export interface WalletConnection {
  accountId: string // "0.0.12345"
  evmAddress?: string // "0x..." (for Metamask)
  network: 'mainnet' | 'testnet' | 'previewnet'
  provider: 'walletconnect' | 'metamask' | 'blade' | 'hashpack'
  publicKey: string
  connectedAt: number // timestamp
}

export interface PlayerProfile {
  accountId: string
  username: string
  avatar?: string
  level: number
  xp: number
  totalGamesPlayed: number
  totalWins: number
  createdAt: number
}

export interface WalletSession {
  connection: WalletConnection
  profile?: PlayerProfile
  hbarBalance: string // Store as string to avoid precision issues
  tokenBalances: Record<string, string> // tokenId -> balance
  nftIds: string[] // List of owned NFT token IDs
  lastBalanceUpdate: number
}

export interface TokenBalance {
  tokenId: string
  symbol: string
  balance: string
  decimals: number
}

// Stored wallets (support multiple wallets like MetaMask accounts)
const walletSessions: Ref<WalletSession[]> | RemovableRef<WalletSession[]>
  = import.meta.server
    ? ref<WalletSession[]>([])
    : useLocalStorage<WalletSession[]>(STORAGE_KEY_WALLETS, [], { deep: true })

// Current active wallet account ID
export const currentWalletAccountId = useLocalStorage<string>(
  STORAGE_KEY_CURRENT_WALLET,
  '',
)

// Hedera network selection
export const hederaNetwork = useLocalStorage<NetworkName>(
  STORAGE_KEY_HEDERA_NETWORK,
  'testnet',
)

export function useHederaNetwork() {
  return appConfig.networks[hederaNetwork.value]
}

// Token balances cache (updated periodically)
const _tokenBalancesCache = useLocalStorage<Record<string, TokenBalance[]>>(
  STORAGE_KEY_TOKEN_BALANCES,
  {},
  { deep: true },
)

const { accountId: walletAccountId } = useWalletInterface()

export const currentWallet = computed<WalletSession | undefined>(() => {
  // Sync with actual wallet interface
  if (walletAccountId.value) {
    const accountId = walletAccountId.value
    const sessions = walletSessions.value

    const session = sessions.find(s => s.connection.accountId === accountId || s.connection.evmAddress === accountId)
    if (session) {
      return session
    }

    // Create a temporary session if wallet is connected but no session exists
    return {
      connection: {
        accountId,
        evmAddress: accountId.startsWith('0x') ? accountId : undefined,
        network: hederaNetwork.value,
        provider: accountId.startsWith('0x') ? 'metamask' : 'walletconnect',
        publicKey: '',
        connectedAt: Date.now(),
      },
      hbarBalance: '0',
      tokenBalances: {},
      nftIds: [],
      lastBalanceUpdate: Date.now(),
    }
  }

  return undefined
})

// Helper computed properties for easy access
export const connectedWallet = computed(() => currentWallet.value?.connection)
export const playerProfile = computed(() => currentWallet.value?.profile)
export const hbarBalance = computed(() => currentWallet.value?.hbarBalance ?? '0')

export const currentNetworkConfig = computed<NetworkConfig>(() => {
  return networkConfig[hederaNetwork.value]
})

// Get all wallet sessions
export function useWallets() {
  return walletSessions
}

// Check if a given account ID is the current wallet
export function useIsSelfAccount(accountId: MaybeRefOrGetter<string | undefined>) {
  return computed(() => {
    const id = resolveUnref(accountId)
    return currentWallet.value && id === currentWallet.value.connection.accountId
  })
}

// Get token balance for specific token
export function useTokenBalance(tokenId: MaybeRefOrGetter<string>) {
  return computed(() => {
    const id = resolveUnref(tokenId)
    const balances = currentWallet.value?.tokenBalances
    return balances?.[id] ?? '0'
  })
}

// Check if wallet owns specific NFT
export function useOwnsNFT(tokenId: MaybeRefOrGetter<string>) {
  return computed(() => {
    const id = resolveUnref(tokenId)
    return currentWallet.value?.nftIds.includes(id) ?? false
  })
}

interface UseWalletLocalStorageCache {
  scope: EffectScope
  value: Ref<Record<string, any>>
}

/**
 * Create reactive storage for the current wallet
 * @param key - Storage key
 * @param initial - Initial value factory function
 */
export function useWalletLocalStorage<T extends object>(key: string, initial: () => T): Ref<T> {
  if (import.meta.server)
    return shallowRef(initial())

  // @ts-expect-error bind value to the function
  const map: Map<string, UseWalletLocalStorageCache> = useWalletLocalStorage._ = useWalletLocalStorage._ || new Map()

  if (!map.has(key)) {
    const scope = effectScope(true)
    const value = scope.run(() => {
      const all = useLocalStorage<Record<string, T>>(key, {}, { deep: true })

      return computed(() => {
        const accountId = currentWallet.value?.connection.accountId
          ? currentWallet.value.connection.accountId
          : '[anonymous]'

        // Initialize if doesn't exist
        if (!all.value[accountId]) {
          all.value[accountId] = Object.assign(initial(), all.value[accountId] || {})
        }

        return all.value[accountId]
      })
    })
    map.set(key, { scope, value: value! })
  }

  return map.get(key)!.value as Ref<T>
}

/**
 * Clear all storages for the given wallet
 * @param accountId - Optional wallet account ID to clear (defaults to current wallet)
 */
export function clearWalletLocalStorage(accountId?: string) {
  if (!accountId)
    accountId = currentWallet.value?.connection.accountId
  if (!accountId)
    return

  // @ts-expect-error bind value to the function
  const cacheMap = useWalletLocalStorage._ as Map<string, UseWalletLocalStorageCache> | undefined
  cacheMap?.forEach(({ value }) => {
    if (value.value[accountId!])
      delete value.value[accountId!]
  })
}
