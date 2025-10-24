<script setup lang="ts">
import Phaser from 'phaser'
import { onMounted, onUnmounted } from 'vue'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameSceneNew'

let game: Phaser.Game | null = null

onMounted(() => {
  if (import.meta.client) {
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
  }
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<template>
  <div id="pool-game" class="pool-game-container" />
</template>

<style scoped>
.pool-game-container {
  width: 100vw;
  height: 100vh;
  background-color: #1a472a;
  overflow: hidden;
}

#pool-game {
  width: 100%;
  height: 100%;
}
</style>
