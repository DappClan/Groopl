# 8 Ball Pool - 2 Player Game

A 2-player 8-ball pool game built with Phaser.js for Nuxt 3.

## Features

- ✅ 2-player local multiplayer
- ✅ Realistic ball physics and collisions
- ✅ Accurate cushion bouncing
- ✅ Ball pocketing with animations
- ✅ Turn-based gameplay
- ✅ Automatic ball type assignment (solids/stripes)
- ✅ Foul detection and handling
- ✅ Win condition detection
- ✅ Cue ball in hand after scratches
- ✅ Power bar for shot strength
- ✅ Aiming guide line
- ✅ Sound effects (cue hit, ball collision, cushion hit, pocket)

## How to Play

### Controls

1. **Aiming**: Click and hold near the cue ball, then move your pointer to aim
2. **Power**: Drag backwards (opposite to your aim direction) to set power
3. **Shoot**: Release to shoot with the set power

### Rules

- Players take turns shooting
- On the first shot, whoever pockets a ball gets assigned that type (solids 1-7 or stripes 9-15)
- Players must hit their assigned ball type first
- A ball or the cue ball must hit a cushion after contact (unless a ball is pocketed)
- Pocket all your balls, then the 8-ball to win
- Scratching (pocketing the cue ball) is a foul - opponent gets ball in hand
- Pocketing the 8-ball before clearing your balls = loss
- Failing to hit your ball type first = foul

## Game Structure

```text
8Ball/
├── PoolGame.vue           # Main Vue component
├── scenes/
│   ├── BootScene.ts       # Asset loading scene
│   └── GameScene.ts       # Main game scene
├── objects/
│   ├── Ball.ts            # Ball physics and rendering
│   └── Table.ts           # Table and pocket setup
├── controllers/
│   └── CueController.ts   # Cue aiming and shooting
├── managers/
│   └── GameManager.ts     # Game rules and turn logic
└── index.ts               # Exports
```

## Assets Used

The game uses assets from the existing 8ball-pool folder:

- `/8ball-pool/assets/img/` - Ball sprites, table textures, UI elements
- `/8ball-pool/assets/audio/` - Sound effects
- `/8ball-pool/assets/fonts/` - Bitmap fonts

## Integration

The game is automatically integrated into the dynamic game routing system:

### Access via Route

Navigate to: **`/8ball-pool/play`**

The game will render within the game layout with:
- Game banner header
- Navigation tabs (Play / How to Play)
- Full game integration

### Manual Integration

You can also import the component directly:

```vue
<script setup>
import { PoolGame } from '@/games/8Ball'
</script>

<template>
  <PoolGame />
</template>
```

## Development Notes

- Built with Phaser 3.80.1
- Uses Phaser's Arcade physics for simplicity
- Custom collision detection for realistic pool physics
- Ball rendering uses dynamically generated textures
- Turn management via GameManager
- Foul detection follows standard 8-ball rules
