<script setup lang="ts">
import Phaser from 'phaser'
import { onMounted, onUnmounted, ref } from 'vue'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameSceneNew'

const gameContainer = ref<HTMLDivElement>()
const gameState = ref(false)
const currentPlayer = ref(1)
const player1Type = ref<string>('')
const player2Type = ref<string>('')
const message = ref<string>('')

let game: Phaser.Game | null = null

onMounted(() => {
  if (!gameContainer.value)
    return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'pool-game',
    width: 1920,
    height: 1080,
    backgroundColor: '#1a472a',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }

  game = new Phaser.Game(config)

  // Listen to game events
  game.events.on('game-ready', () => {
    gameState.value = true
  })

  game.events.on('player-turn', (player: number) => {
    currentPlayer.value = player
  })

  game.events.on('ball-type-assigned', (data: { player: number, type: string }) => {
    if (data.player === 1) {
      player1Type.value = data.type
    }
    else {
      player2Type.value = data.type
    }
  })

  game.events.on('game-message', (msg: string) => {
    message.value = msg
    setTimeout(() => {
      message.value = ''
    }, 3000)
  })
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<template>
  <div class="pool-game-container">
    <div id="pool-game" ref="gameContainer" />
    <div v-if="gameState" class="game-ui">
      <div class="turn-indicator">
        <div class="player-info" :class="{ active: currentPlayer === 1 }">
          <h3>Player 1</h3>
          <p v-if="player1Type">
            {{ player1Type }}
          </p>
        </div>
        <div class="player-info" :class="{ active: currentPlayer === 2 }">
          <h3>Player 2</h3>
          <p v-if="player2Type">
            {{ player2Type }}
          </p>
        </div>
      </div>
      <div v-if="message" class="message">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.pool-game-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 200px); /* Account for header */
  min-height: 600px;
  background: #0a0a0a;
}

#pool-game {
  width: 100%;
  height: 100%;
}

.game-ui {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 10;
}

.turn-indicator {
  display: flex;
  justify-content: space-around;
  max-width: 800px;
  margin: 0 auto;
  gap: 20px;
}

.player-info {
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid #444;
  border-radius: 12px;
  padding: 15px 30px;
  text-align: center;
  transition: all 0.3s ease;
  min-width: 200px;
}

.player-info.active {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.2);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.player-info h3 {
  margin: 0;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.player-info p {
  margin: 8px 0 0;
  color: #ddd;
  font-size: 18px;
}

.message {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
  border: 2px solid #4CAF50;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
