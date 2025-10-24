import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    const baseAssetPath = '/8ball-pool/assets/'

    // Load images
    this.load.image('cloth', `${baseAssetPath}img/cloth.png`)
    this.load.image('tableTop', `${baseAssetPath}img/tableTop.png`)
    this.load.image('pockets', `${baseAssetPath}img/pockets.png`)
    this.load.image('shadow', `${baseAssetPath}img/shadow.png`)
    this.load.image('cue', `${baseAssetPath}img/cue.png`)
    this.load.image('cueShadow', `${baseAssetPath}img/cueShadow.png`)
    this.load.image('powerBarBase', `${baseAssetPath}img/powerBarBase.png`)
    this.load.image('powerBarBG', `${baseAssetPath}img/powerBarBG.png`)
    this.load.image('powerBarTop', `${baseAssetPath}img/powerBarTop.png`)
    this.load.image('cueBallSpot', `${baseAssetPath}img/cueBallSpot.png`)

    // Load ball sprite sheets - EXACT as original
    this.load.spritesheet('solidsSpriteSheet', `${baseAssetPath}img/solidsSpriteSheet.png`, {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 9,
    })

    // Load striped ball sprite sheets (9-15) - EXACT as original
    for (let i = 9; i <= 15; i++) {
      this.load.spritesheet(`ballSpriteSheet${i}`, `${baseAssetPath}img/ballSpriteSheet${i}.png`, {
        frameWidth: 50,
        frameHeight: 50,
        endFrame: 41,
      })
    }

    // Load spot sprite sheet (numbers on balls) - EXACT as original
    this.load.spritesheet('spotSpriteSheet', `${baseAssetPath}img/spotSpriteSheet.png`, {
      frameWidth: 38,
      frameHeight: 38,
      endFrame: 16,
    })

    // Load shade overlay - EXACT as original
    this.load.image('shade', `${baseAssetPath}img/shade.png`)

    // Load audio
    this.load.audio('cueHit', `${baseAssetPath}audio/cueHit.wav`)
    this.load.audio('ballHit', `${baseAssetPath}audio/ballHit2.wav`)
    this.load.audio('cushionHit', `${baseAssetPath}audio/cushionHit.wav`)
    this.load.audio('pocketHit', `${baseAssetPath}audio/pocketHit.wav`)

    // Loading bar
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff',
    })
    loadingText.setOrigin(0.5, 0.5)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0x4CAF50, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })
  }

  create() {
    this.scene.start('GameScene')
  }
}
