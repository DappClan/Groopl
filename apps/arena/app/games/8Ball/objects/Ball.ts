import Phaser from 'phaser'

/**
 * EXACT implementation of Ball from 02Ball.js
 * Extends Container to match original Phaser.Group behavior
 */
export class Ball extends Phaser.GameObjects.Container {
  // EXACT properties from original
  public ballRotation: number[] = [1, 0, 0, 0] // [w, x, y, z] quaternion
  public rX: number = 0
  public rY: number = 0
  public rZ: number = 0
  public circRad: number = 0
  public sprite!: Phaser.GameObjects.Sprite
  public spotHolder!: Phaser.GameObjects.Container
  public spot!: Phaser.GameObjects.Sprite
  public shade!: Phaser.GameObjects.Sprite
  public ballColor: any
  public ballType: number // 0 for solid (1-8), 1 for striped (9-15)

  constructor(scene: Phaser.Scene, circRad: number, ballId: number) {
    super(scene, 0, 0)

    this.circRad = circRad

    // Determine ball type and sprite sheet - EXACT as original
    let spriteSheet: string
    if (ballId <= 8) {
      this.ballType = 0
      spriteSheet = 'solidsSpriteSheet'
    }
    else {
      this.ballType = 1
      spriteSheet = `ballSpriteSheet${ballId}`
    }

    // Create main ball sprite - EXACT as original
    this.sprite = scene.add.sprite(0, 0, spriteSheet)
    this.sprite.width = 2 * this.circRad
    this.sprite.height = 2 * this.circRad
    this.sprite.setOrigin(0.5, 0.5)
    this.add(this.sprite)

    // Set frame for solid balls - EXACT as original
    if (this.ballType !== 1) {
      this.sprite.setFrame(ballId)
    }

    // Create spot holder (number container) - EXACT as original
    this.spotHolder = scene.add.container(0, 0)
    this.spot = scene.add.sprite(0, 0, 'spotSpriteSheet')
    this.spot.setOrigin(0.5, 0.5)
    this.spotHolder.add(this.spot)
    this.spot.setFrame(ballId)
    this.spot.alpha = 1
    this.add(this.spotHolder)

    // Create shade overlay - EXACT as original
    this.shade = scene.add.sprite(0, 0, 'shade')
    this.add(this.shade)
    this.shade.setOrigin(0.5, 0.5)
    this.shade.width = 2.1 * circRad
    this.shade.height = 2.1 * circRad

    // Initialize with random rotation - EXACT as original
    this.updateRotation(
      10 * Math.random() - 5,
      10 * Math.random() - 5,
      10 * Math.random() - 5,
    )

    // Add container to scene
    scene.add.existing(this)
  }

  // EXACT copy from original Ball.prototype.updateRotation
  public updateRotation(t: number, s: number, h: number) {
    const i = -t
    const a = h
    const o = s
    const r = Math.sqrt(i * i + a * a + o * o)

    if (r > 0.01) {
      this.ballRotation = this.rotateQuat(this.ballRotation, a / r, i / r, o / r, r / this.circRad)
      this.ballRotation = this.normalize(this.ballRotation)
      this.renderBall(this.ballRotation)
    }
  }

  // EXACT copy from original Ball.prototype.renderBall
  private renderBall(t: number[]) {
    const s = t[0]
    const h = t[1]
    const i = t[2]
    const a = t[3]

    // Calculate Euler angles from quaternion - EXACT formulas
    const o = Math.atan2(2 * s * a - 2 * h * i, 1 - 2 * s * s - 2 * i * i) + Math.PI
    const r = Math.asin(2 * h * s + 2 * i * a) + Math.PI
    const e = Math.atan2(2 * h * a - 2 * s * i, 1 - 2 * h * h - 2 * i * i) + Math.PI
    const l = h * s + i * a

    // Check for gimbal lock - EXACT as original
    if (l > 0.499 || l < -0.499) {
      return
    }

    // Set ball angle - EXACT as original
    this.angle = 180 / Math.PI * o

    // Set shade counter-rotation - EXACT as original
    this.shade.angle = -this.angle

    // Update stripe animation for striped balls - EXACT as original
    if (this.ballType === 1) {
      const p = (r - 0.5 * Math.PI) / Math.PI
      this.sprite.setFrame(41 - Math.round(41 * p))
    }

    // Reset spot holder - EXACT as original
    this.spotHolder.x = 0
    this.spotHolder.y = 0
    this.spotHolder.angle = 0
    this.spot.x = 0
    this.spot.y = 0
    this.spot.angle = 0
    this.spot.width = 1 * this.circRad
    this.spot.height = 1 * this.circRad

    // Calculate spot position based on 3D rotation - EXACT logic as original
    if (r < Math.PI / 2 || r > 3 * Math.PI / 2) {
      if (e > Math.PI / 2 && e < 3 * Math.PI / 2) {
        this.spotHolder.y = this.circRad * Math.cos(e) * Math.sin(r)
        this.spotHolder.x = this.circRad * Math.sin(e)
      }
      else {
        this.spotHolder.y = -this.circRad * Math.cos(e) * Math.sin(r)
        this.spotHolder.x = -this.circRad * Math.sin(e)
      }
    }
    else {
      if (e > Math.PI / 2 && e < 3 * Math.PI / 2) {
        this.spotHolder.y = -this.circRad * Math.cos(e) * Math.sin(r)
        this.spotHolder.x = -this.circRad * Math.sin(e)
      }
      else {
        this.spotHolder.y = this.circRad * Math.cos(e) * Math.sin(r)
        this.spotHolder.x = this.circRad * Math.sin(e)
      }
    }

    // Calculate foreshortening and rotation - EXACT as original
    const n = Math.sqrt(this.spotHolder.x * this.spotHolder.x + this.spotHolder.y * this.spotHolder.y) / this.circRad
    const d = Math.cos(n * Math.PI / 2)
    const c = Math.atan2(this.spotHolder.y, this.spotHolder.x)

    // Apply scale, rotation, and alpha - EXACT as original
    this.spotHolder.setScale(1, d)
    this.spotHolder.angle = 180 / Math.PI * c + 90
    this.spot.angle = -this.spotHolder.angle
    this.spot.alpha = d + 0.2
  }

  // EXACT copy from original Ball.prototype.rotateQuat
  private rotateQuat(t: number[], s: number, h: number, i: number, a: number): number[] {
    const o = Math.sqrt(s * s + h * h + i * i)
    const r = s / o
    const e = h / o
    const l = i / o
    const p = Math.sin(0.5 * a)
    const n = r * p
    const d = e * p
    const c = l * p
    const M = Math.cos(0.5 * a)
    const P = t[0]
    const y = t[1]
    const H = t[2]
    const R = t[3]

    const g = P * M + y * c - H * d + R * n
    const b = -P * c + y * M + H * n + R * d
    const u = P * d - y * n + H * M + R * c
    const m = -P * n - y * d - H * c + R * M

    const w: number[] = []
    w[0] = g
    w[1] = b
    w[2] = u
    w[3] = m

    return w
  }

  // EXACT copy from original Ball.prototype.normalize
  private normalize(t: number[]): number[] {
    const s = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3])
    const h: number[] = []
    h[0] = t[0] / s
    h[1] = t[1] / s
    h[2] = t[2] / s
    h[3] = t[3] / s
    return h
  }
}
