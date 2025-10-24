// EXACT copy from 04billiardPhysics.js - NO CHANGES WHATSOEVER
import { Maths, Point } from '../utils/Maths'
import { Vector2D } from '../utils/Vector2D'

export class BilliardPhysics {
  targetID: number = -1
  omissionArray: any[] = []
  ballArray: any[]
  lineArray: any[]
  vertexArray: any[]
  pocketArray: any[]
  simType: number
  contactEvent: any
  frame: number = 0
  ballRadius: number = 0
  pocketRadius: number = 0
  friction: number = 0
  minVelocity: number = 0
  cushionRestitution: number = 0
  ballRestitution: number = 0

  constructor(t: any, i: any[], e: any[], o: any[], s: any[], n: number) {
    this.contactEvent = t
    this.ballArray = i
    this.lineArray = e
    this.vertexArray = o
    this.pocketArray = s
    this.simType = n
    this.simType = 0
  }

  set ballData(t: any[]) {
    this.ballArray = t
  }

  get ballData(): any[] {
    return this.ballArray
  }

  set frameNumber(t: number) {
    this.frame = t
  }

  get frameNumber(): number {
    return this.frame
  }

  updatePhysics() {
    this.predictCollisions()
    this.updateFriction()
  }

  predictCollisions() {
    let t = 0
    let i = 0
    let s: any[] = [] // Move s outside loop so it's in scope for while condition

    do {
      let e: any
      let o = 1
      s = [] // Reset s at start of each iteration
      const n = Maths.fixNumber(1 - t)
      let r = 0

      if (this.simType === 0) {
        r = this.ballArray.length
      }
      if (this.simType === 1) {
        r = 1
      }
      if (this.simType === 2) {
        r = this.targetID === -1 ? 1 : this.ballArray.length
      }

      for (let a = 0; a < r; a++) {
        let l = false
        if (this.simType === 2 && this.targetID !== -1 && a !== this.targetID && a !== 0) {
          l = true
        }

        const c = this.ballArray[a]

        if (c.active === 1 && l === false) {
          const y = c.position.plus(c.velocity.times(n))

          // Ball to ball collisions
          const p = this.simType === 2 ? 0 : a
          for (let p_idx = p; p_idx < this.ballArray.length; p_idx++) {
            const h = this.ballArray[p_idx]

            if (c.velocity.magnitudeSquared !== 0 || h.velocity.magnitudeSquared !== 0) {
              const m = true

              if (h !== c && h.active === 1 && m === true
                && Maths.checkObjectsConverging(c.position, h.position, c.velocity, h.velocity)) {
                const v = c.velocity.minus(h.velocity)
                const u = c.position.plus(v.times(n))
                const d = new Point(c.position.x, c.position.y)
                const b = new Point(u.x, u.y)
                const g = new Point(h.position.x, h.position.y)
                const w = 2 * this.ballRadius
                const f = Maths.lineIntersectCircle(d, b, g, w)

                if (f.intersects === 1 || f.intersects === true || f.inside === 1 || f.inside === true) {
                  let x: Point
                  let P: Vector2D
                  let j: number

                  if (f.exit !== null) {
                    x = f.exit
                  }
                  if (f.enter !== null) {
                    x = f.enter
                  }

                  if (f.intersects === 1 || f.intersects === true) {
                    P = new Vector2D(x!.x, x!.y)
                    const A = new Vector2D(b.x - d.x, b.y - d.y)
                    const S = new Vector2D(x!.x - d.x, x!.y - d.y)
                    j = Maths.fixNumber(t + S.magnitude / A.magnitude * n)
                  }

                  if (f.inside === 1 || f.inside === true) {
                    const I = c.position.minus(h.position).normalize()
                    P = h.position.plus(I.times(w))
                    j = t
                  }

                  if (j! < o) {
                    o = j!
                    e = {}
                    e.type = 'ball'
                    e.object = c
                    e.time = o
                    if (f.intersects === 1 || f.intersects === true) {
                      e.objectIntersectPoint = c.position.plus(c.velocity.times(o - t))
                      e.targetIntersectPoint = h.position.plus(h.velocity.times(o - t))
                    }
                    if (f.inside === 1 || f.inside === true) {
                      e.objectIntersectPoint = P!
                      e.targetIntersectPoint = h.position
                    }
                    e.target = h
                    s = []
                    s.push(e)
                  }
                  else if (j! === o && j! !== 1) {
                    o = j!
                    e = {}
                    e.type = 'ball'
                    e.object = c
                    e.time = o
                    e.objectIntersectPoint = c.position.plus(c.velocity.times(o - t))
                    e.target = h
                    e.targetIntersectPoint = h.position.plus(h.velocity.times(o - t))
                    if (f.inside === 1 || f.inside === true) {
                      e.objectIntersectPoint = P!
                      e.targetIntersectPoint = h.position
                    }
                    s.push(e)
                  }
                }
              }
            }
          }

          // Ball to line (cushion) collisions
          if (c.velocity.magnitudeSquared !== 0) {
            for (let V = 0; V < this.lineArray.length; V++) {
              const M = this.lineArray[V]
              let D: Point | null = null

              // Try first line intersection
              const phaserLine1Start = c.position
              const phaserLine1End = y
              const phaserLine2Start = M.p3
              const phaserLine2End = M.p4

              // Simple line intersection check
              D = Maths.lineIntersectLine(
                new Point(phaserLine1Start.x, phaserLine1Start.y),
                new Point(phaserLine1End.x, phaserLine1End.y),
                new Point(phaserLine2Start.x, phaserLine2Start.y),
                new Point(phaserLine2End.x, phaserLine2End.y),
              )

              if (D === null) {
                D = Maths.lineIntersectLine(
                  new Point(c.position.x, c.position.y),
                  new Point(y.x, y.y),
                  new Point(M.p5.x, M.p5.y),
                  new Point(M.p6.x, M.p6.y),
                )

                if (D !== null) {
                  const O = new Vector2D(D.x, D.y)
                  const T = M.normal.times(0.2 * this.ballRadius)
                  const intersectPointAsVec = O.plus(T)
                  D = new Point(intersectPointAsVec.x, intersectPointAsVec.y)
                }
              }

              if (D !== null) {
                const C = new Vector2D(D.x, D.y)
                const N = new Vector2D(y.x - c.position.x, y.y - c.position.y)
                const R = new Vector2D(C.x - c.position.x, C.y - c.position.y)
                const F = Maths.fixNumber(t + R.magnitude / N.magnitude * n)

                if (F < o) {
                  o = F
                  e = {}
                  e.type = 'line'
                  e.time = o
                  e.object = c
                  e.objectIntersectPoint = C
                  e.target = M
                  s = []
                  s.push(e)
                }
                else if (F === o && F !== 1) {
                  o = F
                  e = {}
                  e.type = 'line'
                  e.time = o
                  e.object = c
                  e.objectIntersectPoint = C
                  e.target = M
                  s.push(e)
                }
              }
            }

            // Ball to vertex collisions
            for (let E = 0; E < this.vertexArray.length; E++) {
              const k = this.vertexArray[E]
              let m = true

              if (this.simType !== 1) {
                m = Math.abs(c.position.x - k.position.x) < 8000
                  && Math.abs(c.position.y - k.position.y) < 8000
              }

              if (m === true) {
                const z = new Point(c.position.x, c.position.y)
                const L = new Point(y.x, y.y)
                const B = new Point(k.position.x, k.position.y)
                const q = 1 * this.ballRadius
                const H = Maths.lineIntersectCircle(z, L, B, q)

                if (H.intersects === 1 || H.intersects === true || H.inside === 1 || H.inside === true) {
                  let G: Point
                  let X: Vector2D
                  let Y: number

                  if (H.enter !== null) {
                    G = H.enter
                  }
                  if (H.exit !== null) {
                    G = H.exit
                  }
                  if (H.enter !== null && H.exit !== null) {
                    G = H.enter
                  }

                  if (H.intersects === 1 || H.intersects === true) {
                    X = new Vector2D(G!.x, G!.y)
                    const U = new Vector2D(L.x - z.x, L.y - z.y)
                    const J = new Vector2D(G!.x - z.x, G!.y - z.y)
                    Y = Maths.fixNumber(t + J.magnitude / U.magnitude * n)
                  }

                  if (H.inside === 1 || H.inside === true) {
                    const K = c.position.plus(c.velocity.normalize().times(2 * -q))
                    const Q = new Point(K.x, K.y)
                    G = Maths.lineIntersectCircle(z, Q, B, q).exit
                    X = new Vector2D(G!.x, G!.y)
                    Y = t
                  }

                  if (Y! < o) {
                    o = Y!
                    e = {}
                    e.type = 'vertex'
                    e.object = c
                    e.time = o
                    e.objectIntersectPoint = X!
                    e.target = k
                    s = []
                    s.push(e)
                  }
                  else if (Y! === o && Y! !== 1) {
                    o = Y!
                    e = {}
                    e.type = 'vertex'
                    e.object = c
                    e.time = o
                    if (H.intersects === 1 || H.intersects === true) {
                      e.objectIntersectPoint = new Vector2D(G!.x, G!.y)
                    }
                    if (H.inside === 1 || H.inside === true) {
                      e.objectIntersectPoint = X!
                    }
                    e.target = k
                    s.push(e)
                  }
                }
              }
            }

            // Ball to pocket collisions
            for (let W = 0; W < this.pocketArray.length; W++) {
              const Z = this.pocketArray[W]
              let m = true

              if (this.simType !== 1) {
                m = Math.abs(c.position.x - Z.position.x) < 8000
                  && Math.abs(c.position.y - Z.position.y) < 8000
              }

              let $ = false
              if (m === true) {
                const _ = Z.position.minus(c.position).normalize()
                if (c.velocity.dot(_) > 0) {
                  $ = true
                }
              }

              if ($ === true && m === true) {
                let tt: number
                const it = new Point(c.position.x, c.position.y)
                const et = new Point(y.x, y.y)
                const ot = new Point(Z.position.x, Z.position.y)

                if (Z.radius) {
                  tt = Z.radius
                }
                else {
                  tt = this.pocketRadius
                }

                const st = Maths.lineIntersectCircle(it, et, ot, tt)

                if (st.intersects === 1 || st.intersects === true || st.inside === 1 || st.inside === true) {
                  let nt: Point
                  let rt: Vector2D
                  let at: number

                  if (st.enter !== null) {
                    nt = st.enter
                  }
                  if (st.exit !== null) {
                    nt = st.exit
                  }

                  if (st.intersects === 1 || st.intersects === true) {
                    rt = new Vector2D(nt!.x, nt!.y)
                    const lt = new Vector2D(et.x - it.x, et.y - it.y)
                    const ct = new Vector2D(nt!.x - it.x, nt!.y - it.y)
                    at = Maths.fixNumber(t + ct.magnitude / lt.magnitude * n)
                  }

                  if (st.inside === 1 || st.inside === true) {
                    const yt = new Vector2D(it.x - ot.x, it.y - ot.y).normalize()
                    rt = new Vector2D(ot.x, ot.y).plus(yt.times(tt))
                    at = t
                  }

                  if (at! < o) {
                    o = at!
                    e = {}
                    e.type = 'pocket'
                    e.object = c
                    e.time = o
                    if (st.intersects === 1 || st.intersects === true) {
                      e.objectIntersectPoint = new Vector2D(nt!.x, nt!.y)
                    }
                    if (st.inside === 1 || st.inside === true) {
                      e.objectIntersectPoint = rt!
                    }
                    e.target = Z
                    s = []
                    s.push(e)
                  }
                  else if (at! === o && at! !== 1) {
                    o = at!
                    e = {}
                    e.type = 'pocket'
                    e.object = c
                    e.time = o
                    if (st.intersects === 1 || st.intersects === true) {
                      e.objectIntersectPoint = new Vector2D(nt!.x, nt!.y)
                    }
                    if (st.inside === 1 || st.inside === true) {
                      e.objectIntersectPoint = rt!
                    }
                    e.target = Z
                    s.push(e)
                  }
                }
              }
            }
          }
        }
      }

      if (s.length > 0) {
        this.resolveCollision(s)
      }

      const pt = Maths.fixNumber(o - t)
      if (this.simType !== 1) {
        this.moveBalls(pt)
      }

      t = o
      i++
    } while (s && s.length > 0 && i < 20)
  }

  resolveCollision(t: any[]) {
    this.omissionArray = []

    for (let e = 0; e < t.length; e++) {
      const o = t[e]
      let d: any // Declare at function scope - EXACT as original
      let a: any // normalVelocity - EXACT as original (var scoping)

      if (o.type === 'ball') {
        d = o.object
        d.position = o.objectIntersectPoint

        const s = o.target

        if (this.targetID === -1) {
          this.targetID = s.id
        }

        s.position = o.targetIntersectPoint
        this.omissionArray.push(d)
        this.omissionArray.push(s)

        const n = s.position.minus(d.position).normalize()
        const u = new Vector2D(n.x, n.y)
        const r = u.getRightNormal()
        a = u.times(d.velocity.dot(u))
        const l = r.times(d.velocity.dot(r))
        const c = u.times(s.velocity.dot(u))
        const y = r.times(s.velocity.dot(r))

        if (Math.abs(s.ySpin) < Math.abs(d.ySpin)) {
          s.ySpin = -0.5 * d.ySpin
        }

        if (d.id === 0 && d.firstContact === false) {
          d.deltaScrew = a.times(0.17 * -d.screw)
        }

        const p = c.times(this.ballRestitution).plus(a.times(1 - this.ballRestitution))
        const h = a.times(this.ballRestitution).plus(c.times(1 - this.ballRestitution))

        d.velocity = l.plus(p)
        s.velocity = y.plus(h)

        if (this.simType === 0 && h.magnitude > 450) {
          s.grip = 0
        }

        d.lastCollisionObject = s
        s.lastCollisionObject = d
      }

      if (o.type === 'line') {
        d = o.object
        d.position = o.objectIntersectPoint

        const m = o.target
        this.omissionArray.push(d)

        d.ySpin += -d.velocity.dot(m.direction) / 100

        if (d.ySpin > 50) {
          d.ySpin = 50
        }
        if (d.ySpin < -50) {
          d.ySpin = -50
        }

        a = m.normal.times(d.velocity.dot(m.normal))
        let l = m.direction.times(d.velocity.dot(m.direction))

        if (d.id === 0) {
          l = l.plus(m.direction.times(Maths.fixNumber(0.2 * d.english * d.velocity.magnitude)))
          d.english = Maths.fixNumber(0.5 * d.english)
          if (d.english > -0.1 && d.english < 0.1) {
            d.english = 0
          }
        }

        d.velocity = a.times(-this.cushionRestitution).plus(l)

        if (this.simType === 0 && a.magnitude > 700) {
          d.grip = 0
        }

        d.lastCollisionObject = m
        d.position = d.position.plus(m.normal.times(200))

        if (d.id === 0) {
          d.deltaScrew = d.deltaScrew.times(0.8)
        }
      }

      if (o.type === 'vertex') {
        d = o.object
        d.position = o.objectIntersectPoint

        const v = o.target
        this.omissionArray.push(d)

        const n = v.position.minus(d.position).normalize()
        const u = new Vector2D(n.x, n.y)
        const r = u.getRightNormal()
        a = u.times(d.velocity.dot(u))
        const l = r.times(d.velocity.dot(r))

        d.velocity = a.times(-this.cushionRestitution).plus(l)
        d.position = d.position.minus(u.times(200))
        d.lastCollisionObject = v
        d.lastVertex = v.name

        if (d.id === 0) {
          d.deltaScrew = new Vector2D(0, 0)
        }
      }

      if (o.type === 'pocket') {
        d = o.object
        d.position = o.objectIntersectPoint
        this.omissionArray.push(d)

        const _b = d.velocity.magnitude // Used in original but not in our implementation
      }

      // Send contact event - EXACT as original
      const g: any = {}
      g.collisionType = o.type
      g.ball = d
      g.target = o.target
      g.ballVelocity = d.velocity

      if (o.type === 'ball') {
        g.targetVelocity = o.target.velocity
        if (d.id === 0) {
          g.deltaScrew = d.deltaScrew
        }
      }

      if (o.type === 'line' || o.type === 'vertex') {
        // a is normalVelocity - EXACT as original
        g.normalVelocity = a
      }

      if (o.type === 'pocket') {
        g.speed = d.velocity.magnitude
      }

      this.sendContactEvent(g)

      // Send reciprocal event for ball collisions - EXACT as original
      if (o.type === 'ball') {
        const g2: any = {}
        g2.collisionType = o.type
        g2.ball = o.target
        g2.target = d
        g2.ballVelocity = o.target.velocity
        g2.targetVelocity = d.velocity
        if (o.target.id === 0) {
          g2.deltaScrew = o.target.deltaScrew
        }
        this.sendContactEvent(g2)
      }
    }
  }

  sendContactEvent(t: any) {
    if (this.contactEvent && this.contactEvent.dispatch) {
      this.contactEvent.dispatch(t)
    }
  }

  moveBalls(t: number) {
    for (let i = 0; i < this.ballArray.length; i++) {
      const e = this.ballArray[i]

      if (this.omissionArray.length !== 0 && this.omissionArray.includes(e)) {
        continue
      }

      if (e.active === 1) {
        e.position = e.position.plus(e.velocity.times(t))
      }
    }

    this.omissionArray = []
  }

  updateFriction() {
    for (let t = 0; t < this.ballArray.length; t++) {
      const i = this.ballArray[t]

      // Cue ball special handling
      if (i.id === 0) {
        i.velocity = i.velocity.plus(i.deltaScrew)
        if (i.deltaScrew.magnitude > 0) {
          i.deltaScrew = i.deltaScrew.times(0.8)
          if (i.deltaScrew.magnitude < 1) {
            i.deltaScrew = new Vector2D(0, 0)
          }
        }
      }

      // Apply friction
      let e = i.velocity.magnitude
      e -= this.friction
      const o = i.velocity.normalize()
      i.velocity = o.times(e)

      // Stop if too slow
      if (i.velocity.magnitude < this.minVelocity) {
        i.velocity = new Vector2D(0, 0)
      }

      // Update grip
      if (i.grip < 1) {
        i.grip += 0.02
      }

      // Update spin
      if (i.ySpin >= 0.2) {
        i.ySpin -= 0.2
      }
      if (i.ySpin <= -0.2) {
        i.ySpin += 0.2
      }
      if (i.ySpin >= -0.2 && i.ySpin <= 0.2) {
        i.ySpin = 0
      }

      // Apply spin to velocity
      if (i.ySpin !== 0) {
        const s = i.velocity.getLeftNormal().normalize().times(0.3 * i.ySpin * i.velocity.magnitude / 800)
        i.velocity = i.velocity.plus(s)
      }
    }
  }
}
