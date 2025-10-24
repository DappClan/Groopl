# Game System Documentation

## Overview

The Arena game system uses dynamic routes and a centralized configuration to make adding new games as simple as possible.

## File Structure

```
app/
├── composables/
│   ├── useGames.ts         # Game configurations
│   └── useGameLoader.ts    # Game loading logic
├── components/
│   └── game/
│       ├── GameCard.vue    # Game card for listings
│       └── Game.vue        # Game page layout
└── pages/
    ├── games.vue           # Games listing page
    ├── [game].vue          # Dynamic game parent route
    └── [game]/             # Dynamic game child routes
        ├── index.vue       # Redirects to play
        ├── play.vue        # Play tab (generic)
        └── howto.vue       # How to Play tab (generic)
```

## Adding a New Game

### Step 1: Add Game Configuration

In `composables/useGames.ts`, add your game to the `games` object:

```typescript
const games: Record<string, GameConfig> = {
  'your-game-slug': {
    id: 'your-game-slug',
    title: 'Your Game Title',
    subtitle: 'Game Subtitle',
    description: 'Short description for the game card',
    icon: 'i-ri:game-fill', // Icon class
    bannerGradient: 'from-purple-600 to-pink-700',
    tags: [
      { text: '2 Players', color: 'primary' },
      { text: 'Available', color: 'green' },
    ],
    available: true,
    tabs: [
      {
        to: '/your-game-slug/play',
        display: 'Play',
        icon: 'i-ri:play-circle-line',
      },
      {
        to: '/your-game-slug/howto',
        display: 'How to Play',
        icon: 'i-ri:question-line',
      },
    ],
  },
}
```

### Step 2: Add Game Loader

In `composables/useGameLoader.ts`, add your game's loading logic to the `loaders` object:

```typescript
const loaders: Record<string, () => Promise<void>> = {
  'your-game-slug': async () => {
    if (isLoading.value || isLoaded.value)
      return

    isLoading.value = true

    try {
      if (process.client) {
        // Load your game's scripts
        await loadScript('/your-game/main.js')
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Store game instance if needed
        if (typeof (window as any).yourGame !== 'undefined')
          gameInstance = (window as any).yourGame
        
        isLoaded.value = true
      }
    }
    catch (error) {
      console.error('Error loading game:', error)
    }
    finally {
      isLoading.value = false
    }
  },
}
```

### Step 3: Add Game Assets

Place your game assets in `public/your-game-slug/`:

```
public/
└── your-game-slug/
    ├── assets/
    │   ├── img/
    │   ├── audio/
    │   └── src/
    └── index.html (if needed)
```

### Step 4: Customize How to Play (Optional)

If you want custom instructions, create a new page at `pages/[game]/howto.vue` with game-specific content, or modify the generic one to detect the game slug and show appropriate content.

## Routes

All games automatically get these routes:

- `/your-game-slug` - Redirects to `/your-game-slug/play`
- `/your-game-slug/play` - Play tab
- `/your-game-slug/howto` - How to Play tab

## Game Card

Games are automatically listed on `/games` using the configuration from `useGames.ts`.

## Tab System

The tab system uses `CommonRouteTabs` for route-based navigation:
- Each tab is a separate route
- Deep linking works automatically
- Browser history is maintained
- Back/forward buttons work correctly

## Example: Adding Chess

```typescript
// In useGames.ts
'chess': {
  id: 'chess',
  title: 'Chess',
  subtitle: 'Classic Strategy',
  description: 'Play chess against a friend',
  icon: 'i-ri:chess-fill',
  bannerGradient: 'from-slate-600 to-zinc-700',
  tags: [
    { text: '2 Players', color: 'primary' },
    { text: 'Turn-Based', color: 'blue' },
  ],
  available: true,
  tabs: [
    { to: '/chess/play', display: 'Play' },
    { to: '/chess/howto', display: 'Rules' },
  ],
}

// In useGameLoader.ts
'chess': async () => {
  await loadScript('/chess/chess-engine.js')
  isLoaded.value = true
}
```

That's it! Your game will now appear in the games list and be fully playable.

