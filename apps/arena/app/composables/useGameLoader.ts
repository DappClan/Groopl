export interface GameLoader {
  load: () => Promise<void>
  isLoaded: Ref<boolean>
  isLoading: Ref<boolean>
  cleanup: () => void
}

export function useGameLoader(gameSlug: string): GameLoader {
  const isLoaded = ref(false)
  const isLoading = ref(false)
  let script: HTMLScriptElement | undefined

  const loaders: Record<string, () => Promise<void>> = {
    '8ball-pool': async () => {
      if (isLoading.value || isLoaded.value)
        return

      isLoading.value = true

      try {
        if (import.meta.client) {
          const src = `window.gameID = "8-ball-billiards-classic"; window.gameJS = ["/8ball-pool/assets/src/01phaser.js", "/8ball-pool/assets/src/02Ball.js", "/8ball-pool/assets/src/03contactListener.js", "/8ball-pool/assets/src/04billiardPhysics.js", "/8ball-pool/assets/src/05levelData.js", "/8ball-pool/assets/src/06maths.js", "/8ball-pool/assets/src/07vector2d.js", "/8ball-pool/assets/src/08render.js", "/8ball-pool/assets/src/09sound.js", "/8ball-pool/assets/src/10effects.js", "/8ball-pool/assets/src/11timer.js", "/8ball-pool/assets/src/12load.js", "/8ball-pool/assets/src/13mainMenu.js", "/8ball-pool/assets/src/14setup.js", "/8ball-pool/assets/src/15gameController.js", "/8ball-pool/assets/src/16boot.js", function () { },]; (function (document, url, fgJS, firstJS) { fgJS = document.createElement("script"); firstJS = document.getElementsByTagName("script")[0]; fgJS.src = url + ""; firstJS.parentNode.insertBefore(fgJS, firstJS); })(document, "/8ball-pool/html5games/gameapi/v1.js");`
          // Load the game API framework which handles everything
          await loadScript(src)

          isLoaded.value = true
        }
      }
      catch (error) {
        console.error('Error loading game:', error)
      }
      finally {
        isLoading.value = false
      }
    },
    // Add more game loaders here...
  }

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      script = document.createElement('script')
      script.text = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })
  }

  const load = async () => {
    const loader = loaders[gameSlug]
    if (loader) {
      await loader()
    }
    else {
      console.error(`No loader found for game: ${gameSlug}`)
    }
  }

  const cleanup = () => {
    if (script) {
      document.head.removeChild(script)
    }
  }

  return {
    load,
    isLoaded,
    isLoading,
    cleanup,
  }
}
