# 8-Ball Pool - Nakama Multiplayer Integration Guide

## ✅ What's Done

### 1. Auto-Start PvP Mode
**File Modified**: `apps/arena/public/8ball-pool/assets/src/12load.js`

**Changes**:
- Skips main menu entirely
- Auto-sets `projectInfo.mode = 2` (Player vs Player)
- Disables tutorial (`projectInfo.tutorial = false`)
- Game launches directly into PvP gameplay

**Result**: Game now loads straight into 2-player local multiplayer.

---

## 🎮 Current Game State

### Game Flow (Now):
```
Boot → Load Assets → Play (PvP Mode)
```

### Features Working:
- ✅ Full physics engine (collisions, friction, spin)
- ✅ Turn-based gameplay (P1 ↔ P2)
- ✅ Game rules (fouls, ball assignment, win conditions)
- ✅ Ball-in-hand on scratch
- ✅ 8-ball win/loss detection
- ✅ Aiming guide
- ✅ Power control
- ✅ Pocket animations

### Inactive Code (Won't Execute):
- ❌ AI logic (wrapped in `projectInfo.mode == 1` checks)
- ❌ Tutorial system (wrapped in `projectInfo.tutorial` checks)
- ❌ Menu screens (skipped in load state)

---

## 🔧 Next Steps: Nakama Integration

### 1. Identify Key Game Events

**File**: `apps/arena/public/8ball-pool/assets/src/15gameController.js`

**Events to Hook**:

#### Shot Taken (Line ~117)
```javascript
// In function r() - when player shoots
a.ballArray[0].velocity = a.aimDirectionVector.times(a.power)
// ADD: Send shot data to Nakama
// { power: a.power, angle: a.cueCanvas.angle, position: a.ballArray[0].position }
```

#### Ball Potted (Line ~209-237)
```javascript
// When ball enters pocket
if ("pocket" == n.contactArray[o].type)
// ADD: Send ball potted event
// { ballId: ball.id, pocketId: pocket.id }
```

#### Turn End (Line ~140-589)
```javascript
// In function s() - after shot complete
1 == a.shotComplete && 0 == a.rulingsApplied
// ADD: Send turn result
// { turn: a.turn, fouled: a.fouled, ballsPotted: a.ballsPotted }
```

#### Game Over (Line ~216-222)
```javascript
if (8 == n.id) {
  a.gameOver = !0
  a.winner = a.turn
}
// ADD: Send game over event
// { winner: a.winner, gameOver: true }
```

---

### 2. State Sync Points

**What to Sync**:
```javascript
// Game state that needs to be synced
{
  turn: a.turn,                    // "p1" or "p2"
  p1TargetType: a.p1TargetType,    // "ANY", "SOLIDS", "STRIPES", "8 BALL"
  p2TargetType: a.p2TargetType,
  shotNum: a.shotNum,
  ballPositions: a.ballArray.map(b => ({
    id: b.id,
    position: { x: b.position.x, y: b.position.y },
    active: b.active
  })),
  cueBallInHand: a.cueBallInHand,
  fouled: a.fouled,
  gameOver: a.gameOver,
  winner: a.winner
}
```

---

### 3. Input Control

**Current**: Both players control locally
**Needed**: Only active player can shoot

**Modification Needed** (Line ~1190):
```javascript
// Wrap input handlers with player check
if (
  (1 == game.input.activePointer.isDown && ...) &&
  (a.turn === currentPlayer) // ADD THIS CHECK
) {
  // Allow input
}
```

---

### 4. Nakama Integration Architecture

```
┌─────────────────────────────────────────┐
│         8-Ball Pool Game                │
│                                         │
│  ┌────────────┐      ┌──────────────┐ │
│  │  Game      │─────▶│  Nakama      │ │
│  │  Events    │      │  Adapter     │ │
│  └────────────┘      └──────────────┘ │
│       │                     │          │
│       │                     ▼          │
│  ┌────▼──────┐      ┌──────────────┐ │
│  │  State    │◀─────│  Nakama      │ │
│  │  Manager  │      │  Client      │ │
│  └───────────┘      └──────────────┘ │
└─────────────────────────────────────────┘
                │
                ▼
        Nakama Server
```

---

## 📝 Implementation Checklist

### Phase 1: Hook Events
- [ ] Add event emitter to game controller
- [ ] Emit shot taken event
- [ ] Emit ball potted event
- [ ] Emit turn end event
- [ ] Emit game over event

### Phase 2: State Management
- [ ] Create state snapshot function
- [ ] Create state apply function
- [ ] Add state sync on turn change

### Phase 3: Nakama Client
- [ ] Initialize Nakama client in Vue
- [ ] Create match system
- [ ] Send/receive game events via match data
- [ ] Handle disconnections/reconnections

### Phase 4: Input Control
- [ ] Lock input to active player only
- [ ] Show waiting indicator for remote player
- [ ] Handle latency/prediction

---

## 🚀 Quick Test

**File**: `apps/arena/app/pages/[game]/play.vue`

Navigate to: `/8ball-pool/play`

**Expected Behavior**:
1. ✅ Game loads (no menu)
2. ✅ Shows pool table with racked balls
3. ✅ Player 1 can aim and shoot
4. ✅ Turn switches to Player 2 after shot
5. ✅ Game follows 8-ball rules

---

## 📚 Key Files Reference

| File | Purpose | Lines to Hook |
|------|---------|--------------|
| `15gameController.js` | Main game logic | 117 (shoot), 140-589 (rules), 1190+ (input) |
| `03contactListener.js` | Collision events | 209-237 (pockets) |
| `14setup.js` | Game initialization | 367+ (setup) |
| `16boot.js` | Entry point | 43 (state flow) |

---

## 💡 Next Action

Test the cleaned-up game:
1. Navigate to the game page
2. Verify it auto-starts in PvP mode
3. Play a full game locally to ensure everything works
4. Then begin Nakama integration

**Questions?**
- Need help with Nakama setup?
- Want to implement event hooks?
- Ready to create the adapter layer?

Let me know what you want to tackle next! 🎱

