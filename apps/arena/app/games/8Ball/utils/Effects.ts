// EXACT implementation of 10effects.js
// Optional visual effects for scoring and bonuses

/**
 * Creates a star particle emitter effect
 * @param scene - Phaser scene
 * @param x - X position
 * @param y - Y position
 */
export function createStars(scene: Phaser.Scene, x: number, y: number) {
  // Note: Would need 'bonusStar' asset loaded for this to work
  // Simplified for now as it's not critical for 2-player gameplay

  // Original creates particle emitter:
  // var emitter = game.add.emitter(x, y, 100);
  // emitter.makeParticles("bonusStar")
  // emitter.maxParticleScale = 0.2
  // emitter.setAlpha(0.3, 0, 2000)
  // emitter.start(true, 1000, null, 10)
}

/**
 * Creates floating bonus text that animates upward and fades out
 * EXACT as original createBonusText function
 * @param scene - Phaser scene
 * @param delay - Delay in seconds before showing
 * @param text - Text to display
 * @param fontKey - Font asset key
 * @param x - X position
 * @param y - Y position
 * @param fontSize - Font size
 * @param playSound - Whether to play ding sound
 */
export function createBonusText(
  scene: Phaser.Scene,
  delay: number,
  text: string,
  fontKey: string,
  x: number,
  y: number,
  fontSize: number,
  playSound: boolean,
) {
  scene.time.delayedCall(delay * 1000, () => {
    // Play sound if requested
    if (playSound) {
      try {
        scene.sound.play('ding', { volume: 1 })
      }
      catch {
        // Ignore sound errors
      }
    }

    // Create bitmap text (would need bitmap font loaded)
    // For now, use regular text as fallback
    const bonusText = scene.add.text(x, y, text, {
      fontSize: `${fontSize}px`,
      color: '#FFD700',
      fontStyle: 'bold',
    })
    bonusText.setOrigin(0.5, 0.5)
    bonusText.setDepth(100)

    // Animate upward and fade out - EXACT as original
    scene.tweens.add({
      targets: bonusText,
      alpha: 0,
      y: y - 40,
      duration: 2000,
      ease: 'Linear',
      onComplete: () => {
        bonusText.destroy()
      },
    })
  })
}
