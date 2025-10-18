import type { NetworkConfigs } from './type'

export const networkConfig: NetworkConfigs = {
  mainnet: {
    network: 'mainnet',
    jsonRpcUrl: 'https://mainnet.hashio.io/api',
    mirrorNodeUrl: 'https://mainnet.mirrornode.hedera.com',
    chainId: '0x127',
  },
  testnet: {
    network: 'testnet',
    jsonRpcUrl: 'https://testnet.hashio.io/api',
    mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
    chainId: '0x128',
  },
  previewnet: {
    network: 'previewnet',
    jsonRpcUrl: 'https://previewnet.hashio.io/api',
    mirrorNodeUrl: 'https://previewnet.mirrornode.hedera.com',
    chainId: '0x129',
  },
}
