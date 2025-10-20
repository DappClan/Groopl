import type { Ref } from 'vue'
import type { FontSize, OldFontSize, PreferencesSettings, UserSettings } from './definition'
import { STORAGE_KEY_SETTINGS } from '~/constants'
import { oldFontSizeMap } from '~/constants/options'
import { DEFAULT__PREFERENCES_SETTINGS, getDefaultUserSettings } from './definition'

export function useUserSettings() {
  // Get available locales for default language detection
  const locales = import.meta.client && useNuxtApp().$i18n
    ? (unref(useNuxtApp().$i18n.locales) as any[]).map(locale => locale.code)
    : ['en-US']

  const settingsStorage = useWalletLocalStorage<UserSettings>(
    STORAGE_KEY_SETTINGS,
    () => getDefaultUserSettings(locales),
  )

  // Backward compatibility, font size was xs, sm, md, lg, xl before
  if (settingsStorage.value.fontSize && !settingsStorage.value.fontSize.includes('px'))
    settingsStorage.value.fontSize = oldFontSizeMap[settingsStorage.value.fontSize as OldFontSize] as FontSize

  return settingsStorage
}

// TODO: refactor & simplify this

export function usePreferences<T extends keyof PreferencesSettings>(name: T): Ref<PreferencesSettings[T]> {
  const userSettings = useUserSettings()
  return computed({
    get() {
      return getPreferences(userSettings.value, name)
    },
    set(value) {
      userSettings.value.preferences[name] = value
    },
  })
}

export function getPreferences<T extends keyof PreferencesSettings>(userSettings: UserSettings, name: T): PreferencesSettings[T] {
  const preference = userSettings?.preferences?.[name] ?? DEFAULT__PREFERENCES_SETTINGS[name]

  return preference
}

export function togglePreferences(key: keyof PreferencesSettings) {
  const flag = usePreferences(key)
  flag.value = !flag.value
}
