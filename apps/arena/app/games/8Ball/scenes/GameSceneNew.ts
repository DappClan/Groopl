// NEW GameScene using EXACT original physics
import Phaser from 'phaser'
import { onContact } from '../core/ContactListener'
import { renderScreen } from '../core/RenderScreen'
import { Ball } from '../objects/Ball'
import { BilliardPhysics } from '../physics/BilliardPhysics'
import { Maths, Point } from '../utils/Maths'
import { Vector2D } from '../utils/Vector2D'

export class GameScene extends Phaser.Scene {
  private gameInfo: any = {}
  private contactEvent: any

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    const e = this.gameInfo

    // EXACT setup from 14setup.js
    e.adjustmentScale = 2.3
    e.ballRadius = 1000 * e.adjustmentScale // 2300
    e.physScale = 0.01
    e.friction = 1.5
    e.pocketRadius = 2250
    e.minVelocity = 2
    e.cushionRestitution = 0.6
    e.ballRestitution = 0.94
    e.maxPower = 5000

    // Setup table
    this.setupTable()

    // Setup balls
    this.setupBalls()

    // Setup physics
    this.setupPhysics()

    // Setup cue
    this.setupCue()

    // Render initial state
    this.renderScreen()

    // Start game - EXACT initialization as original
    e.gameRunning = true
    e.shotRunning = false
    e.shotComplete = false
    e.cueSet = false
    e.settingPower = false
    e.beginStrike = false
    e.power = 0
    e.preventAim = false
    e.preventSetPower = false
    e.preventUpdateCue = false
    e.cueBallInHand = true
    e.turn = 'p1'
    e.p1TargetType = 'ANY'
    e.p2TargetType = 'ANY'
    e.shotNum = 0
    e.scratched = false
    e.fouled = false
    e.trial = 0
    e.shotReset = true

    // Timer and scoring - EXACT as original
    e.timerStarted = false
    e.ballPotted = false
    e.ballsPotted = 0
    e.multiplier = 1
    e.pottedBallArray = []
    e.time = 0
    e.numBalls = e.ballArray.length
    e.ballsRemaining = e.ballArray.length - 1 // Exclude cue ball

    // Tween tracking - EXACT as original
    e.cueTweenComplete = true
    e.rulingsApplied = false

    // Aim direction vector
    e.aimDirectionVector = new Vector2D(1, 0).normalize()

    // Guide drawing - EXACT as original
    e.drawGuide = true

    // Setup input handlers
    this.setupInput()
  }

  private setupTable() {
    const e = this.gameInfo
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2

    // Add table sprites - EXACT as original
    this.add.sprite(centerX, centerY, 'pockets').setDepth(-2)
    this.add.sprite(centerX, centerY, 'cloth').setDepth(-1)
    e.tableTop = this.add.sprite(centerX, centerY, 'tableTop').setDepth(0)

    // Setup pockets, lines, vertices EXACTLY as original
    const n = 600 * e.adjustmentScale

    e.pocketArray = []
    e.vertexArray = []
    e.lineArray = []

    // Pockets - EXACT positions with dropPosition (lines 434-471)
    const pockets = [
      {
        x: -50 * n - e.pocketRadius / 2,
        y: -25 * n - e.pocketRadius / 4,
        dropX: -51 * n - e.pocketRadius / 2,
        dropY: -26 * n - e.pocketRadius / 4,
        id: 0,
      },
      {
        x: 0 * n,
        y: -25 * n - e.pocketRadius,
        dropX: 0 * n,
        dropY: -25.5 * n - e.pocketRadius,
        id: 1,
      },
      {
        x: 50 * n + e.pocketRadius / 2,
        y: -25 * n - e.pocketRadius / 4,
        dropX: 51 * n + e.pocketRadius / 2,
        dropY: -26 * n - e.pocketRadius / 4,
        id: 2,
      },
      {
        x: -50 * n - e.pocketRadius / 2,
        y: 25 * n + e.pocketRadius / 4,
        dropX: -51 * n - e.pocketRadius / 2,
        dropY: 26 * n + e.pocketRadius / 4,
        id: 3,
      },
      {
        x: 0 * n,
        y: 25 * n + e.pocketRadius,
        dropX: 0 * n,
        dropY: 25.5 * n + e.pocketRadius,
        id: 4,
      },
      {
        x: 50 * n + e.pocketRadius / 2,
        y: 25 * n + e.pocketRadius / 4,
        dropX: 51 * n + e.pocketRadius / 2,
        dropY: 26 * n + e.pocketRadius / 4,
        id: 5,
      },
    ]

    pockets.forEach((p) => {
      e.pocketArray.push({
        position: new Vector2D(p.x, p.y),
        dropPosition: new Vector2D(p.dropX, p.dropY),
        id: p.id,
      })
    })

    // Lines (cushions) - EXACT setup
    const lines = [
      { name: 'AB', p1: [-50 * n, -29 * n], p2: [-46 * n, -25 * n] },
      { name: 'BC', p1: [-46 * n, -25 * n], p2: [-4 * n, -25 * n] },
      { name: 'CD', p1: [-4 * n, -25 * n], p2: [-2 * n, -29 * n] },
      { name: 'EF', p1: [2 * n, -29 * n], p2: [4 * n, -25 * n] },
      { name: 'FG', p1: [4 * n, -25 * n], p2: [46 * n, -25 * n] },
      { name: 'GH', p1: [46 * n, -25 * n], p2: [50 * n, -29 * n] },
      { name: 'IJ', p1: [54 * n, -25 * n], p2: [50 * n, -21 * n] },
      { name: 'JK', p1: [50 * n, -21 * n], p2: [50 * n, 21 * n] },
      { name: 'KL', p1: [50 * n, 21 * n], p2: [54 * n, 25 * n] },
      { name: 'MN', p1: [50 * n, 29 * n], p2: [46 * n, 25 * n] },
      { name: 'NO', p1: [46 * n, 25 * n], p2: [4 * n, 25 * n] },
      { name: 'OP', p1: [4 * n, 25 * n], p2: [2 * n, 29 * n] },
      { name: 'QR', p1: [-2 * n, 29 * n], p2: [-4 * n, 25 * n] },
      { name: 'RS', p1: [-4 * n, 25 * n], p2: [-46 * n, 25 * n] },
      { name: 'ST', p1: [-46 * n, 25 * n], p2: [-50 * n, 29 * n] },
      { name: 'UV', p1: [-54 * n, 25 * n], p2: [-50 * n, 21 * n] },
      { name: 'VW', p1: [-50 * n, 21 * n], p2: [-50 * n, -21 * n] },
      { name: 'WX', p1: [-50 * n, -21 * n], p2: [-54 * n, -25 * n] },
    ]

    lines.forEach((line, idx) => {
      const o: any = {}
      o.name = line.name
      o.p1 = new Vector2D(line.p1[0], line.p1[1])
      o.p2 = new Vector2D(line.p2[0], line.p2[1])

      // Calculate direction and normal
      o.direction = new Vector2D(o.p2.x - o.p1.x, o.p2.y - o.p1.y).normalize()
      o.normal = o.direction.getLeftNormal()

      // Calculate p3, p4 for collision detection
      const i = o.normal.times(e.ballRadius)
      o.p3 = o.p1.plus(i)
      o.p4 = o.p2.plus(i)

      // Calculate p5, p6 for secondary collision detection
      const s = o.normal.times(0.8 * e.ballRadius)
      o.p5 = o.p1.plus(s)
      o.p6 = o.p2.plus(s)

      e.lineArray.push(o)

      // Add vertex at p2 (except last one)
      if (idx < lines.length - 1) {
        e.vertexArray.push({
          position: new Vector2D(o.p2.x, o.p2.y),
          name: line.name.charAt(1),
        })
      }
    })
  }

  private setupBalls() {
    const e = this.gameInfo
    e.ballArray = []

    // Get ball positions from levelData
    const i = 15000 * e.adjustmentScale
    const randomOffset1 = 0.05 + 0.05 * Math.random()
    const randomOffset2 = 1 + (0.05 + 0.05 * Math.random())
    const spacing = (1.732 + randomOffset1) * e.ballRadius

    // Cue ball
    const cueBall: any = {}
    cueBall.position = new Vector2D(-i, 0)
    cueBall.velocity = new Vector2D(0, 0)
    cueBall.id = 0
    cueBall.active = 1
    cueBall.targetType = 'CUE'
    cueBall.firstContact = false
    cueBall.contactArray = []
    cueBall.screw = 0
    cueBall.english = 0
    cueBall.deltaScrew = new Vector2D(0, 0)
    cueBall.grip = 1
    cueBall.ySpin = 0
    cueBall.lastCollisionObject = null
    cueBall.pocketTweenComplete = true
    cueBall.propelling = false
    cueBall.firstContact = false

    // Create Phaser sprite for cue ball (renderScreen will position it)
    cueBall.mc = this.createBallSprite(0)
    cueBall.shadow = this.createShadow()

    // Create marker and mover for cue ball - EXACT as original
    cueBall.marker = this.add.sprite(0, 0, 'shadow') // Placeholder, markers not yet loaded
    cueBall.marker.visible = false
    cueBall.marker.setDepth(2)
    cueBall.mover = this.add.sprite(0, 0, 'shadow') // Placeholder
    cueBall.mover.visible = false
    cueBall.mover.setDepth(2)

    e.ballArray.push(cueBall)

    // Object balls - EXACT arrangement from levelData.js case 15
    const ballPositions = [
      { id: 1, x: i, y: 0 },
      { id: 2, x: i + spacing, y: 1 * e.ballRadius * randomOffset2 },
      { id: 15, x: i + spacing, y: -1 * e.ballRadius * randomOffset2 },
      { id: 8, x: i + 2 * spacing, y: 0 },
      { id: 5, x: i + 2 * spacing, y: 2 * e.ballRadius * randomOffset2 },
      { id: 10, x: i + 2 * spacing, y: -2 * e.ballRadius * randomOffset2 },
      { id: 7, x: i + 3 * spacing, y: 1 * e.ballRadius * randomOffset2 },
      { id: 4, x: i + 3 * spacing, y: 3 * e.ballRadius * randomOffset2 },
      { id: 9, x: i + 3 * spacing, y: -1 * e.ballRadius * randomOffset2 },
      { id: 6, x: i + 3 * spacing, y: -3 * e.ballRadius * randomOffset2 },
      { id: 11, x: i + 4 * spacing, y: 0 },
      { id: 12, x: i + 4 * spacing, y: 2 * e.ballRadius * randomOffset2 },
      { id: 13, x: i + 4 * spacing, y: -2 * e.ballRadius * randomOffset2 },
      { id: 14, x: i + 4 * spacing, y: 4 * e.ballRadius * randomOffset2 },
      { id: 3, x: i + 4 * spacing, y: -4 * e.ballRadius * randomOffset2 },
    ]

    ballPositions.forEach((pos) => {
      const ball: any = {}
      ball.position = new Vector2D(pos.x, pos.y)
      ball.velocity = new Vector2D(0, 0)
      ball.id = pos.id
      ball.active = 1

      if (pos.id < 8) {
        ball.targetType = 'SOLIDS'
      }
      else if (pos.id > 8) {
        ball.targetType = 'STRIPES'
      }
      else {
        ball.targetType = '8 BALL'
      }

      ball.firstContact = false
      ball.contactArray = []
      ball.grip = 1
      ball.ySpin = 0
      ball.lastCollisionObject = null
      ball.pocketTweenComplete = true
      ball.propelling = false
      ball.firstContact = false

      // Create Phaser sprites (renderScreen will position them)
      ball.mc = this.createBallSprite(pos.id)
      ball.shadow = this.createShadow()

      // Create marker - EXACT as original
      ball.marker = this.add.sprite(0, 0, 'shadow') // Placeholder
      ball.marker.visible = false
      ball.marker.setDepth(2)

      e.ballArray.push(ball)
    })
  }

  private createBallSprite(id: number) {
    // EXACT as original: Ball is a container with all visual elements inside
    const radius = this.gameInfo.ballRadius * this.gameInfo.physScale

    // Create Ball container - EXACT constructor: Ball(circRad, ballId)
    const ball = new Ball(this, radius, id)
    ball.setPosition(0, 0) // renderScreen will position it
    ball.setDepth(3) // Above guide (depth 1) and shadows (depth 0)

    // Return the Ball container itself - it now handles all visuals internally
    return ball
  }

  private createShadow() {
    const shadow = this.add.sprite(0, 0, 'shadow')
    shadow.setAlpha(0.4)
    shadow.setDepth(0)
    return shadow
  }

  private setupPhysics() {
    const e = this.gameInfo

    // Create contact event - EXACT as original (using a simple object with dispatch method)
    this.contactEvent = {
      dispatch: (data: any) => {
        this.onContact(data)
      },
    }

    // Create physics engine
    e.phys = new BilliardPhysics(
      this.contactEvent,
      e.ballArray,
      e.lineArray,
      e.vertexArray,
      e.pocketArray,
      0,
    )

    // Set physics parameters
    e.phys.friction = e.friction
    e.phys.ballRadius = e.ballRadius
    e.phys.pocketRadius = e.pocketRadius
    e.phys.physScale = e.physScale
    e.phys.minVelocity = e.minVelocity
    e.phys.cushionRestitution = e.cushionRestitution
    e.phys.ballRestitution = e.ballRestitution
  }

  private setupCue() {
    const e = this.gameInfo
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2

    // Create cue canvas group
    e.cueCanvas = this.add.container(centerX, centerY)
    e.cueCanvas.setDepth(2)

    // Create cue sprites - EXACT as original
    e.cueShadow = this.add.sprite(0, 0, 'cueShadow')
    e.cueShadow.setOrigin(1, 8 / 53) // EXACT as original: anchor = (1, 8/53)
    e.cueCanvas.add(e.cueShadow)

    e.cue = this.add.sprite(0, 0, 'cue')
    e.cue.setOrigin(1, 0.5) // EXACT as original: anchor = (1, 0.5)
    e.cueCanvas.add(e.cue)

    // Position cue initially
    e.cue.x = -e.ballRadius * e.physScale * 1.5
    e.cueShadow.x = e.cue.x

    // Create guide graphics - EXACT as original with container for proper positioning
    e.guideCanvas = this.add.container(centerX, centerY)
    e.guideCanvas.setDepth(1)
    e.guide = this.add.graphics()
    e.guideCanvas.add(e.guide)

    e.cueCanvas.setVisible(false)
  }

  private setupInput() {
    const e = this.gameInfo

    // Mouse/touch move - EXACT as original desktop logic
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const cueBall = e.ballArray[0]
      if (!cueBall || cueBall.active !== 1)
        return

      const centerX = this.cameras.main.width / 2
      const centerY = this.cameras.main.height / 2

      // If setting power (dragging), update power - EXACT as original
      if (e.settingPower && pointer.isDown && !e.beginStrike) {
        // Calculate drag vector (from current to mouseDown) - EXACT as original
        const dx = pointer.x - e.mouseDownX
        const dy = pointer.y - e.mouseDownY

        // Create pullback vector - EXACT as original: new Vector2D(-e,-t)
        const pullbackVector = new Vector2D(-dx, -dy)

        // Project onto aim direction - EXACT as original: n.dot(a.aimDirectionVector)
        let pullback = pullbackVector.dot(e.aimDirectionVector)

        // Clamp pullback - EXACT as original: max 180
        const maxPullback = 180
        if (pullback > maxPullback)
          pullback = maxPullback
        if (pullback < 0)
          pullback = 0

        // Calculate power - EXACT as original: a.maxPower*(Math.pow(r,1.4)/Math.pow(i,1.4))
        e.power = e.maxPower * (pullback ** 1.4 / maxPullback ** 1.4)

        // Update cue position - EXACT as original: a.cue.x=-.5*r-1.5*a.ballRadius*a.physScale
        e.cue.x = -0.5 * pullback - 1.5 * e.ballRadius * e.physScale
        e.cueShadow.x = e.cue.x

        this.drawGuide()
      }
      // Otherwise, update aim - EXACT as original desktop logic
      else if (!e.shotRunning && !e.preventAim && !pointer.isDown) {
        // Calculate angle from cue ball to cursor - EXACT as original
        const cueBallScreenX = centerX + cueBall.position.x * e.physScale
        const cueBallScreenY = centerY + cueBall.position.y * e.physScale
        const dx = pointer.x - cueBallScreenX
        const dy = pointer.y - cueBallScreenY
        const angle = Math.atan2(dy, dx)

        // Update cue angle - EXACT as original: a.cueCanvas.angle=180/Math.PI*Math.atan2(t,e)
        e.cueCanvas.angle = angle * 180 / Math.PI

        // Calculate shadow angle with parallax - EXACT as original
        const shadowOffsetX = cueBall.position.x * e.physScale * 0.02
        let shadowOffsetY = -cueBall.position.y * e.physScale * 0.02 + Math.sin(angle) * shadowOffsetX
        if (shadowOffsetY > 5)
          shadowOffsetY = 5
        if (shadowOffsetY < -5)
          shadowOffsetY = -5
        e.cueShadow.angle = 3 + shadowOffsetY

        // Update aim direction vector - EXACT as original
        const aimX = Math.cos(angle)
        const aimY = Math.sin(angle)
        e.aimDirectionVector = new Vector2D(aimX, aimY).normalize()

        this.drawGuide()
      }
    })

    // Mouse down - start setting power - EXACT as original
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!e.gameRunning || e.shotRunning || e.preventSetPower || e.beginStrike)
        return

      const cueBall = e.ballArray[0]
      if (!cueBall || cueBall.active !== 1)
        return

      // Check if clicking within table bounds - EXACT as original
      const centerX = this.cameras.main.width / 2
      const centerY = this.cameras.main.height / 2
      const tableHalfWidth = e.tableTop.width / 2
      const tableHalfHeight = e.tableTop.height / 2

      const localX = pointer.x - centerX
      const localY = pointer.y - centerY

      if (localX < tableHalfWidth && localX > -tableHalfWidth && localY < tableHalfHeight && localY > -tableHalfHeight) {
        e.settingPower = true
        e.mouseDownX = pointer.x
        e.mouseDownY = pointer.y
      }
    })

    // Mouse up - shoot - EXACT as original
    this.input.on('pointerup', (_pointer: Phaser.Input.Pointer) => {
      // Check if power is sufficient to shoot - EXACT as original: a.power>40
      if (e.power > 40 && e.settingPower && !e.beginStrike) {
        e.beginStrike = true

        // Hide markers - EXACT as original
        for (let i = 1; i < e.ballArray.length; i++) {
          e.ballArray[i].marker && (e.ballArray[i].marker.visible = false)
        }

        // Calculate tween duration - EXACT as original: 1/a.power with limits
        let tweenDuration = 1 / e.power
        if (tweenDuration > 0.8)
          tweenDuration = 0.8
        if (tweenDuration < 0.1)
          tweenDuration = 0.1

        // Animate cue strike - EXACT as original
        const cueStrike = this.tweens.add({
          targets: e.cue,
          x: e.power / 400,
          duration: 1000 * tweenDuration,
          ease: 'Linear',
        })

        this.tweens.add({
          targets: e.cueShadow,
          x: e.power / 400,
          duration: 1000 * tweenDuration,
          ease: 'Linear',
        })

        // Fade out cue - EXACT as original
        this.tweens.add({
          targets: e.cueCanvas,
          alpha: 0,
          duration: 1000,
          ease: 'Linear',
          delay: 1500,
          onComplete: () => {
            e.cueCanvas.visible = false
            e.cueCanvas.alpha = 1
            e.cueTweenComplete = true
          },
        })

        // Hide guide - EXACT as original
        e.guideCanvas.setVisible(false)

        // Mark cue ball in hand as false - EXACT as original
        e.cueBallInHand = false

        // Mark cue tween as not complete - EXACT as original
        e.cueTweenComplete = false

        // Trigger strike when cue contacts ball - EXACT as original
        cueStrike.on('update', () => {
          if (e.cue.x >= -e.ballRadius * e.physScale && !e.shotRunning) {
            this.shoot()
          }
        })
      }
      // Reset if power too low - EXACT as original: a.power<40
      else if (e.power < 40 && e.settingPower) {
        e.settingPower = false
        e.power = 0
        e.cue.x = -e.ballRadius * e.physScale * 1.5
        e.cueShadow.x = e.cue.x
      }
    })
  }

  private drawGuide() {
    const a = this.gameInfo
    const guideOn = true // Always show guide (equivalent to projectInfo.guideOn)

    if (!a.drawGuide)
      return

    // Safety checks
    if (!a.ballArray || !a.ballArray[0] || !a.ballArray[0].position || !a.aimDirectionVector)
      return

    if (!a.guideCanvas || !a.guide)
      return

    // EXACT as original lines 30
    a.guideCanvas.setVisible(true)
    a.guide.lineStyle(1, 0xFFFFFF, 0.7)

    // EXACT as original lines 31-53: Find all balls that intersect with aim line
    let e: any // Closest ball hit
    const t = a.ballArray[0].position.plus(a.aimDirectionVector.times(500000)) // Far point
    const i: any[] = [] // Balls hit
    const n: any[] = [] // Intersection points
    let o = false // Flag for cue ball being inside another ball
    const r = a.ballArray[0] // Cue ball

    for (let l = 1; l < a.ballArray.length; l++) {
      const s = a.ballArray[l]
      if (s.active === 1) {
        const p = new Point(r.position.x, r.position.y)
        const c = new Point(t.x, t.y)
        const u = new Point(s.position.x, s.position.y)
        const d = 2 * a.ballRadius
        const y = Maths.lineIntersectCircle(p, c, u, d)

        if (y.intersects === 1 || y.intersects === true) {
          i.push(s)
          if (y.enter != null) {
            n.push(y.enter)
          }
          else {
            n.push(new Point(r.position.x, r.position.y))
            o = true
          }
        }
      }
    }

    // EXACT as original lines 54-87: If balls hit, draw guide
    if (i.length > 0) {
      // Find closest ball - EXACT as original lines 55-60
      let m = 10000000000 // 1e11
      let R: any // Contact point
      for (let h = 0; h < i.length; h++) {
        const v = (i[h].position.x - r.position.x) * (i[h].position.x - r.position.x)
          + (i[h].position.y - r.position.y) * (i[h].position.y - r.position.y)
        if (v < m) {
          m = v
          e = i[h]
          R = n[h]
        }
      }

      // Safety check - if no contact point found, skip guide drawing
      if (!R || !e) {
        return
      }

      // Clear and reset line style - EXACT as original line 61
      a.guide.clear()
      a.guide.lineStyle(1, 0xFFFFFF, 0.7)

      // Calculate object ball path - EXACT as original lines 62-69
      const g = Maths.findBearing(R.x - r.position.x, R.y - r.position.y)
      const b = Maths.findBearing(e.position.x - R.x, e.position.y - R.y)
      let f = Math.abs(Maths.angleDiff(b, g))
      let S = 5 * a.ballRadius * ((90 - f) / 90)
      const w = new Point(
        e.position.x + Math.cos((b * Math.PI) / 180) * S,
        e.position.y + Math.sin((b * Math.PI) / 180) * S,
      )

      // Draw cue ball to contact point - EXACT as original lines 71-73
      if (guideOn) {
        a.guide.moveTo(r.position.x * a.physScale, r.position.y * a.physScale)
        a.guide.lineTo(R.x * a.physScale, R.y * a.physScale)
      }

      // Draw circle at contact point - EXACT as original line 74
      a.guide.strokeCircle(R.x * a.physScale, R.y * a.physScale, 2 * a.ballRadius * a.physScale)

      // Draw object ball path - EXACT as original lines 75-77
      if (guideOn) {
        a.guide.moveTo(e.position.x * a.physScale, e.position.y * a.physScale)
        a.guide.lineTo(w.x * a.physScale, w.y * a.physScale)
      }

      // Draw cue ball deflection path - EXACT as original lines 78-87
      if (o === false) {
        const x = Maths.findBearing(R.x - r.position.x, R.y - r.position.y)
        const P = Maths.findBearing(w.x - R.x, w.y - R.y)
        f = Maths.angleDiff(P, x)
        S = (5 * a.ballRadius * f) / 90
        const A = P - 90
        const T = new Point(
          R.x + S * Math.cos((A * Math.PI) / 180),
          R.y + S * Math.sin((A * Math.PI) / 180),
        )

        if (guideOn) {
          a.guide.moveTo(R.x * a.physScale, R.y * a.physScale)
          a.guide.lineTo(T.x * a.physScale, T.y * a.physScale)
        }
      }
    }
    else {
      // No balls hit - draw line to table edge - EXACT as original lines 88-107
      const I: Point[] = []
      I.push(new Point(-30000 * a.adjustmentScale + a.ballRadius, -15000 * a.adjustmentScale + a.ballRadius))
      I.push(new Point(30000 * a.adjustmentScale - a.ballRadius, -15000 * a.adjustmentScale + a.ballRadius))
      I.push(new Point(30000 * a.adjustmentScale - a.ballRadius, 15000 * a.adjustmentScale - a.ballRadius))
      I.push(new Point(-30000 * a.adjustmentScale + a.ballRadius, 15000 * a.adjustmentScale - a.ballRadius))
      I.push(new Point(-30000 * a.adjustmentScale + a.ballRadius, -15000 * a.adjustmentScale + a.ballRadius))

      let R: any
      const p = new Point(r.position.x, r.position.y)
      const c = new Point(t.x, t.y)

      for (let l = 0; l < 4; l++) {
        const intersect = Maths.lineIntersectLine(p, c, I[l], I[l + 1])
        if (intersect != null) {
          R = intersect
        }
      }

      if (R != null) {
        a.guide.clear()
        a.guide.lineStyle(1, 0xFFFFFF, 0.7)

        if (guideOn) {
          a.guide.moveTo(r.position.x * a.physScale, r.position.y * a.physScale)
          a.guide.lineTo(R.x * a.physScale, R.y * a.physScale)
        }

        a.guide.strokeCircle(R.x * a.physScale, R.y * a.physScale, 2 * a.ballRadius * a.physScale)
      }
    }
  }

  private shoot() {
    const e = this.gameInfo
    const cueBall = e.ballArray[0]

    if (!cueBall || cueBall.active !== 1)
      return

    // Play sound - EXACT as original: Sound.Play("cueHit", 1)
    try {
      this.sound.play('cueHit', { volume: 1 })
    }
    catch {
      // Ignore sound errors
    }

    // Set ball velocity - EXACT as original
    cueBall.velocity = e.aimDirectionVector.times(e.power)

    // Update game state - EXACT as original
    e.shotRunning = true
    e.shotNum++
    e.shotReset = false

    // Start timer on first shot - EXACT as original
    if (!e.timerStarted) {
      e.timerStarted = true
      e.time = 0
    }

    // Guide is already hidden by the pointerup handler
  }

  private onContact(data: any) {
    // Use EXACT original contact listener
    onContact(data, this.gameInfo, this)
  }

  private renderScreen() {
    // Use EXACT original render function
    renderScreen(this.gameInfo, this)
  }

  override update(_time: number, _delta: number) {
    const e = this.gameInfo

    if (!e.gameRunning)
      return

    // Position cue canvas to follow cue ball - EXACT as original
    if (!e.shotRunning && e.ballArray[0] && e.ballArray[0].active === 1 && !e.cueSet && !e.preventUpdateCue && !e.trial) {
      const cueBall = e.ballArray[0]
      const centerX = this.cameras.main.width / 2
      const centerY = this.cameras.main.height / 2

      e.cueSet = true
      e.cueCanvas.visible = true
      e.cueCanvas.x = centerX + cueBall.position.x * e.physScale
      e.cueCanvas.y = centerY + cueBall.position.y * e.physScale
      e.cue.x = -e.ballRadius * e.physScale * 1.5
      e.cueShadow.x = e.cue.x
    }

    if (e.shotRunning) {
      // Update physics - EXACT as original
      e.phys.updatePhysics()

      // Render - EXACT as original
      this.renderScreen()

      // Check if shot is complete - EXACT as original (lines 129-139)
      if (e.cueTweenComplete || e.trial === 1) {
        // Check if all pocket animations are complete - EXACT as original line 131
        let allPocketTweensComplete = true
        for (let t = 0; t < e.ballArray.length; t++) {
          if (e.ballArray[t].pocketTweenComplete === false) {
            allPocketTweensComplete = false
            break
          }
        }

        if (allPocketTweensComplete || e.trial === 1) {
          // Check if all balls have stopped - EXACT as original lines 133-136
          let allStopped = true
          for (let n = 0; n < e.ballArray.length; n++) {
            if (e.ballArray[n].velocity.magnitude > 0) {
              allStopped = false
              break
            }
          }

          if (allStopped) {
            e.shotRunning = false
            e.shotComplete = true
          }
        }
      }
    }

    // Apply game rules when shot is complete - EXACT as original lines 140-589
    if (e.shotComplete && !e.rulingsApplied && !e.shotRunning) {
      e.rulingsApplied = true
      this.applyGameRules()
    }
  }

  private applyGameRules() {
    const a = this.gameInfo

    // Check if cue ball missed all balls - EXACT as original lines 147-161
    let missedAllBalls = true
    const cueBall = a.ballArray[0]
    for (let i = 0; i < cueBall.contactArray.length; i++) {
      if (cueBall.contactArray[i].collisionType === 'ball') {
        missedAllBalls = false
        break
      }
    }

    if (missedAllBalls) {
      a.foulMessage = 'missed the balls'
      a.fouled = true
    }

    // Check if wrong ball was hit first - EXACT as original lines 163-197
    for (let e = 0; e < cueBall.contactArray.length; e++) {
      const t = cueBall.contactArray[e]
      if (t.collisionType === 'ball') {
        const targetId = t.target.id
        const playerTargetType = a.turn === 'p1' ? a.p1TargetType : a.p2TargetType

        if (playerTargetType === 'SOLIDS' && targetId > 7) {
          a.fouled = true
          a.foulMessage = 'struck the wrong ball first'
        }
        else if (playerTargetType === 'STRIPES' && targetId < 9) {
          a.fouled = true
          a.foulMessage = 'struck the wrong ball first'
        }
        else if (playerTargetType === '8 BALL' && targetId !== 8) {
          a.fouled = true
          a.foulMessage = 'struck the wrong ball first'
        }
        break
      }
    }

    // Check if cue ball was pocketed - EXACT as original lines 198-202
    if (a.scratched) {
      a.fouled = true
      a.foulMessage = 'potted the cue ball'
      a.cueBallInHand = true
    }

    // Check what balls were potted - EXACT as original lines 203-237
    a.ballsPotted = 0
    a.turnExtended = false
    a.ballsPottedSameType = true
    let firstPottedType = ''

    for (let i = 1; i < a.ballArray.length; i++) {
      const ball = a.ballArray[i]
      for (let o = 0; o < ball.contactArray.length; o++) {
        if (ball.contactArray[o].collisionType === 'pocket') {
          a.ballsPotted++
          const playerTargetType = a.turn === 'p1' ? a.p1TargetType : a.p2TargetType

          // Check 8-ball potting
          if (ball.id === 8) {
            if (playerTargetType === '8 BALL') {
              // Win condition
              a.gameOver = true
              a.winner = a.turn
            }
            else {
              // Lost by potting 8-ball early
              a.gameOver = true
              a.winner = a.turn === 'p1' ? 'p2' : 'p1'
              a.fouled = true
            }
          }

          // Check correct balls potted
          if (!a.fouled && ball.id !== 8) {
            if (a.ballsPotted === 1) {
              if (ball.id > 8)
                firstPottedType = 'STRIPES'
              if (ball.id < 8)
                firstPottedType = 'SOLIDS'
            }

            // Check if player potted their own ball type
            if ((playerTargetType === 'STRIPES' && ball.id > 8)
              || (playerTargetType === 'SOLIDS' && ball.id < 8)
              || (playerTargetType === 'ANY' && ball.id !== 8)) {
              a.turnExtended = true // Player gets another turn
            }
          }
        }
      }
    }

    // Assign ball types on first pot - EXACT as original
    if (a.ballsPotted > 0 && !a.fouled && firstPottedType !== '') {
      if (a.p1TargetType === 'ANY' && a.p2TargetType === 'ANY') {
        if (a.turn === 'p1') {
          a.p1TargetType = firstPottedType
          a.p2TargetType = firstPottedType === 'SOLIDS' ? 'STRIPES' : 'SOLIDS'
        }
        else {
          a.p2TargetType = firstPottedType
          a.p1TargetType = firstPottedType === 'SOLIDS' ? 'STRIPES' : 'SOLIDS'
        }
      }
    }

    // Check for cushion contact - EXACT as original lines 238-281
    if (a.ballsPotted === 0 && !a.fouled) {
      let cushionHit = false

      for (let p = 0; p < a.ballArray.length; p++) {
        const c = a.ballArray[p]
        if (c.active === 1) {
          for (let u = 0; u < c.contactArray.length; u++) {
            const d = c.contactArray[u]
            if (d.collisionType === 'line' || d.collisionType === 'vertex') {
              cushionHit = true
              break
            }
          }
          if (cushionHit)
            break
        }
      }

      if (!cushionHit) {
        a.fouled = true
        a.foulMessage = 'failed to make a ball hit a cushion'
      }
    }

    // Handle turn switching - EXACT as original logic
    if (a.fouled) {
      // Foul: switch turns and give ball in hand
      a.turn = a.turn === 'p1' ? 'p2' : 'p1'
      a.cueBallInHand = true
    }
    else if (a.turnExtended) {
      // Player potted their ball: keep same turn
      // Turn stays the same
    }
    else {
      // No balls potted, no foul: switch turns
      a.turn = a.turn === 'p1' ? 'p2' : 'p1'
    }

    // Log turn and game state for debugging
    // console.log(`Turn: ${a.turn}, P1: ${a.p1TargetType}, P2: ${a.p2TargetType}, Fouled: ${a.fouled}, Extended: ${a.turnExtended}`)

    // Reset for next shot after delay
    this.time.delayedCall(1000, () => {
      this.resetForNextShot()
    })
  }

  private resetForNextShot() {
    const e = this.gameInfo

    // Reset shot variables - EXACT as original
    e.cueSet = false
    e.settingPower = false
    e.beginStrike = false
    e.power = 0
    e.shotComplete = false
    e.shotReset = true
    e.preventAim = false
    e.preventSetPower = false
    e.preventUpdateCue = false
    e.cueTweenComplete = true
    e.ballPotted = false
    e.fouled = false
    e.scratched = false
    e.rulingsApplied = false
    e.ballsPotted = 0
    e.turnExtended = false

    // Reset cue position - EXACT as original
    e.cue.x = -e.ballRadius * e.physScale * 1.5
    e.cueShadow.x = e.cue.x

    // Clear contact arrays - EXACT as original
    for (let i = 0; i < e.ballArray.length; i++) {
      e.ballArray[i].contactArray = []
      e.ballArray[i].firstContact = false
      e.ballArray[i].lastCollisionObject = null
    }

    // Show cue for next shot
    const cueBall = e.ballArray[0]
    if (cueBall && cueBall.active === 1) {
      e.cueCanvas.setVisible(true)
    }
  }
}
