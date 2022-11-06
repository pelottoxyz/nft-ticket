import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit'
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.sepolia]
      : []),
  ],
  [
    alchemyProvider({
      // Alchemy's public api key
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Pelotto',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
