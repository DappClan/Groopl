export const APP_NAME = 'Groopl'

export const DEFAULT_POST_CHARS_LIMIT = 500
export const DEFAULT_FONT_SIZE = '15px'

export const GROOPL_PAGE_LIFECYCLE_FROZEN = 'groopl-frozen'

export const STORAGE_KEY_SETTINGS = 'groopl-settings'
export const STORAGE_KEY_CURRENT_WALLET = 'groopl-current-wallet'
export const STORAGE_KEY_HEDERA_NETWORK = 'groopl-hedera-network'
export const STORAGE_KEY_TOKEN_BALANCES = 'groopl-token-balances'
export const STORAGE_KEY_WALLETS = 'groopl-wallets'
export const STORAGE_KEY_NOTIFICATION = 'groopl-notification'
export const STORAGE_KEY_NOTIFICATION_POLICY = 'groopl-notification-policy'
export const STORAGE_KEY_PWA_HIDE_INSTALL = 'groopl-pwa-hide-install'
export const STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE = 'groopl-last-accessed-notification-route'
export const STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE = 'groopl-last-accessed-explore-route'
export const STORAGE_KEY_BOTTOM_NAV_BUTTONS = 'groopl-bottom-nav-buttons'

export const NOTIFICATION_FILTER_TYPES = ['status', 'reblog', 'invite', 'friend_request', 'favourite', 'poll', 'update', 'admin.sign_up', 'admin.report']

export const THEME_COLORS = {
  defaultTheme: '#cc7d24',
  themeDark: '#111111',
  themeLight: '#fafafa',
  backgroundDark: '#fafafa',
  backgroundLight: '#111111',
} as const
