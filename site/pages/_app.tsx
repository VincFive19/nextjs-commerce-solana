import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, ReactNode, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'

import { clusterApiUrl } from '@solana/web3.js'
import type { Adapter } from '@solana/wallet-adapter-base'
import {
  WalletAdapter,
  WalletAdapterNetwork,
} from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  BitKeepWalletAdapter,
  BitpieWalletAdapter,
  BloctoWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinhubWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  TokenPocketWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'


const network: WalletAdapterNetwork =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
    ? WalletAdapterNetwork.Mainnet
    : process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'testnet'
    ? WalletAdapterNetwork.Testnet
    : WalletAdapterNetwork.Devnet

const endpoint: string =
  process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl(network)


const wallets: WalletAdapter[] = [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new SolletExtensionWalletAdapter({ network }),
  new BitKeepWalletAdapter(),
  new BitpieWalletAdapter(),
  new CloverWalletAdapter(),
  new Coin98WalletAdapter(),
  new CoinhubWalletAdapter(),
  new MathWalletAdapter(),
  new SafePalWalletAdapter(),
  new SolongWalletAdapter(),
  new TokenPocketWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
  new SolletWalletAdapter({ network }),
  new BloctoWalletAdapter({ network }),
]

const Noop: FC<{ children?: ReactNode }> = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ManagedUIContext>
              <Layout pageProps={pageProps}>
                <Component {...pageProps} />
              </Layout>
            </ManagedUIContext>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
