// EXACT implementation of 11timer.js
// Timer functionality for single-player mode

/**
 * Updates the timer display
 * EXACT as original updateTimer function
 */
export function updateTimer(gameInfo: any) {
  if (gameInfo.timerStarted) {
    gameInfo.time++
    const seconds = Math.floor(gameInfo.time / 60)
    const hours = Math.floor(seconds / 60)
    const minutes = Math.ceil(seconds % 60)

    let minutesStr = minutes.toString()
    if (minutes < 10) {
      minutesStr = `0${minutes.toString()}`
    }

    // Update timer text if it exists
    if (gameInfo.timerText) {
      gameInfo.timerText.text = `${hours.toString()}:${minutesStr}`
    }
  }
}

/**
 * Starts the timer
 * EXACT as original startTimer function
 */
export function startTimer(gameInfo: any) {
  gameInfo.time = 0
}

/**
 * Ends the timer and triggers game over
 * EXACT as original endTimer function
 */
export function endTimer(gameInfo: any) {
  if (gameInfo.gameRunning) {
    if (gameInfo.timerText) {
      gameInfo.timerText.setScale(0.5, 0.5)
      gameInfo.timerText.text = ''
    }
    gameInfo.gameOver = true
  }
}

/**
 * Adds bonus time
 * EXACT as original increaseTime function
 */
export function increaseTime(gameInfo: any) {
  gameInfo.timeRemaining += 600
}
