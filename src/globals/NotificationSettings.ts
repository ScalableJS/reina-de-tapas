import type { GlobalConfig } from 'payload'

export const NotificationSettings: GlobalConfig = {
  slug: 'notificationSettings',
  admin: { group: 'Config' },
  access: {
    read: ({ req }) => req.user?.roles?.includes('admin'),
    update: ({ req }) => req.user?.roles?.includes('admin'),
  },

  fields: [
    {
      name: 'channels',
      type: 'blocks',
      label: 'Notification channels',
      blocks: [
        /* ─────────────── EMAIL ─────────────── */
        {
          slug: 'email',
          labels: {
            singular: 'Email',
            plural: 'Email channels',
          },
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: false },
            { name: 'from', type: 'text', required: true },
            { name: 'to', type: 'text', required: true },
            { name: 'smtpHost', type: 'text', required: true },
            { name: 'smtpPort', type: 'number', required: true },
            { name: 'smtpUser', type: 'text', required: true },
            {
              name: 'smtpPass',
              type: 'text',
              required: true,
              admin: { components: { Field: '@/components/SecretField' } },
            },
          ],
        },

        /* ───────────── TELEGRAM ───────────── */
        {
          slug: 'telegram',
          labels: {
            singular: 'Telegram',
            plural: 'Telegram channels',
          },
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: false },
            {
              name: 'botToken',
              type: 'text',
              required: true,
              admin: { components: { Field: '@/components/SecretField' } },
            },
            { name: 'chatId', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
