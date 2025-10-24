// EXACT copy from 06maths.js - NO CHANGES WHATSOEVER
import type { Vector2D } from './Vector2D'

export class Point {
  x: number
  y: number

  constructor(t: number, e: number) {
    this.x = t
    this.y = e
  }

  static interpolate(t: Point, e: Point, n: number): Point {
    const r = Maths.fixNumber((1 - n) * t.x + n * e.x)
    const i = Maths.fixNumber((1 - n) * t.y + n * e.y)
    return new Point(r, i)
  }

  equals(t: Point): boolean {
    return this.x === t.x && this.y === t.y
  }
}

export class Maths {
  static lineIntersectLine2(t: Point, e: Point, n: Point, r: Point): Point | null {
    let i: number, x: number, a: number, u: number
    
    if ((t.x === e.x && t.y === e.y) || (n.x === r.x && n.y === r.y)) {
      return null
    }
    
    const s = new Point(e.x - t.x, e.y - t.y)
    const y = new Point(n.x - t.x, n.y - t.y)
    const f = new Point(r.x - t.x, r.y - t.y)
    
    i = Maths.fixNumber(Math.sqrt(s.x * s.x + s.y * s.y))
    x = Maths.fixNumber(s.x / i)
    a = Maths.fixNumber(s.y / i)
    
    const __c = new Point(y.x * x + y.y * a, y.y * x - y.x * a)
    const __d = new Point(f.x * x + f.y * a, f.y * x - f.x * a)
    
    if ((__c.y < 0 && __d.y < 0) || (__c.y >= 0 && __d.y >= 0)) {
      return null
    }
    
    u = Maths.fixNumber(__d.x + (__c.x - __d.x) * __d.y / (__d.y - __c.y))
    
    if (u < 0 || u > i) {
      return null
    }
    
    return new Point(t.x + u * x, t.y + u * a)
  }

  static lineIntersectLine(t: Point, e: Point, n: Point, r: Point, i?: any): Point | null {
    let x: Point, a: number, u: number, s: number, y: number, f: number, o: number
    
    a = e.y - t.y
    s = t.x - e.x
    f = e.x * t.y - t.x * e.y
    u = r.y - n.y
    y = n.x - r.x
    o = r.x * n.y - n.x * r.y
    
    const h = a * y - u * s
    
    if (h === 0) {
      return null
    }
    
    x = new Point(0, 0)
    x.x = (s * o - y * f) / h
    x.y = (u * f - a * o) / h
    x.x = Maths.fixNumber(x.x)
    x.y = Maths.fixNumber(x.y)
    
    if (true) {
      if ((x.x - t.x) * (x.x - e.x) > 0 || (x.y - t.y) * (x.y - e.y) > 0 ||
          (x.x - n.x) * (x.x - r.x) > 0 || (x.y - n.y) * (x.y - r.y) > 0) {
        return null
      }
    }
    
    return x
  }

  static lineIntersectCircle2(t: Point, e: Point, n: Point, r: number, Vector2DClass: any): any {
    const i: any = {}
    i.inside = false
    i.tangent = false
    i.intersects = false
    i.enter = null
    i.exit = null
    
    // EXACT as original - use Vector2D for calculations
    const x = new Vector2DClass(t.x, t.y)
    const a = new Vector2DClass(e.x, e.y)
    const u = new Vector2DClass(n.x, n.y)
    const s = a.minus(x)
    const y = x.minus(u)
    const f = s.dot(s)
    const o = 2 * y.dot(s)
    let h = o * o - 4 * f * (y.dot(y) - r * r)
    
    if (h < 0) {
      return i
    }
    
    h = Maths.fixNumber(Math.sqrt(h))
    
    if (h === 0) {
      i.tangent = true
      return i
    }
    
    const c = Maths.fixNumber((-o - h) / (2 * f))
    const M = Maths.fixNumber((-o + h) / (2 * f))
    
    if ((c > 1 && M > 1) || (c < 0 && M < 0)) {
      return i
    }
    
    if (c < 0 && M > 1) {
      i.inside = true
      return i
    }
    
    if (c >= 0 && c <= 1) {
      i.enter = Point.interpolate(t, e, M)
      i.enter = new Point(Maths.fixNumber(i.enter.x), Maths.fixNumber(i.enter.y))
      i.intersects = true
      return i
    }
    
    if (M >= 0 && M <= 1) {
      i.exit = Point.interpolate(t, e, c)
      i.exit = new Point(Maths.fixNumber(i.exit.x), Maths.fixNumber(i.exit.y))
      i.intersects = true
      return i
    }
    
    return i
  }

  static circleIntersectCircle(t: number, e: number, n: number, r: number, i: number, x: number): any {
    let a: any = {}
    
    if (n < 0 || x < 0) {
      return null
    }
    
    const u = x
    const s = n
    const y = Math.sqrt((t - r) * (t - r) + (e - i) * (e - i))
    
    if (y > n + x) {
      return null
    }
    
    const f = (s * s + y * y - u * u) / (2 * y)
    const o = Math.sqrt(s * s - f * f)
    
    a.x3 = (r - t) * f / y + (i - e) * o / y + t
    a.y3 = (i - e) * f / y - (r - t) * o / y + e
    a.x4 = (r - t) * f / y - (i - e) * o / y + t
    a.y4 = (i - e) * f / y + (r - t) * o / y + e
    
    return a
  }

  static lineIntersectCircle(t: Point, e: Point, n: Point, r: number): any {
    const i: any = {}
    i.inside = false
    i.tangent = false
    i.intersects = false
    i.enter = null
    i.exit = null
    
    const x = (e.x - t.x) * (e.x - t.x) + (e.y - t.y) * (e.y - t.y)
    const a = 2 * ((e.x - t.x) * (t.x - n.x) + (e.y - t.y) * (t.y - n.y))
    const u = n.x * n.x + n.y * n.y + t.x * t.x + t.y * t.y - 2 * (n.x * t.x + n.y * t.y) - r * r
    let s = Maths.fixNumber(a * a - 4 * x * u)
    
    if (s <= 0) {
      i.inside = false
    }
    else {
      const y = Maths.fixNumber(Math.sqrt(s))
      const f = Maths.fixNumber((-a + y) / (2 * x))
      const o = Maths.fixNumber((-a - y) / (2 * x))
      
      if ((f < 0 || f > 1) && (o < 0 || o > 1)) {
        i.inside = !((f < 0 && o < 0) || (f > 1 && o > 1))
      }
      else {
        if (o >= 0 && o <= 1) {
          i.enter = Point.interpolate(t, e, o)
          i.enter = new Point(Maths.fixNumber(i.enter.x), Maths.fixNumber(i.enter.y))
        }
        if (f >= 0 && f <= 1) {
          i.exit = Point.interpolate(t, e, f)
          i.exit = new Point(Maths.fixNumber(i.exit.x), Maths.fixNumber(i.exit.y))
        }
        i.intersects = true
        
        if (i.exit !== null && i.enter !== null && i.exit.equals(i.enter)) {
          i.tangent = true
        }
      }
    }
    
    return i
  }

  static findBearing(t: number, e: number): number {
    const n = (180 / Math.PI) * Math.atan2(e, t)
    return Maths.fixNumber(n)
  }

  static angleDiff(t: number, e: number): number {
    const n = Maths.wrapValue(t + 180 - e) - 180
    return Maths.fixNumber(n)
  }

  static wrapValue(t: number): number {
    if (t > 360) {
      t -= 360
    }
    if (t < 0) {
      t += 360
    }
    return t
  }

  static wrapInfinite(t: number) {
    // Empty in original
  }

  static fixNumber(t: number | any): number {
    if (isNaN(Number(t))) {
      return 0
    }
    return Math.round(10000 * Number(t)) / 10000
  }

  static createVectorFrom2Points(t: Point, e: Point, Vector2DClass: typeof Vector2D): Vector2D {
    return new Vector2DClass(e.x - t.x, e.y - t.y)
  }

  static checkObjectsConverging(t: any, e: any, n: any, r: any): boolean {
    // EXACT as original: var i = r.minus(n), x = e.minus(t).normalize()
    const i = r.minus(n)
    const x = e.minus(t).normalize()
    return i.angleBetween(x) > 90
  }
}

