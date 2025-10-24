import type { CommonRouteTabOption } from '#shared/types'

export interface GameConfig {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  backgroundColor: string
  bannerGradient: string
  tags: Array<{
    text: string
    color?: 'primary' | 'green' | 'red' | 'blue' | 'yellow'
  }>
  available: boolean
  tabs: CommonRouteTabOption[]
}

export function useGames() {
  const games: Record<string, GameConfig> = {
    '8ball-pool': {
      id: '8ball-pool',
      title: '8 Ball Pool',
      subtitle: 'Classic Billiards',
      description: 'Classic pool game - Player vs Player',
      icon: 'i-ri:billiards-fill',
      backgroundColor: '#1a472a',
      bannerGradient: 'from-emerald-600 to-teal-700',
      tags: [
        { text: '2 Players', color: 'primary' },
        { text: 'Available', color: 'green' },
      ],
      available: true,
      tabs: [
        {
          to: '/8ball-pool/play',
          display: 'Play',
          icon: 'i-ri:play-circle-line',
        },
        {
          to: '/8ball-pool/howto',
          display: 'How to Play',
          icon: 'i-ri:question-line',
        },
      ],
    },
    // Add more games here...
  }

  const getGame = (slug: string): GameConfig | undefined => {
    return games[slug]
  }

  const getAllGames = (): GameConfig[] => {
    return Object.values(games)
  }

  const getAvailableGames = (): GameConfig[] => {
    return Object.values(games).filter(game => game.available)
  }

  return {
    games,
    getGame,
    getAllGames,
    getAvailableGames,
  }
}
