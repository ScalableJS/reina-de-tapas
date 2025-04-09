import type { CollectionConfig } from 'payload';
import { slugField } from '@/filds/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => `/${data.slug || ''}`,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Page Title',
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        {
          slug: 'carousel',
          labels: {
            singular: 'Carousel',
            plural: 'Carousel',
          },
          fields: [
            {
              name: 'images',
              type: 'array',
              label: 'Carousel Images',
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
                  required: true,
                  label: 'Alt Text',
                },
              ],
            },
            {
              name: 'autoplay',
              type: 'checkbox',
              defaultValue: true,
              label: 'Autoplay',
            },
          ],
        },
        {
          slug: 'contacts',
          labels: {
            singular: 'Contacts Section',
            plural: 'Contacts Sections',
          },
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: 'Phone',
            },
            {
              name: 'email',
              type: 'text',
              label: 'Email',
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Address',
            },
          ],
        },
        {
          slug: 'categories',
          labels: {
            singular: 'Categories Section',
            plural: 'Categories Sections',
          },
          fields: [
            {
              name: 'sectionTitle',
              type: 'text',
              label: 'Section Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Section Description',
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories' as const,
              hasMany: true,
              label: 'Linked Categories',
            },
          ],
        },
      ],
    },
    slugField(),
  ],
};
