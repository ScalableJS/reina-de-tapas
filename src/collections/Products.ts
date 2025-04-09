import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      label: 'Product Name',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Product Description',
    },
    {
      name: 'price',
      type: 'number',
      required: false,
      min: 0,
      admin: {
        description: 'Price in cents (e.g., $10.99 = 1099)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Product Category',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      minRows: 0,
      maxRows: 10,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          type: 'text',
          label: 'Alternative Text',
          required: true,
        },
      ],
    },
  ],
}

