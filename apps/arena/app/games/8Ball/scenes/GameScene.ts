import { CueController } from '../controllers/CueController'
import { GameManager } from '../managers/GameManager'
import { Ball } from '../objects/Ball'
import { Table } from '../objects/Table'

export class GameScene extends Phaser.Scene {
  private balls: Ball[] = []
  private table!: Table
  private cueController!: CueController
  private gameManager!: GameManager
  private cueBall!: Ball

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Setup the table
    this.table = new Table(this)

    // Setup balls
    this.setupBalls()

    // Setup cue controller
    this.cueController = new CueController(this, this.cueBall)

    // Setup game manager
    this.gameManager = new GameManager(this, this.balls, this.cueController)

    // Setup input
    this.input.on('pointerdown', this.onPointerDown, this)
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('pointerup', this.onPointerUp, this)

    // Emit ready event
    this.game.events.emit('game-ready')
    this.game.events.emit('player-turn', 1)
  }

  private setupBalls() {
    // Match original: ballRadius = 1000 * adjustmentScale, displayed at physScale
    const adjustmentScale = 2.3
    const physScale = 0.01
    const ballRadius = 1000 * adjustmentScale * physScale // = 23 pixels
    const tableCenter = { x: this.cameras.main.width / 2, y: this.cameras.main.height / 2 }

    // Cue ball position (left side) - match original: -15000 * adjustmentScale * physScale
    const cueBallX = tableCenter.x - (15000 * adjustmentScale * physScale)
    const cueBallY = tableCenter.y

    // Create cue ball
    this.cueBall = new Ball(this, cueBallX, cueBallY, 0, ballRadius, true)
    this.balls.push(this.cueBall)

    // Rack position (right side) - match original: 15000 * adjustmentScale * physScale
    const rackX = tableCenter.x + (15000 * adjustmentScale * physScale)
    const rackY = tableCenter.y

    // Ball arrangement for 8-ball (standard triangle) - match original with randomness
    const randomOffset1 = 0.05 + 0.05 * Math.random()
    const randomOffset2 = 1 + (0.05 + 0.05 * Math.random())
    const spacing = (1.732 + randomOffset1) * ballRadius
    const rowSpacing = spacing

    // Match original ball arrangement (case 15 from levelData.js)
    // Original uses: l[id] = new Point(i + row*e*ballRadius, col*ballRadius*s)
    const positions = [
      // Row 1 (apex) - ball 1
      { row: 0, col: 0, id: 1 },

      // Row 2 - balls 2, 15
      { row: 1, col: 1, id: 2 }, // Solid
      { row: 1, col: -1, id: 15 }, // Stripe

      // Row 3 - balls 8, 5, 10
      { row: 2, col: 0, id: 8 }, // 8-ball (center)
      { row: 2, col: 2, id: 5 }, // Solid
      { row: 2, col: -2, id: 10 }, // Stripe

      // Row 4 - balls 7, 4, 9, 6
      { row: 3, col: 1, id: 7 }, // Solid
      { row: 3, col: 3, id: 4 }, // Solid
      { row: 3, col: -1, id: 9 }, // Stripe
      { row: 3, col: -3, id: 6 }, // Stripe

      // Row 5 (base) - balls 11, 12, 13, 14, 3
      { row: 4, col: 0, id: 11 }, // Stripe
      { row: 4, col: 2, id: 12 }, // Stripe
      { row: 4, col: -2, id: 13 }, // Stripe
      { row: 4, col: 4, id: 14 }, // Stripe
      { row: 4, col: -4, id: 3 }, // Solid
    ]

    positions.forEach((pos) => {
      const x = rackX + pos.row * rowSpacing
      const y = rackY + pos.col * ballRadius * randomOffset2
      const ball = new Ball(this, x, y, pos.id, ballRadius, false)
      this.balls.push(ball)
    })
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (this.gameManager.canShoot()) {
      this.cueController.onPointerDown(pointer)
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (this.gameManager.canShoot()) {
      this.cueController.onPointerMove(pointer)
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (this.gameManager.canShoot()) {
      this.cueController.onPointerUp(pointer)
    }
  }

  override update(time: number, delta: number) {
    // Update balls physics
    this.balls.forEach((ball) => {
      if (ball.isActive()) {
        ball.update(delta)
      }
    })

    // Check for collisions
    this.checkCollisions()

    // Check for pocketing
    this.checkPocketing()

    // Update game state
    this.gameManager.update()

    // Update cue
    this.cueController.update()
  }

  private checkCollisions() {
    // Ball to ball collisions
    for (let i = 0; i < this.balls.length; i++) {
      const ball1 = this.balls[i]
      if (!ball1.isActive())
        continue

      for (let j = i + 1; j < this.balls.length; j++) {
        const ball2 = this.balls[j]
        if (!ball2.isActive())
          continue

        const dx = ball2.sprite.x - ball1.sprite.x
        const dy = ball2.sprite.y - ball1.sprite.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = ball1.radius + ball2.radius

        if (distance < minDistance) {
          this.resolveBallCollision(ball1, ball2)
        }
      }

      // Ball to cushion collisions
      this.checkCushionCollision(ball1)
    }
  }

  private resolveBallCollision(ball1: Ball, ball2: Ball) {
    const dx = ball2.sprite.x - ball1.sprite.x
    const dy = ball2.sprite.y - ball1.sprite.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0)
      return

    // Normalize
    const nx = dx / distance
    const ny = dy / distance

    // Relative velocity
    const dvx = ball2.velocity.x - ball1.velocity.x
    const dvy = ball2.velocity.y - ball1.velocity.y

    // Relative velocity in collision normal direction
    const dvn = dvx * nx + dvy * ny

    // Do not resolve if velocities are separating
    if (dvn >= 0)
      return

    // Collision impulse (match original ballRestitution = 0.94)
    const restitution = 0.94
    const impulse = -(1 + restitution) * dvn / 2

    // Apply impulse
    ball1.velocity.x -= impulse * nx
    ball1.velocity.y -= impulse * ny
    ball2.velocity.x += impulse * nx
    ball2.velocity.y += impulse * ny

    // Separate balls
    const overlap = (ball1.radius + ball2.radius) - distance
    const separationX = (overlap / 2) * nx
    const separationY = (overlap / 2) * ny

    ball1.sprite.x -= separationX
    ball1.sprite.y -= separationY
    ball2.sprite.x += separationX
    ball2.sprite.y += separationY

    // Play sound
    const speed = Math.sqrt(dvx * dvx + dvy * dvy)
    if (speed > 50) {
      const volume = Math.min(speed / 500, 1)
      this.sound.play('ballHit', { volume })
    }

    // Register collision for game manager
    if (ball1.id === 0) {
      this.gameManager.registerCueBallContact(ball2)
    }
    else if (ball2.id === 0) {
      this.gameManager.registerCueBallContact(ball1)
    }
  }

  private checkCushionCollision(ball: Ball) {
    const cushionBounds = this.table.getCushionBounds()
    const restitution = 0.6 // Match original cushionRestitution
    let hitCushion = false

    // Left cushion
    if (ball.sprite.x - ball.radius < cushionBounds.left) {
      ball.sprite.x = cushionBounds.left + ball.radius
      ball.velocity.x *= -restitution
      hitCushion = true
    }

    // Right cushion
    if (ball.sprite.x + ball.radius > cushionBounds.right) {
      ball.sprite.x = cushionBounds.right - ball.radius
      ball.velocity.x *= -restitution
      hitCushion = true
    }

    // Top cushion
    if (ball.sprite.y - ball.radius < cushionBounds.top) {
      ball.sprite.y = cushionBounds.top + ball.radius
      ball.velocity.y *= -restitution
      hitCushion = true
    }

    // Bottom cushion
    if (ball.sprite.y + ball.radius > cushionBounds.bottom) {
      ball.sprite.y = cushionBounds.bottom - ball.radius
      ball.velocity.y *= -restitution
      hitCushion = true
    }

    if (hitCushion) {
      const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2)
      if (speed > 50) {
        const volume = Math.min(speed / 500, 1)
        this.sound.play('cushionHit', { volume })
      }
      this.gameManager.registerCushionHit()
    }
  }

  private checkPocketing() {
    const pockets = this.table.getPockets()

    this.balls.forEach((ball) => {
      if (!ball.isActive())
        return

      pockets.forEach((pocket) => {
        const dx = ball.sprite.x - pocket.x
        const dy = ball.sprite.y - pocket.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < pocket.radius) {
          this.pocketBall(ball, pocket)
        }
      })
    })
  }

  private pocketBall(ball: Ball, pocket: { x: number, y: number, radius: number }) {
    ball.pocket(pocket.x, pocket.y)

    // Play sound
    const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2)
    const volume = Math.min(Math.max(speed / 400, 0.3), 1)
    this.sound.play('pocketHit', { volume })

    // Register with game manager
    this.gameManager.registerBallPocketed(ball)
  }

  getBalls() {
    return this.balls
  }

  getCueBall() {
    return this.cueBall
  }
}
