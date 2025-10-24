import type Phaser from 'phaser'
import type { Ball } from '../objects/Ball'

export class CueController {
  private scene: Phaser.Scene
  private cueBall: Ball
  private cue!: Phaser.GameObjects.Sprite
  private cueShadow!: Phaser.GameObjects.Sprite
  private guideLine!: Phaser.GameObjects.Graphics
  private powerBar!: Phaser.GameObjects.Graphics
  private isAiming: boolean = false
  private isDragging: boolean = false
  private dragStart: { x: number, y: number } = { x: 0, y: 0 }
  private aimAngle: number = 0
  private power: number = 0
  private maxPower: number = 5000 // Match original physics
  private visible: boolean = true
  private cueBallInHand: boolean = false

  constructor(scene: Phaser.Scene, cueBall: Ball) {
    this.scene = scene
    this.cueBall = cueBall

    this.createCue()
    this.createGuideLine()
    this.createPowerBar()
  }

  private createCue() {
    // Create cue shadow
    this.cueShadow = this.scene.add.sprite(0, 0, 'cueShadow')
    this.cueShadow.setOrigin(1, 0.5)
    this.cueShadow.setScale(0.6)
    this.cueShadow.setAlpha(0.5)
    this.cueShadow.setDepth(2)

    // Create cue
    this.cue = this.scene.add.sprite(0, 0, 'cue')
    this.cue.setOrigin(1, 0.5)
    this.cue.setScale(0.6)
    this.cue.setDepth(3)
  }

  private createGuideLine() {
    this.guideLine = this.scene.add.graphics()
    this.guideLine.setDepth(1)
  }

  private createPowerBar() {
    this.powerBar = this.scene.add.graphics()
    this.powerBar.setDepth(10)
  }

  onPointerDown(pointer: Phaser.Input.Pointer) {
    if (this.cueBallInHand) {
      // Check if clicking on table to place cue ball
      this.handleCueBallPlacement(pointer)
      return
    }

    const dx = pointer.x - this.cueBall.sprite.x
    const dy = pointer.y - this.cueBall.sprite.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // If clicking near cue ball, start aiming
    if (distance < 150) {
      this.isAiming = true
      this.dragStart = { x: pointer.x, y: pointer.y }
      this.aimAngle = Math.atan2(dy, dx)
    }
  }

  onPointerMove(pointer: Phaser.Input.Pointer) {
    if (this.cueBallInHand) {
      this.updateCueBallPlacement(pointer)
      return
    }

    if (this.isAiming) {
      const dx = pointer.x - this.cueBall.sprite.x
      const dy = pointer.y - this.cueBall.sprite.y
      this.aimAngle = Math.atan2(dy, dx)

      // Calculate power based on drag distance
      const dragDx = this.dragStart.x - pointer.x
      const dragDy = this.dragStart.y - pointer.y
      const dragDistance = Math.sqrt(dragDx * dragDx + dragDy * dragDy)

      // Check if dragging in opposite direction of aim
      const dragAngle = Math.atan2(dragDy, dragDx)
      const angleDiff = Math.abs(this.normalizeAngle(dragAngle - this.aimAngle))

      if (angleDiff > Math.PI / 2) {
        this.isDragging = true
        this.power = Math.min(dragDistance * 3, this.maxPower)
      }
      else {
        this.power = 0
      }
    }
  }

  onPointerUp(pointer: Phaser.Input.Pointer) {
    if (this.cueBallInHand) {
      this.placeCueBall(pointer)
      return
    }

    if (this.isAiming && this.isDragging && this.power > 50) {
      this.shoot()
    }

    this.isAiming = false
    this.isDragging = false
    this.power = 0
  }

  private shoot() {
    const vx = Math.cos(this.aimAngle) * this.power
    const vy = Math.sin(this.aimAngle) * this.power

    this.cueBall.applyForce(vx, vy)

    // Play cue hit sound
    const volume = Math.min(this.power / this.maxPower, 1)
    this.scene.sound.play('cueHit', { volume })

    // Hide cue during shot
    this.hide()

    // Animate cue strike
    const cueDistance = 100 + (this.power / this.maxPower) * 50
    const strikeX = this.cueBall.sprite.x - Math.cos(this.aimAngle) * cueDistance
    const strikeY = this.cueBall.sprite.y - Math.sin(this.aimAngle) * cueDistance

    this.scene.tweens.add({
      targets: [this.cue, this.cueShadow],
      x: strikeX,
      y: strikeY,
      duration: 150,
      ease: 'Power2',
      yoyo: true,
    })
  }

  update() {
    if (!this.visible) {
      // Show cue again when all balls have stopped
      if (!this.cueBall.isMoving()) {
        this.show()
      }
      return
    }

    if (this.cueBallInHand) {
      this.cue.setVisible(false)
      this.cueShadow.setVisible(false)
      this.guideLine.clear()
      this.powerBar.clear()
      return
    }

    // Update cue position and rotation
    const offset = 80 + (this.isDragging ? this.power / 10 : 0)
    const cueX = this.cueBall.sprite.x - Math.cos(this.aimAngle) * offset
    const cueY = this.cueBall.sprite.y - Math.sin(this.aimAngle) * offset

    this.cue.setPosition(cueX, cueY)
    this.cue.setRotation(this.aimAngle)

    this.cueShadow.setPosition(cueX, cueY + 3)
    this.cueShadow.setRotation(this.aimAngle)

    // Draw guide line
    this.drawGuideLine()

    // Draw power bar
    if (this.isDragging && this.power > 0) {
      this.drawPowerBar()
    }
    else {
      this.powerBar.clear()
    }
  }

  private drawGuideLine() {
    this.guideLine.clear()

    if (!this.isAiming)
      return

    this.guideLine.lineStyle(2, 0xFFFFFF, 0.5)

    const length = 300
    const startX = this.cueBall.sprite.x
    const startY = this.cueBall.sprite.y
    const _endX = startX + Math.cos(this.aimAngle) * length
    const _endY = startY + Math.sin(this.aimAngle) * length

    // Draw dashed line
    const dashLength = 10
    const gapLength = 10
    let currentDistance = 0

    while (currentDistance < length) {
      const x1 = startX + Math.cos(this.aimAngle) * currentDistance
      const y1 = startY + Math.sin(this.aimAngle) * currentDistance
      const x2 = startX + Math.cos(this.aimAngle) * Math.min(currentDistance + dashLength, length)
      const y2 = startY + Math.sin(this.aimAngle) * Math.min(currentDistance + dashLength, length)

      this.guideLine.beginPath()
      this.guideLine.moveTo(x1, y1)
      this.guideLine.lineTo(x2, y2)
      this.guideLine.strokePath()

      currentDistance += dashLength + gapLength
    }
  }

  private drawPowerBar() {
    this.powerBar.clear()

    const barWidth = 200
    const barHeight = 20
    const barX = this.scene.cameras.main.width / 2 - barWidth / 2
    const barY = this.scene.cameras.main.height - 80

    // Background
    this.powerBar.fillStyle(0x000000, 0.7)
    this.powerBar.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10)

    // Border
    this.powerBar.lineStyle(2, 0xFFFFFF, 1)
    this.powerBar.strokeRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10)

    // Power fill
    const powerWidth = (this.power / this.maxPower) * barWidth
    const powerColor = this.power < this.maxPower * 0.3
      ? 0x4CAF50
      : this.power < this.maxPower * 0.7
        ? 0xFFEB3B
        : 0xFF5722

    this.powerBar.fillStyle(powerColor, 1)
    this.powerBar.fillRect(barX, barY, powerWidth, barHeight)

    // Power text
    const powerPercent = Math.round((this.power / this.maxPower) * 100)
    const text = this.scene.add.text(
      this.scene.cameras.main.width / 2,
      barY - 30,
      `Power: ${powerPercent}%`,
      { fontSize: '20px', color: '#ffffff', fontFamily: 'Arial' },
    )
    text.setOrigin(0.5, 0.5)
    text.setDepth(10)

    // Remove text after a moment
    this.scene.time.delayedCall(100, () => {
      text.destroy()
    })
  }

  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2
    while (angle < -Math.PI) angle += Math.PI * 2
    return angle
  }

  hide() {
    this.visible = false
    this.cue.setVisible(false)
    this.cueShadow.setVisible(false)
    this.guideLine.clear()
    this.powerBar.clear()
  }

  show() {
    this.visible = true
    this.cue.setVisible(true)
    this.cueShadow.setVisible(true)
  }

  setCueBallInHand(inHand: boolean) {
    this.cueBallInHand = inHand
    if (inHand) {
      this.hide()
    }
  }

  private handleCueBallPlacement(_pointer: Phaser.Input.Pointer) {
    // Visual feedback
    this.cueBall.sprite.setAlpha(0.7)
  }

  private updateCueBallPlacement(pointer: Phaser.Input.Pointer) {
    // Follow pointer
    this.cueBall.setPosition(pointer.x, pointer.y)
  }

  private placeCueBall(pointer: Phaser.Input.Pointer) {
    this.cueBall.setPosition(pointer.x, pointer.y)
    this.cueBall.sprite.setAlpha(1)
    this.cueBallInHand = false
    this.show()
  }
}
