import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/Grid/tile'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'

/* export async function generateMetadata({
  params,
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const product = await queryProductBySlug(params.handle)

  if (!product) return notFound()

  const { altText: alt, height, url, width } = product.featuredImage || {}
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)

  return {
    description: product.seo.description || product.description,
    openGraph: url
      ? {
          images: [
            {
              alt,
              height,
              url,
              width,
            },
          ],
        }
      : null,
    robots: {
      follow: indexable,
      googleBot: {
        follow: indexable,
        index: indexable,
      },
      index: indexable,
    },
    title: product.seo.title || product.title,
  }
} */

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const variants = product.enableVariants ? product?.variants : []

  const metaImage = typeof product.meta?.image !== 'string' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? variants?.some((variant) => variant?.stock > 0)
    : product.stock! > 0

  let price = product.price

  if (product.enableVariants && product?.variants?.length) {
    price = product.variants?.reduce((acc, variant) => {
      if (variant?.price > acc) {
        return variant.price
      }
      return acc
    }, product.price || 0)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'usd',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct !== 'string') ?? []

  const gallery = product.gallery?.filter((image) => typeof image !== 'string')

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="container pt-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/shop">
            <ChevronLeftIcon />
            All products
          </Link>
        </Button>
        <div className="flex flex-col rounded-lg border p-8 md:py-12 lg:flex-row lg:gap-8 bg-primary-foreground">
          <div className="h-full w-full basis-full lg:basis-1/2">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {gallery?.length && <Gallery images={gallery} />}
            </Suspense>
          </div>

          <div className="basis-full lg:basis-1/2">
            <ProductDescription product={product} />
          </div>
        </div>
      </div>

      {product.layout && <RenderBlocks blocks={product.layout} />}

      {relatedProducts.length ? (
        <div className="container">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <Link className="relative h-full w-full" href={`/products/${product.slug}`}>
              <GridTileImage
                label={{
                  amount: product.price!,
                  currencyCode: 'usd',
                  title: product.title,
                }}
                media={product.meta?.image as Media}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}
