import Phaser from 'phaser'

export class Table {
  private scene: Phaser.Scene
  private width: number
  private height: number
  private pocketRadius: number = 22.5 // Matches original: 2250 * physScale (0.01)
  private pockets: Array<{ x: number, y: number, radius: number }> = []
  private adjustmentScale: number = 2.3 // Original scale factor
  private physScale: number = 0.01 // Original physics scale

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.width = scene.cameras.main.width
    this.height = scene.cameras.main.height
    
    this.createTable()
    this.createPockets()
  }

  private createTable() {
    const centerX = this.width / 2
    const centerY = this.height / 2
    
    // Use original table images
    // Pockets (background layer)
    const pockets = this.scene.add.sprite(centerX, centerY, 'pockets')
    pockets.setOrigin(0.5, 0.5)
    pockets.setDepth(-2)
    
    // Cloth (green felt)
    const cloth = this.scene.add.sprite(centerX, centerY, 'cloth')
    cloth.setOrigin(0.5, 0.5)
    cloth.setDepth(-1)
    
    // Table top (rails/cushions)
    const tableTop = this.scene.add.sprite(centerX, centerY, 'tableTop')
    tableTop.setOrigin(0.5, 0.5)
    tableTop.setDepth(0)
  }

  private createPockets() {
    const centerX = this.width / 2
    const centerY = this.height / 2
    
    // Original pocket calculations: n = 600 * adjustmentScale
    const n = 600 * this.adjustmentScale * this.physScale // Converts to screen space
    const pr = this.pocketRadius
    
    // Match original pocket positions exactly
    const pocketPositions = [
      // Top-left corner
      { x: centerX + (-50 * n - pr / 2), y: centerY + (-25 * n - pr / 4) },
      // Top-middle
      { x: centerX + (0 * n), y: centerY + (-25 * n - pr) },
      // Top-right corner
      { x: centerX + (50 * n + pr / 2), y: centerY + (-25 * n - pr / 4) },
      // Bottom-left corner
      { x: centerX + (-50 * n - pr / 2), y: centerY + (25 * n + pr / 4) },
      // Bottom-middle
      { x: centerX + (0 * n), y: centerY + (25 * n + pr) },
      // Bottom-right corner
      { x: centerX + (50 * n + pr / 2), y: centerY + (25 * n + pr / 4) },
    ]
    
    pocketPositions.forEach(pos => {
      this.pockets.push({ x: pos.x, y: pos.y, radius: pr })
    })
  }

  getCushionBounds() {
    const centerX = this.width / 2
    const centerY = this.height / 2
    const n = 600 * this.adjustmentScale * this.physScale
    
    // Match original cushion bounds (based on line array calculations)
    return {
      left: centerX + (-50 * n),
      right: centerX + (50 * n),
      top: centerY + (-25 * n),
      bottom: centerY + (25 * n)
    }
  }

  getPockets() {
    return this.pockets
  }

  getTableBounds() {
    const centerX = this.width / 2
    const centerY = this.height / 2
    const n = 600 * this.adjustmentScale * this.physScale
    const tableWidth = 100 * n // 50 * 2
    const tableHeight = 50 * n // 25 * 2
    
    return {
      centerX,
      centerY,
      width: tableWidth,
      height: tableHeight
    }
  }

  getPocketRadius() {
    return this.pocketRadius
  }
}

