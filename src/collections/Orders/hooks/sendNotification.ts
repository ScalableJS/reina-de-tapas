import type { CollectionAfterChangeHook } from 'payload'
import { sendTelegram } from '@/utils/messenger'
import { NotificationSetting } from '@/payload-types'

export const sendNotification: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return

  const settings = await req.payload.findGlobal({
    slug: 'notificationSettings',
  })

  const telegramSettings = settings.channels.find(isTelegramTypeGuard)
  if (telegramSettings) {
    await sendTelegram({
      order: doc,
      config: {
        botToken: telegramSettings.botToken,
        chatId: telegramSettings.chatId,
      },
    })
  }
}

type ChannelType = NonNullable<NotificationSetting['channels']>[number]
type TelegramChannelType = Extract<ChannelType, { blockType: 'telegram' }>

const isTelegramTypeGuard = (channel?: ChannelType): channel is TelegramChannelType =>
  !!channel && channel.blockType === 'telegram'
