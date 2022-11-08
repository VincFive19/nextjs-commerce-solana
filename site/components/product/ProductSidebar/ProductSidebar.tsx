import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import ErrorMessage from '@components/ui/ErrorMessage'
import { Connection, PublicKey } from '@solana/web3.js'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { Metaplex } from '@metaplex-foundation/js'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  // Wallet Logic
  const [isTokenHolder, setTokenHolder] = useState(false)

  const MainnetCollection = new PublicKey(
    '3saAedkM9o5g1u5DCqsuMZuC4GRqPB4TuMkvSsSVvGQ3'
  )
  const DevnetCollection = new PublicKey(
    '8tgsbiFSd8b2A4VGAczcWYUQjzTZRrSKbSPCaRizEJ89'
  )

  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  const tokenHolder = async () => {
    if (wallet) {
      const metaplex = new Metaplex(connection)
      const nfts = await metaplex.nfts().findAllByOwner({
        owner: wallet.publicKey,
      })

      const matchingNFT = []
      for (const nft of nfts) {
        if (
          nft.collection &&
          nft.collection.verified &&
          (MainnetCollection.equals(nft.collection.address) ||
            DevnetCollection.equals(nft.collection.address))
        ) {
          matchingNFT.push(nft)
        }
      }

      if (matchingNFT.length > 0) {
        setTokenHolder(true)
      }
    }

    tokenHolder()
  }

  // Commerce Logic

  const addItem = useAddItem()
  const { openSidebar, setSidebarView } = useUI()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | Error>(null)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {
    setLoading(true)
    setError(null)
    try {
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0]?.id),
      })
      setSidebarView('CART_VIEW')
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
      if (err instanceof Error) {
        console.error(err)
        setError({
          ...err,
          message: 'Could not add item to cart. Please try again.',
        })
      }
    }
  }

  return (
    <div>
      <div className={className}>
        {console.log(product)}
        <ProductOptions
          options={product.options}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <Text
          className="pb-4 break-words w-full max-w-xl"
          html={product.descriptionHtml || product.description}
        />
        <div className="flex flex-row justify-between items-center">
          <Rating value={4} />
          <div className="text-accent-6 pr-1 font-medium text-sm">
            36 reviews
          </div>
        </div>
        <div>
          {error && <ErrorMessage error={error} className="my-5" />}

          {process.env.COMMERCE_CART_ENABLED &&
          product.productType === 'TokenGated' ? (
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={addToCart}
              loading={loading}
              disabled={
                variant?.availableForSale === false ||
                wallet === false ||
                tokenHolder === false
              }
            >
              {variant?.availableForSale === false
              ? ('Not Available')
              : (
                { wallet 
                  ? ('Please connect your wallet')
                  : ( 
                    { isTokenHolder ? ("You need an Okay Bears NFT to Purchase") : ('Add To Cart')}
                  )
                }
              )
            }
            </Button>
          ) : (
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={addToCart}
              loading={loading}
              disabled={variant?.availableForSale === false}
            >
              {variant?.availableForSale === false
                ? 'Not Available'
                : 'Add To Cart'}
            </Button>
          )}
        </div>
        <div className="mt-6">
          <Collapse title="Care">
            This is a limited edition production run. Printing starts when the
            drop ends.
          </Collapse>
          <Collapse title="Details">
            This is a limited edition production run. Printing starts when the
            drop ends. Reminder: Bad Boys For Life. Shipping may take 10+ days
            due to COVID-19.
          </Collapse>
        </div>
      </div>
    </div>
  )
}

export default ProductSidebar
