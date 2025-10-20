# Groopl Arena Setup Summary

This document outlines the setup completed for Groopl Arena, a social gaming platform built on Hedera, using Elk's UI patterns and project structure.

## ✅ Completed Setup

### 1. Composables

#### Settings System (`app/composables/settings/`)
- ✅ `definition.ts` - Type definitions for user preferences and settings
- ✅ `storage.ts` - Settings persistence using wallet-based storage
- ✅ `index.ts` - Exports for settings composables

**Key Features:**
- Gaming-specific preferences (grayscale mode, zen mode, FPS counter, graphics quality)
- Wallet-scoped settings (each wallet has its own preferences)
- Font size and theme customization

#### User/Wallet Management (`app/composables/users.ts`)
- ✅ Wallet session management with multi-wallet support
- ✅ Player profile integration
- ✅ Hedera network configuration
- ✅ Token balance tracking
- ✅ NFT ownership tracking
- ✅ `useWalletLocalStorage` - Per-wallet isolated storage (like Elk's `useUserLocalStorage`)

**Key Exports:**
- `currentWallet` - Current active wallet session
- `isWalletConnected` - Connection status
- `connectWallet()` - Wallet connection handler
- `disconnectWallet()` - Disconnect current wallet
- `switchWallet()` - Switch between connected wallets
- `useHederaNetwork()` - Get current network config

#### Command Palette (`app/composables/command.ts`)
- ✅ Removed Mastodon-specific commands
- ✅ Added wallet-specific commands (connect, disconnect, switch)
- ✅ Gaming-focused command scopes
- ✅ Fuzzy search with Fuse.js

#### Other Composables
- ✅ `vue.ts` - Hydration helpers (`isHydrated`, `useHydratedHead`, `onHydrated`)
- ✅ `screen.ts` - Responsive breakpoint helpers
- ✅ `misc.ts` - Utility functions

### 2. Components

#### Navigation (`app/components/nav/`)
- ✅ `NavTitle.vue` - Logo and back button
- ✅ `NavSide.vue` - Updated with gaming navigation:
  - Home
  - Games (browse available games)
  - Rooms (game rooms)
  - Chat (conversations)
  - Profile (player profile)
  - Settings
- ✅ `NavSideItem.vue` - Updated to use `isWalletConnected` instead of `currentUser`

#### Common Components
- ✅ `OfflineChecker.vue` - Network status indicator
- ✅ `CommonTooltip.vue` - Tooltip component
- ✅ Dropdown components
- ✅ PWA components (badge, install prompt)

### 3. Pages (`app/pages/`)

All pages use the default layout with sidebar navigation:

- ✅ `home.vue` - Dashboard with wallet status and quick actions
- ✅ `games.vue` - Game catalog (ready for game cards)
- ✅ `rooms.vue` - Game rooms list with create room button
- ✅ `chat.vue` - Chat interface with conversation list
- ✅ `profile.vue` - Player profile with stats and wallet info
- ✅ `settings.vue` - Comprehensive settings page:
  - Display settings (grayscale, zen mode, FPS counter)
  - Graphics settings (quality, font size)
  - Audio & haptics settings
  - Wallet management

### 4. Middleware

- ✅ `auth.ts` - Protects wallet-only routes, redirects to home if not connected

### 5. Plugins (`app/plugins/`)

- ✅ `0.setup.client.ts` - Sets `isHydrated = true` on client mount
- ✅ `1.scroll-to-top.ts` - Provides `$scrollToTop()` helper
- ✅ `setup-i18n.ts` - i18n initialization with wallet-specific language preferences

### 6. Locales (`app/locales/`)

- ✅ `en-US.json` - Gaming platform translations:
  - Navigation labels
  - Settings descriptions
  - Wallet information
  - Game states
  - Profile stats
  - Common actions

### 7. Configuration Files

#### `nuxt.config.ts`
- ✅ Added `@nuxtjs/i18n` module
- ✅ Configured i18n with English locale
- ✅ Existing modules preserved (UnoCSS, Pinia, VueUse, etc.)

#### `package.json`
- ✅ Added `fuse.js` for command palette fuzzy search
- ✅ Existing dependencies preserved:
  - Hedera SDK & WalletConnect
  - Vue i18n ecosystem
  - Pinia for state management
  - UnoCSS for styling
  - PWA support

#### `.env.example`
- ✅ Hedera network configuration
- ✅ WalletConnect project ID
- ✅ API endpoints
- ✅ Gaming platform settings

### 8. Layout (`app/layouts/default.vue`)

The default layout provides a 3-column structure:
- **Left Sidebar**: Navigation menu with wallet info
- **Center**: Main content area (pages)
- **Right Sidebar**: Network info, wallet balance, player stats

## 🎯 Next Steps

### 1. Install Dependencies

```bash
cd apps/arena
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Update these values:
- `NUXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get from https://cloud.walletconnect.com
- `NUXT_PUBLIC_API_URL` - Your backend API URL
- Other settings as needed

### 3. Implement Wallet Connection

The wallet connection placeholders need implementation in `app/composables/users.ts`:

```typescript
async function connectViaWalletConnect(): Promise<WalletConnection | null> {
  // TODO: Implement using @hashgraph/hedera-wallet-connect
}

async function connectViaMetamask(): Promise<WalletConnection | null> {
  // TODO: Implement using MetaMask Hedera integration
}

async function fetchHbarBalance(accountId: string): Promise<string> {
  // TODO: Fetch from Hedera Mirror Node API
}

async function fetchTokenBalances(accountId: string): Promise<Record<string, string>> {
  // TODO: Fetch from Hedera Mirror Node API
}

async function fetchNFTs(accountId: string): Promise<string[]> {
  // TODO: Fetch from Hedera Mirror Node API
}

async function fetchOrCreatePlayerProfile(accountId: string): Promise<PlayerProfile | undefined> {
  // TODO: Integrate with your backend API
}
```

### 4. Add Game-Specific Features

The foundation is ready for you to add:

#### Games Page
- Fetch available games from your backend
- Display game cards with images, descriptions
- Add filtering and search

#### Rooms Page
- Room creation modal/form
- Real-time room updates (consider WebSocket)
- Join/leave room functionality

#### Chat Page
- Message list and input
- Real-time messaging
- User presence indicators

#### Profile Page
- Edit profile functionality
- Achievement system
- Leaderboards

### 5. Implement Zen Mode

Zen mode is referenced in the layout but needs implementation:

```typescript
// In default.vue layout
const zenMode = usePreferences('zenMode')

// Hide elements when zen mode is active
// Add .zen-hide class to elements that should hide in zen mode
```

### 6. Add More Locales

Create additional locale files in `app/locales/`:
- `es-ES.json` (Spanish)
- `fr-FR.json` (French)
- etc.

Update `nuxt.config.ts`:

```typescript
i18n: {
  locales: [
    { code: 'en-US', file: 'en-US.json', name: 'English' },
    { code: 'es-ES', file: 'es-ES.json', name: 'Español' },
    // ... more locales
  ],
  // ...
}
```

### 7. Set Up Backend Integration

Create API composables in `app/composables/api/`:
- `games.ts` - Game CRUD operations
- `rooms.ts` - Room management
- `chat.ts` - Messaging
- `profile.ts` - Profile management
- `leaderboard.ts` - Rankings and stats

### 8. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
apps/arena/
├── app/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── nav/             # Navigation components
│   │   ├── pwa/             # PWA components
│   │   └── ui/              # UI library components
│   ├── composables/
│   │   ├── settings/        # Settings system
│   │   ├── wallet/          # Wallet integrations
│   │   ├── command.ts       # Command palette
│   │   ├── users.ts         # Wallet/user management
│   │   ├── vue.ts           # Vue helpers
│   │   └── screen.ts        # Responsive helpers
│   ├── layouts/
│   │   ├── default.vue      # Main 3-column layout
│   │   └── landing.vue      # Landing page layout
│   ├── locales/
│   │   └── en-US.json       # English translations
│   ├── middleware/
│   │   └── auth.ts          # Auth middleware
│   ├── pages/
│   │   ├── index.vue        # Landing page
│   │   ├── home.vue         # Dashboard
│   │   ├── games.vue        # Game catalog
│   │   ├── rooms.vue        # Game rooms
│   │   ├── chat.vue         # Chat interface
│   │   ├── profile.vue      # Player profile
│   │   └── settings.vue     # Settings
│   ├── plugins/
│   │   ├── 0.setup.client.ts      # Hydration setup
│   │   ├── 1.scroll-to-top.ts     # Scroll helper
│   │   └── setup-i18n.ts          # i18n initialization
│   ├── constants/
│   ├── config/
│   ├── stores/              # Pinia stores
│   ├── styles/              # Global styles
│   └── utils/
├── .env.example             # Environment template
├── nuxt.config.ts           # Nuxt configuration
├── package.json             # Dependencies
└── SETUP_SUMMARY.md         # This file
```

## 🎨 UI Patterns from Elk

The following patterns have been adapted from Elk:

1. **Per-User Storage**: `useWalletLocalStorage` isolates storage by wallet address
2. **Command Palette**: Fuzzy search for quick navigation (Cmd/Ctrl + K)
3. **Responsive Navigation**: Adaptive layout for mobile/tablet/desktop
4. **Hydration-Aware Rendering**: Prevents SSR mismatches
5. **Settings System**: Hierarchical preferences with persistence
6. **i18n Integration**: Multi-language support with lazy loading
7. **PWA Support**: Installable with offline capabilities

## 🔧 Key Differences from Elk

| Elk (Mastodon Client) | Groopl (Gaming Platform) |
|-----------------------|--------------------------|
| Mastodon API client | Hedera blockchain integration |
| User accounts | Wallet connections |
| Timeline/Posts | Games/Rooms |
| Toots | Chat messages |
| Followers | Friends/Guild members |
| Notifications | Game events/transactions |
| Multiple Mastodon servers | Multiple Hedera networks |

## 🚀 Development Tips

1. **Use the command palette**: Press `Cmd/Ctrl + K` to quickly navigate
2. **Wallet isolation**: Each wallet has separate settings and data
3. **Zen mode**: Perfect for in-game focus (hides distractions)
4. **Responsive design**: Test on mobile - navigation adapts automatically
5. **Hot reload**: Changes to components/pages update instantly
6. **Type safety**: TypeScript provides autocomplete and error checking

## 📚 Resources

- [Nuxt 3 Docs](https://nuxt.com)
- [Vue i18n](https://vue-i18n.intlify.dev/)
- [UnoCSS](https://unocss.dev/)
- [Hedera SDK](https://docs.hedera.com/hedera/sdks-and-apis)
- [WalletConnect](https://docs.walletconnect.com/)
- [Pinia](https://pinia.vuejs.org/)

## 🐛 Troubleshooting

### Hydration Mismatch Errors
- Use `isHydrated` checks for dynamic content
- Use `useHydratedHead` for page titles

### i18n Not Working
- Ensure `@nuxtjs/i18n` is in modules
- Check locale files are in `app/locales/`
- Use `useI18n()` from `~/utils/i18n` (not directly from vue-i18n)

### Wallet Connection Issues
- Verify WalletConnect project ID in `.env`
- Check Hedera network configuration
- Ensure wallet provider is properly initialized

### TypeScript Errors
- Run `pnpm typecheck` to see all errors
- Use `// @ts-expect-error` sparingly with explanations
- Check imports - some may need explicit types

---

**Built with ❤️ using Elk's battle-tested patterns**

Need help? Check the inline comments in the code or refer to Elk's implementation for reference.
