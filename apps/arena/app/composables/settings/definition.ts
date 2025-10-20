import { DEFAULT_FONT_SIZE } from '~/constants'

export type FontSize = `${number}px`

// Temporary type for backward compatibility
export type OldFontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ColorMode = 'light' | 'dark' | 'system'

export type NavButtonName = 'home' | 'search' | 'notification' | 'mention' | 'favorite' | 'bookmark' | 'compose' | 'explore' | 'local' | 'federated' | 'list' | 'hashtag' | 'setting' | 'moreMenu'

export interface PreferencesSettings {
  grayscaleMode: boolean
  zenMode: boolean
  showFpsCounter: boolean
  enableSoundEffects: boolean
  enableVibration: boolean
  graphicsQuality: 'low' | 'medium' | 'high'
  showPlayerUsernames: boolean
  optimizeForLowPerformanceDevice: boolean
}

export interface UserSettings {
  preferences: Partial<PreferencesSettings>
  colorMode?: ColorMode
  fontSize: FontSize
  language?: string
  disabledTranslationLanguages: string[]
  themeColors?: ThemeColors
}

export interface ThemeColors {
  '--theme-color-name': string

  '--c-primary': string
  '--c-primary-active': string
  '--c-primary-light': string
  '--c-primary-fade': string
  '--c-dark-primary': string
  '--c-dark-primary-active': string
  '--c-dark-primary-light': string
  '--c-dark-primary-fade': string

  '--rgb-primary': string
  '--rgb-dark-primary': string
}

export const DEFAULT__PREFERENCES_SETTINGS: PreferencesSettings = {
  grayscaleMode: false,
  zenMode: false,
  showFpsCounter: false,
  enableSoundEffects: true,
  enableVibration: false,
  graphicsQuality: 'medium',
  showPlayerUsernames: true,
  optimizeForLowPerformanceDevice: false,
}

export function getDefaultLanguage(languages: string[]) {
  if (import.meta.server)
    return 'en-US'
  return matchLanguages(languages, navigator.languages) || 'en-US'
}

export function getDefaultUserSettings(locales: string[] = ['en-US']): UserSettings {
  return {
    fontSize: DEFAULT_FONT_SIZE,
    language: getDefaultLanguage(locales),
    disabledTranslationLanguages: [],
    preferences: DEFAULT__PREFERENCES_SETTINGS,
  }
}
