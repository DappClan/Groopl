export type NetworkName = 'mainnet' | 'testnet' | 'previewnet'
export type ChainId = '0x127' | '0x128' | '0x129'
export interface NetworkConfig {
  network: NetworkName
  jsonRpcUrl: string
  mirrorNodeUrl: string
  chainId: ChainId
}

// purpose of this file is to define the type of the config object
export type NetworkConfigs = {
  [key in NetworkName]: {
    network: NetworkName
    jsonRpcUrl: string
    mirrorNodeUrl: string
    chainId: ChainId
  }
}

export interface AppConfig {
  networks: NetworkConfigs
}
