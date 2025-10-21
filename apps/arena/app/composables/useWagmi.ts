// connectors
import {
  injected,
  safe,
  walletConnect,
} from '@wagmi/connectors'
import { fallback, http } from '@wagmi/core'
import { hederaTestnet } from '@wagmi/core/chains'

// use wagmi
import { createConfig } from 'use-wagmi'

export function useWagmi(rpc: string, fallbackRpc?: string) {
  const config = useRuntimeConfig()

  const metadata = {
    name: 'Groopl',
    description: 'Hedera Social Gaming Platform',
    url: 'https://groopl-arena.vercel.app',
  }

  return createConfig({
    chains: [hederaTestnet],
    connectors:
      config.public.env.node === 'production'
        ? [
            walletConnect({ projectId: config.public.walletConnectProjectId }),
            safe({
              allowedDomains: [/app.safe.global$/],
            }),
          ]
        : [
            walletConnect({ projectId: config.public.walletConnectProjectId }),
            injected({
              target: {
                id: 'windowProvider',
                name: 'Window Provider',
                provider: window.ethereum,
              },
            }),
          ],
    metadata,
    transports: {
      [hederaTestnet.id]: fallback([http(rpc), http(fallbackRpc)]),
    },
  })
}
