import { CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  products: '/products',
  pages: '',
}

export const generatePreviewPath = ({
  collection,
  slug,
}: {
  collection: keyof typeof collectionPrefixMap
  slug: string
}) => {
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `/next/preview?${encodedParams.toString()}`
}
