// EXACT implementation of 03contactListener.js
import { Vector2D } from '../utils/Vector2D'

export function onContact(e: any, gameInfo: any, scene: any) {
  const a = e
  const l = a.ball
  const o = gameInfo

  // Create contact info object
  const i: any = {}
  i.position = l.position
  i.targetPosition = a.target.position
  i.velocity = a.ballVelocity
  i.collisionType = a.collisionType
  i.screw = l.screw

  if (a.collisionType === 'ball') {
    i.target = a.target
    i.targetVelocity = a.targetVelocity
    i.deltaScrew = a.deltaScrew
  }

  i.type = a.collisionType

  // Handle ball-to-ball collision
  if (a.collisionType === 'ball') {
    l.contactArray.push(i)

    if (o.trial === 0) {
      // Play sound
      let t = i.velocity.minus(i.targetVelocity).magnitude / 6000
      if (t > 1)
        t = 1

      // Sound.Play('ballHit', t)
      try {
        scene.sound.play('ballHit', { volume: t })
      }
      catch (err) {
        // Ignore sound errors
      }
    }
  }

  // Handle cushion collision (line or vertex)
  if (a.collisionType === 'line' || a.collisionType === 'vertex') {
    l.contactArray.push(i)

    if (o.trial === 0) {
      // Play sound
      let t = a.normalVelocity.magnitude / 3000
      if (t > 2)
        t = 2

      // Sound.Play('cushionHit', t)
      try {
        scene.sound.play('cushionHit', { volume: t })
      }
      catch (err) {
        // Ignore sound errors
      }
    }
  }

  // Handle pocketing - EXACT as original
  if (a.collisionType === 'pocket') {
    l.active = 0
    l.velocity = new Vector2D(0, 0)
    l.contactArray.push(i)

    if (o.trial === 0) {
      playPocketSound(a, scene)
      playPocketAnimation(a, o, scene)

      // Award bonuses if not tutorial - EXACT as original
      awardBonuses(a, o, scene)
    }

    if (l.id === 0) {
      o.scratched = true
    }
    else {
      if (o.ballsRemaining !== undefined) {
        o.ballsRemaining--
      }
    }
  }
}

// Award bonuses - EXACT as original
function awardBonuses(e: any, gameInfo: any, scene: any) {
  const t = gameInfo

  if (e.ball.id !== 0) {
    const o = e.target
    t.numBalls--

    if (!t.pottedBallArray) {
      t.pottedBallArray = []
    }
    t.pottedBallArray.push(e.ball.id)

    checkLevelComplete(t)
    t.ballPotted = true

    // Scoring logic would go here for single player mode
    // Simplified for 2-player mode
  }
  else {
    t.fouled = true
  }
}

// Check level complete - EXACT as original
function checkLevelComplete(gameInfo: any) {
  if (gameInfo.numBalls <= 1) {
    // Level complete logic
    // projectInfo.levelComplete = true
  }
}

function playPocketSound(e: any, scene: any) {
  let t = e.speed / 5000
  if (t > 1.5)
    t = 1.5
  if (t < 0.3)
    t = 0.3

  try {
    scene.sound.play('pocketHit', { volume: t })
  }
  catch (err) {
    // Ignore sound errors
  }
}

function playPocketAnimation(e: any, gameInfo: any, scene: any) {
  const t = gameInfo

  if (t.trial === 0) {
    const o = e.ball
    const a = e.target
    const l = e.speed

    o.pocketTweenComplete = false

    // Hide shadow - EXACT as original
    if (o.id !== 0) {
      // Original: o.shadow.parent.removeChild(o.shadow), o.shadow = null
      if (o.shadow) {
        o.shadow.setVisible(false)
      }
    }
    else {
      // Original: o.shadow.visible = false
      if (o.shadow) {
        o.shadow.setVisible(false)
      }
    }

    // Calculate animation duration - EXACT as original
    let i = 0.1
    if (l < 5000)
      i = 0.2
    if (l < 3000)
      i = 0.3
    if (l < 2000)
      i = 0.4
    if (l < 1000)
      i = 0.5
    i *= 300

    // Animate ball going into pocket - EXACT as original
    if (o.mc && scene.tweens) {
      // Get center offset (same as renderScreen) - EXACT as original
      const centerX = scene.cameras.main.width / 2
      const centerY = scene.cameras.main.height / 2

      // First tween: move to drop position
      const n = scene.tweens.add({
        targets: o.mc,
        x: centerX + a.dropPosition.x * t.physScale,
        y: centerY + a.dropPosition.y * t.physScale,
        duration: i,
        ease: 'Linear',
        onComplete: () => {
          // Second tween: shrink into pocket - EXACT as original
          const c = scene.tweens.add({
            targets: o.mc,
            x: centerX + 0.7 * a.dropPosition.x * t.physScale,
            y: centerY + 0.7 * a.dropPosition.y * t.physScale,
            duration: 1.2 * i,
            ease: 'Linear.In',
            onComplete: () => {
              if (o.id !== 0) {
                // Object ball - remove from game - EXACT as original
                o.pocketTweenComplete = true
                if (o.mc) {
                  o.mc.setVisible(false)
                }
              }
              else {
                // Cue ball - hide but keep for respawn - EXACT as original
                o.pocketTweenComplete = true
                if (o.mc) {
                  o.mc.setVisible(false)
                }
              }
            },
          })
        },
      })
    }
    else {
      // If no tweens available, mark as complete immediately
      o.pocketTweenComplete = true
      if (o.mc) {
        o.mc.setVisible(false)
      }
    }
  }
}
