import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { WalletConnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '@components/WalletButton'
import { WalletButtonMobile } from '@components/WalletButtonMobile'
import { WalletIcon } from '@components/WalletIcon'
import dynamic from 'next/dynamic'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'


const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
  { ssr: false }
)
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <WalletModalButton>
        <div className="h-full lg:h-[82%]">connect wallet</div>
        <svg className="group-active:hidden hoverful:group-hover:hidden w-full h-full absolute -z-10">
          <use href="#connect-unpressed" />
        </svg>
        <svg className="hidden group-active:hidden hoverful:group-hover:flex w-full h-full absolute -z-10">
          <use href="#connect-unpressed-hover" />
        </svg>
        <svg className="hidden group-active:flex w-full h-full absolute -z-10">
          <use href="#connect-pressed" />
        </svg>
      </WalletModalButton>
      <WalletIcon />
      <WalletButton />
      <WalletButtonMobile />

      <WalletConnectButton />

      <WalletMultiButtonDynamic />
      <WalletDisconnectButtonDynamic />

      <WalletMultiButton />

      <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
              priority: true,
            }}
          />
        ))}
      </Grid>

      <Marquee variant="secondary">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>

      <Hero
        headline=" Dessert dragée halvah croissant. AMAZING STUFF"
        description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "
      />

      <Grid layout="B" variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee>
        {products.slice(3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  )
}

Home.Layout = Layout
