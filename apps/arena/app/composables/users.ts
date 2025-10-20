import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/core'
import type { EffectScope, Ref } from 'vue'
import type { NetworkConfig, NetworkName } from '~/config'
import { appConfig } from '~/config'
import { networkConfig } from '~/config/networks'
import {
  STORAGE_KEY_CURRENT_WALLET,
  STORAGE_KEY_HEDERA_NETWORK,
  STORAGE_KEY_TOKEN_BALANCES,
  STORAGE_KEY_WALLETS,
} from '~/constants'

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
const tokenBalancesCache = useLocalStorage<Record<string, TokenBalance[]>>(
  STORAGE_KEY_TOKEN_BALANCES,
  {},
  { deep: true },
)

export const currentWallet = computed<WalletSession | undefined>(() => {
  const accountId = currentWalletAccountId.value
  const sessions = walletSessions.value

  if (accountId) {
    const session = sessions.find(s => s.connection.accountId === accountId)
    if (session)
      return session
  }

  // Fallback to first wallet if available
  return sessions.length ? sessions[0] : undefined
})

// Helper computed properties for easy access
export const connectedWallet = computed(() => currentWallet.value?.connection)
export const playerProfile = computed(() => currentWallet.value?.profile)
export const hbarBalance = computed(() => currentWallet.value?.hbarBalance ?? '0')
export const isWalletConnected = computed(() => !!currentWallet.value)

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

/**
 * Switch to a different wallet
 * @param session - Wallet session to switch to
 */
export async function switchWallet(session: WalletSession) {
  currentWalletAccountId.value = session.connection.accountId

  // Optionally navigate if needed
  const route = useRoute()
  const router = useRouter()

  // You can add custom navigation logic here if needed
  // For now, we'll just update the active wallet
}

/**
 * Disconnect current wallet
 */
export async function disconnectWallet() {
  if (!currentWallet.value)
    return

  const accountId = currentWallet.value.connection.accountId
  const index = walletSessions.value.findIndex(s => s.connection.accountId === accountId)

  if (index !== -1) {
    // Clear wallet-specific storage
    clearWalletLocalStorage(accountId)

    // Remove the wallet from sessions
    walletSessions.value.splice(index, 1)
  }

  // Set to next wallet or clear
  currentWalletAccountId.value = walletSessions.value[0]?.connection.accountId || ''

  // Navigate to home if no wallets remain
  if (!currentWalletAccountId.value) {
    await useRouter().push('/')
  }
}

export async function connectWallet(
  provider: 'walletconnect' | 'metamask',
): Promise<WalletSession | null> {
  try {
    let connection: WalletConnection | null = null

    // Step 1: Connect based on provider
    switch (provider) {
      case 'walletconnect':
        connection = await connectViaWalletConnect()
        break
      case 'metamask':
        connection = await connectViaMetamask()
        break
    }

    if (!connection) {
      throw new Error('Failed to connect wallet')
    }

    // Step 2: Fetch balances from Hedera Mirror Node
    const [hbarBalance, tokenBalances, nftIds] = await Promise.all([
      fetchHbarBalance(connection.accountId),
      fetchTokenBalances(connection.accountId),
      fetchNFTs(connection.accountId),
    ])

    // Step 3: Fetch or create player profile from your backend
    const profile = await fetchOrCreatePlayerProfile(connection.accountId)

    // Step 4: Create wallet session
    const session: WalletSession = {
      connection,
      profile,
      hbarBalance,
      tokenBalances,
      nftIds,
      lastBalanceUpdate: Date.now(),
    }

    // Step 5: Check if wallet already exists in sessions
    const existingIndex = walletSessions.value.findIndex(
      s => s.connection.accountId === connection.accountId,
    )

    if (existingIndex !== -1) {
      // Update existing session
      walletSessions.value[existingIndex] = session
    }
    else {
      // Add new session
      walletSessions.value.push(session)
    }

    // Step 6: Set as current wallet
    currentWalletAccountId.value = connection.accountId

    return session
  }
  catch (error) {
    console.error('Wallet connection failed:', error)
    return null
  }
}

// Placeholder functions - implement these based on your wallet integration
async function connectViaWalletConnect(): Promise<WalletConnection | null> {
  // TODO: Implement WalletConnect integration
  throw new Error('WalletConnect not implemented yet')
}

async function connectViaMetamask(): Promise<WalletConnection | null> {
  // TODO: Implement Metamask integration
  throw new Error('Metamask not implemented yet')
}

async function fetchHbarBalance(accountId: string): Promise<string> {
  // TODO: Fetch from Hedera Mirror Node
  return '0'
}

async function fetchTokenBalances(accountId: string): Promise<Record<string, string>> {
  // TODO: Fetch from Hedera Mirror Node
  return {}
}

async function fetchNFTs(accountId: string): Promise<string[]> {
  // TODO: Fetch from Hedera Mirror Node
  return []
}

async function fetchOrCreatePlayerProfile(accountId: string): Promise<PlayerProfile | undefined> {
  // TODO: Fetch from your backend or create new profile
  return undefined
}
