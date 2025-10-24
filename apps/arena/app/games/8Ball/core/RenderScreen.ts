// EXACT implementation of 08render.js
export function renderScreen(gameInfo: any, scene?: any) {
  const a = gameInfo

  // Get center offset (gameCanvas position) - Phaser 3 world coordinates
  const centerX = scene ? scene.cameras.main.width / 2 : 0
  const centerY = scene ? scene.cameras.main.height / 2 : 0

  for (let c = 0; c < a.ballArray.length; c++) {
    const y = a.ballArray[c]

    if (y.active === 1) {
      // Position the Ball container - EXACT as original (relative to gameCanvas center)
      const localX = y.position.x * a.physScale
      const localY = y.position.y * a.physScale

      y.mc.x = centerX + localX
      y.mc.y = centerY + localY

      // Update shadow position with parallax effect - EXACT as original
      y.shadow.x = centerX + localX + 0.7 * a.ballRadius * a.physScale * (localX / 720)
      y.shadow.y = centerY + localY + 0.7 * a.ballRadius * a.physScale * (localY / 360)

      // Update marker - EXACT as original
      y.marker.x = centerX + localX
      y.marker.y = centerY + localY

      // Update mover (cue ball only) - EXACT as original
      if (c === 0) {
        y.mover.x = centerX + localX
        y.mover.y = centerY + localY
      }

      // Update rotation - EXACT as original
      y.mc.updateRotation(
        y.velocity.x * a.physScale * y.grip,
        y.velocity.y * a.physScale * y.grip,
        y.ySpin,
      )
    }
  }
}
