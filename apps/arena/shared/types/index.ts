import type { RouteLocationRaw } from 'vue-router'

export interface AppInfo {
  id: string
  name: string
  website: string | null
  redirect_uri: string
  client_id: string
  client_secret: string
  vapid_key: string
}

export type PaginatorState = 'idle' | 'loading' | 'done' | 'error'

export interface ConfirmDialogOptions {
  title: string
  description?: string
  confirm?: string
  cancel?: string
  extraOptionType?: 'mute'
}
export interface ConfirmDialogChoice {
  choice: 'confirm' | 'cancel'
  extraOptions?: {
    mute: {
      duration: number
      notifications: boolean
    }
  }
}

export interface CommonRouteTabOption {
  to: RouteLocationRaw
  display: string
  disabled?: boolean
  name?: string
  icon?: string
  hide?: boolean
  match?: boolean
}
export interface CommonRouteTabMoreOption {
  options: CommonRouteTabOption[]
  icon?: string
  tooltip?: string
  match?: boolean
}

export interface ErrorDialogData {
  title: string
  messages: string[]
  close: string
}

export interface BuildInfo {
  version: string
  commit: string
  shortCommit: string
  time: number
  branch: string
  env: 'preview' | 'canary' | 'dev' | 'release'
}
