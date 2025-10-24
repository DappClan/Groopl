import type Phaser from 'phaser'
import type { CueController } from '../controllers/CueController'
import type { Ball } from '../objects/Ball'

type BallType = 'solid' | 'stripe' | '8ball' | null

export class GameManager {
  private scene: Phaser.Scene
  private balls: Ball[]
  private cueController: CueController
  private currentPlayer: number = 1
  private player1Type: BallType = null
  private player2Type: BallType = null
  private shotInProgress: boolean = false
  private firstContact: Ball | null = null
  private ballsPocketed: Ball[] = []
  private cushionHit: boolean = false
  private foul: boolean = false
  private foulReason: string = ''
  private turnExtended: boolean = false

  constructor(scene: Phaser.Scene, balls: Ball[], cueController: CueController) {
    this.scene = scene
    this.balls = balls
    this.cueController = cueController
  }

  update() {
    // Check if shot is in progress
    const anyBallMoving = this.balls.some(ball => ball.isMoving())

    if (anyBallMoving) {
      if (!this.shotInProgress) {
        this.shotInProgress = true
        this.firstContact = null
        this.ballsPocketed = []
        this.cushionHit = false
        this.foul = false
        this.foulReason = ''
        this.turnExtended = false
      }
    }
    else {
      if (this.shotInProgress) {
        this.shotInProgress = false
        this.evaluateShot()
      }
    }
  }

  private evaluateShot() {
    // Check for fouls
    this.checkForFouls()

    // Check if player pocketed their balls
    const validPocket = this.checkValidPocket()

    // Assign ball types if needed
    if (!this.player1Type && !this.player2Type && this.ballsPocketed.length > 0) {
      this.assignBallTypes()
    }

    // Check for win condition
    if (this.checkWinCondition()) {
      return
    }

    // Determine if turn continues
    if (this.foul) {
      this.handleFoul()
    }
    else if (validPocket && this.ballsPocketed.length > 0) {
      this.turnExtended = true
      this.scene.game.events.emit('game-message', `${this.currentPlayer === 1 ? 'Player 1' : 'Player 2'} continues!`)
    }
    else {
      this.switchTurn()
    }
  }

  private checkForFouls() {
    // No contact with any ball
    if (!this.firstContact) {
      this.foul = true
      this.foulReason = 'No ball contacted'
      return
    }

    // Check if cue ball was pocketed
    const cueBall = this.balls[0]
    if (!cueBall.isActive()) {
      this.foul = true
      this.foulReason = 'Cue ball scratched'
      this.cueController.setCueBallInHand(true)
      return
    }

    // If player types are assigned, check if first contact is correct
    if (this.currentPlayer === 1 && this.player1Type) {
      const requiredType = this.player1Type
      if (this.firstContact.getBallType() !== requiredType
        && (requiredType !== '8ball' || this.firstContact.getBallType() !== '8ball')) {
        // Check if player needs to hit 8-ball
        if (this.shouldTarget8Ball(1)) {
          if (this.firstContact.id !== 8) {
            this.foul = true
            this.foulReason = 'Must hit 8-ball'
            return
          }
        }
        else if (this.firstContact.getBallType() !== requiredType) {
          this.foul = true
          this.foulReason = 'Wrong ball contacted first'
          return
        }
      }
    }

    if (this.currentPlayer === 2 && this.player2Type) {
      const requiredType = this.player2Type
      if (this.firstContact.getBallType() !== requiredType
        && (requiredType !== '8ball' || this.firstContact.getBallType() !== '8ball')) {
        if (this.shouldTarget8Ball(2)) {
          if (this.firstContact.id !== 8) {
            this.foul = true
            this.foulReason = 'Must hit 8-ball'
            return
          }
        }
        else if (this.firstContact.getBallType() !== requiredType) {
          this.foul = true
          this.foulReason = 'Wrong ball contacted first'
          return
        }
      }
    }

    // No cushion hit after contact (if no balls were pocketed)
    if (this.ballsPocketed.length === 0 && !this.cushionHit) {
      this.foul = true
      this.foulReason = 'No cushion hit'
    }
  }

  private checkValidPocket(): boolean {
    if (this.ballsPocketed.length === 0)
      return false

    // Check if all pocketed balls are valid for current player
    for (const ball of this.ballsPocketed) {
      if (ball.id === 0) {
        this.foul = true
        this.foulReason = 'Cue ball scratched'
        return false
      }

      if (ball.id === 8) {
        // 8-ball can only be pocketed if player has cleared their balls
        if (!this.shouldTarget8Ball(this.currentPlayer)) {
          this.foul = true
          this.foulReason = '8-ball pocketed too early'
          return false
        }
      }
      else {
        // Check if ball type matches player
        const playerType = this.currentPlayer === 1 ? this.player1Type : this.player2Type
        if (playerType && ball.getBallType() !== playerType) {
          // Pocketed opponent's ball - doesn't extend turn but not a foul
          return false
        }
      }
    }

    return true
  }

  private assignBallTypes() {
    // Assign based on first ball pocketed
    const firstBall = this.ballsPocketed[0]
    if (firstBall.id === 8)
      return // Don't assign from 8-ball

    const ballType = firstBall.getBallType()
    if (ballType === 'solid' || ballType === 'stripe') {
      if (this.currentPlayer === 1) {
        this.player1Type = ballType
        this.player2Type = ballType === 'solid' ? 'stripe' : 'solid'
        this.scene.game.events.emit('ball-type-assigned', { player: 1, type: ballType === 'solid' ? 'Solids (1-7)' : 'Stripes (9-15)' })
        this.scene.game.events.emit('ball-type-assigned', { player: 2, type: ballType === 'solid' ? 'Stripes (9-15)' : 'Solids (1-7)' })
      }
      else {
        this.player2Type = ballType
        this.player1Type = ballType === 'solid' ? 'stripe' : 'solid'
        this.scene.game.events.emit('ball-type-assigned', { player: 2, type: ballType === 'solid' ? 'Solids (1-7)' : 'Stripes (9-15)' })
        this.scene.game.events.emit('ball-type-assigned', { player: 1, type: ballType === 'solid' ? 'Stripes (9-15)' : 'Solids (1-7)' })
      }
    }
  }

  private shouldTarget8Ball(player: number): boolean {
    const playerType = player === 1 ? this.player1Type : this.player2Type
    if (!playerType || playerType === '8ball')
      return false

    // Check if all player's balls are pocketed
    for (const ball of this.balls) {
      if (ball.isActive() && ball.getBallType() === playerType) {
        return false
      }
    }

    return true
  }

  private checkWinCondition(): boolean {
    // Check if 8-ball was pocketed
    const eightBall = this.balls.find(b => b.id === 8)
    if (!eightBall || eightBall.isActive())
      return false

    // 8-ball is pocketed
    if (this.shouldTarget8Ball(this.currentPlayer) && !this.foul) {
      // Player wins
      this.announceWinner(this.currentPlayer)
      return true
    }
    else {
      // Player loses (pocketed 8-ball too early or scratched while pocketing 8-ball)
      const winner = this.currentPlayer === 1 ? 2 : 1
      this.announceWinner(winner)
      return true
    }
  }

  private announceWinner(player: number) {
    this.scene.game.events.emit('game-message', `Player ${player} Wins!`)

    // Show winner screen after delay
    this.scene.time.delayedCall(3000, () => {
      const text = this.scene.add.text(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height / 2,
        `Player ${player} Wins!\n\nClick to Play Again`,
        {
          fontSize: '48px',
          color: '#ffffff',
          fontFamily: 'Arial',
          fontStyle: 'bold',
          align: 'center',
          backgroundColor: '#000000',
          padding: { x: 40, y: 20 },
        },
      )
      text.setOrigin(0.5, 0.5)
      text.setDepth(100)
      text.setInteractive()

      text.on('pointerdown', () => {
        this.scene.scene.restart()
      })
    })
  }

  private handleFoul() {
    this.scene.game.events.emit('game-message', `Foul: ${this.foulReason}`)

    // Respawn cue ball if scratched
    const cueBall = this.balls[0]
    if (!cueBall.isActive()) {
      const tableBounds = { x: this.scene.cameras.main.width / 2 - 400, y: this.scene.cameras.main.height / 2 }
      cueBall.respawn(tableBounds.x, tableBounds.y)
      this.cueController.setCueBallInHand(true)
    }

    this.switchTurn()
  }

  private switchTurn() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
    this.scene.game.events.emit('player-turn', this.currentPlayer)
    this.scene.game.events.emit('game-message', `Player ${this.currentPlayer}'s turn`)
  }

  registerCueBallContact(ball: Ball) {
    if (!this.firstContact && ball.id !== 0) {
      this.firstContact = ball
    }
  }

  registerBallPocketed(ball: Ball) {
    this.ballsPocketed.push(ball)
  }

  registerCushionHit() {
    this.cushionHit = true
  }

  canShoot(): boolean {
    return !this.shotInProgress
  }

  getCurrentPlayer(): number {
    return this.currentPlayer
  }
}
