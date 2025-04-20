import type { CollectionAfterChangeHook } from 'payload'
import { sendEmail, sendTelegram } from '@/utils/messenger'

export const sendNotification: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return

  const settings = await req.payload.findGlobal({
    slug: 'notificationSettings',
  })

  // Email
  if (settings.email.enabled) {

    // await sendEmail({
    //   order: doc,
    //   config: {
    //     email: settings.email ?? "",
    //
    //   },
    // })
  }

  // Telegram
  if (settings.telegram.enabled) {
    // await sendTelegram({
    //   order: doc,
    //   config: settings.telegram,
    // })
  }
}