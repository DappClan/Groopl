import type { BuildInfo } from '#shared/types'

export interface Team {
  github: string
  display: string
  twitter?: string
}

export const grooplTeamMembers: Team[] = [
  {
    github: 'jace254',
    display: 'Joash Agesa',
    twitter: 'joashmacenton',
  },
].sort(() => Math.random() - 0.5)

export function useBuildInfo() {
  return useAppConfig().buildInfo as BuildInfo
}
