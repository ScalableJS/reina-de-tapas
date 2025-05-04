

interface EmailConfig {
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
  const { name, phone, email } = order.orderedBy;
  const body = [
    `🛍️ <b>New Order #${order.id}</b>`,
    '',
    `👤 <b>Customer:</b>`,
    `• Name: ${esc(name)}`,
    `• Phone: ${esc(phone)}`,
    `• Email: ${esc(email)}`,
    '',
    order.items
      .map(
        ({ quantity, product }) =>
          `• <b>${quantity} × ${esc(product.title)}</b> — ${product.price} ${order.currency}`,
      )
      .join('\n'),
    '',
    `💰 <b>Total: ${order.total.toFixed(2)} ${order.currency}</b>`,
  ].join('\n')

  await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.chatId,
      text: body,
      parse_mode: 'HTML',
    }),
  })
}

const esc = (s: string) => {
  console.log(1, s)
  return  s?.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)
}

