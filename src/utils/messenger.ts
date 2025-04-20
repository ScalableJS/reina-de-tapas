type EmailConfig = {
  from: string
  to: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
}

export const sendEmail = async ({ order, config }: { order: any; config: EmailConfig }) => {
  /* nodemailer.createTransport({...config}) */
}

type TelegramConfig = { botToken: string; chatId: string }

export const sendTelegram = async ({ order, config }: { order: any; config: TelegramConfig }) => {
  await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.chatId,
      text: `New order #${order.id} total ${order.total}`,
    }),
  })
}
