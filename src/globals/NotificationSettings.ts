import type { GlobalConfig } from 'payload'

export const NotificationSettings: GlobalConfig = {
  slug: 'notificationSettings',
  admin: { group: 'Config' },
  access: { read: ({ req }) => req.user?.roles?.includes('admin'), update: ({ req }) => req.user?.roles?.includes('admin') },
  fields: [
    {
      name: 'email',
      type: 'group',
      label: 'Email',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'from', type: 'text' },
        { name: 'to', type: 'text' },
        { name: 'smtpHost', type: 'text' },
        { name: 'smtpPort', type: 'number' },
        { name: 'smtpUser', type: 'text' },
        { name: 'smtpPass', type: 'text', admin: { components: { Field: "@/components/SecretField" } } },
      ],
    },
    {
      name: 'telegram',
      type: 'group',
      label: 'Telegram',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'botToken', type: 'text', admin: { components: { Field: "@/components/SecretField" } } },
        { name: 'chatId', type: 'text' },
      ],
    },
  ],
}