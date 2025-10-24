// EXACT copy from 07vector2d.js - NO CHANGES WHATSOEVER
import { Maths } from './Maths'

export class Vector2D {
  private xValue: number
  private yValue: number

  constructor(t: number, e: number) {
    this.xValue = Maths.fixNumber(t)
    this.yValue = Maths.fixNumber(e)
  }

  get x(): number {
    return this.xValue
  }

  set x(t: number) {
    this.xValue = Maths.fixNumber(t)
  }

  get y(): number {
    return this.yValue
  }

  set y(t: number) {
    this.yValue = Maths.fixNumber(t)
  }

  get angle(): number {
    return Maths.fixNumber(Math.atan2(this.yValue, this.xValue) * (180 / Math.PI))
  }

  set angle(t: number) {
    let e = 0
    if (!Number.isNaN(Number(t))) {
      e = Number(t) * (Math.PI / 180)
    }
    const a = Math.sqrt(this.xValue ** 2 + this.yValue ** 2)
    this.xValue = Maths.fixNumber(a * Math.cos(e))
    this.yValue = Maths.fixNumber(a * Math.sin(e))
  }

  get magnitude(): number {
    return Maths.fixNumber(Math.sqrt(this.xValue * this.xValue + this.yValue * this.yValue))
  }

  get magnitudeSquared(): number {
    return Maths.fixNumber(this.xValue * this.xValue + this.yValue * this.yValue)
  }

  set magnitude(t: number) {
    if (Number.isNaN(Number(t))) {
      this.xValue = this.yValue = 0
      return
    }
    const e = Math.sqrt(this.xValue ** 2 + this.yValue ** 2)
    if (e > 0) {
      this.times(Number(t) / e)
    }
    else {
      this.yValue = 0
      this.xValue = Maths.fixNumber(t)
    }
  }

  plus(t: Vector2D): Vector2D {
    const e = new Vector2D(this.xValue, this.yValue)
    e.xValue += t.xValue
    e.yValue += t.yValue
    e.xValue = Maths.fixNumber(e.xValue)
    e.yValue = Maths.fixNumber(e.yValue)
    return e
  }

  minus(t: Vector2D): Vector2D {
    const e = new Vector2D(this.xValue, this.yValue)
    e.xValue -= t.xValue
    e.yValue -= t.yValue
    e.xValue = Maths.fixNumber(e.xValue)
    e.yValue = Maths.fixNumber(e.yValue)
    return e
  }

  times(t: number | Vector2D): Vector2D {
    const e = new Vector2D(this.xValue, this.yValue)
    if (t instanceof Vector2D) {
      e.xValue *= t.xValue
      e.yValue *= t.yValue
    }
    else {
      e.xValue *= t
      e.yValue *= t
    }
    e.xValue = Maths.fixNumber(e.xValue)
    e.yValue = Maths.fixNumber(e.yValue)
    return e
  }

  rotate(t: number): Vector2D {
    const e = new Vector2D(this.xValue, this.yValue)
    if (Number.isNaN(Number(t))) {
      return e
    }
    const a = Math.sqrt(e.xValue ** 2 + e.yValue ** 2)
    const u = (Math.atan2(e.yValue, e.xValue) * (180 / Math.PI) + Number(t)) * (Math.PI / 180)
    e.xValue = Maths.fixNumber(a * Math.cos(u))
    e.yValue = Maths.fixNumber(a * Math.sin(u))
    return e
  }

  invert(): Vector2D {
    const t = new Vector2D(this.xValue, this.yValue)
    t.xValue *= -1
    t.yValue *= -1
    return t
  }

  normalize(): Vector2D {
    let t = new Vector2D(this.xValue, this.yValue)
    t = t.times(1 / t.magnitude)
    return t
  }

  project(t: Vector2D): Vector2D {
    let e = new Vector2D(this.xValue, this.yValue)
    if (t instanceof Vector2D) {
      const a = e.dot(t) / t.magnitude ** 2
      e.x = t.x
      e.y = t.y
      e = e.times(a)
    }
    return e
  }

  reflect(t: Vector2D): Vector2D {
    let e = new Vector2D(this.xValue, this.yValue)
    if (t instanceof Vector2D) {
      const a = new Vector2D(t.yValue, -t.xValue)
      let u = 2 * e.angleBetween(t)
      if (e.angleBetweenCos(a) <= 0) {
        u *= -1
      }
      e = e.rotate(u)
    }
    return e
  }

  dot(t: Vector2D): number {
    if (t instanceof Vector2D) {
      return Maths.fixNumber(this.xValue * t.xValue + this.yValue * t.yValue)
    }
    return 0
  }

  cross(t: Vector2D): number {
    if (t instanceof Vector2D) {
      return Math.abs(Maths.fixNumber(this.xValue * t.yValue - this.yValue * t.xValue))
    }
    return 0
  }

  angleBetween(t: Vector2D): number {
    if (t instanceof Vector2D) {
      return Maths.fixNumber(Math.acos(this.dot(t) / (this.magnitude * t.magnitude)) * (180 / Math.PI))
    }
    return 0
  }

  angleBetweenSin(t: Vector2D): number {
    if (t instanceof Vector2D) {
      return Maths.fixNumber(this.cross(t) / (this.magnitude * t.magnitude))
    }
    return 0
  }

  angleBetweenCos(t: Vector2D): number {
    if (t instanceof Vector2D) {
      return Maths.fixNumber(this.dot(t) / (this.magnitude * t.magnitude))
    }
    return 0
  }

  swap(t: Vector2D): Vector2D {
    if (t instanceof Vector2D) {
      const e = this.xValue
      const a = this.yValue
      this.xValue = t.xValue
      this.yValue = t.yValue
      t.xValue = e
      t.yValue = a
    }
    return this
  }

  getRightNormal(): Vector2D {
    return new Vector2D(this.yValue, -this.xValue)
  }

  getLeftNormal(): Vector2D {
    return new Vector2D(-this.yValue, this.xValue)
  }

  isNormalTo(t: Vector2D): boolean {
    return t instanceof Vector2D && this.dot(t) === 0
  }

  isEqualTo(t: Vector2D): boolean {
    return t instanceof Vector2D && this.xValue === t.xValue && this.yValue === t.yValue
  }
}
