import type { AppConfig } from './type'
import * as constants from './constants'
import { networkConfig } from './networks'

export const appName = 'Groopl Arena'
export const appDescription = 'A gaming platform powered by Hedera, without the blockchain complexity.'

export const appConfig: AppConfig & {
  constants: typeof constants
} = {
  networks: networkConfig,
  constants,
}

export * from './type'
