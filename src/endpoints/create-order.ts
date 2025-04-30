import type { PayloadHandler } from 'payload'
import { addDataAndFileToRequest } from 'payload'

export const createGuestOrder: PayloadHandler = async (req) => {
  const { payload } = req
  await addDataAndFileToRequest(req)
  const { items, total, currency, name, email, phone } = req.data as {
    items: { product: string; quantity: number; variant: string }[]
    total: number
    currency: string
    name: string
    email: string
    phone?: string
  }

  if (!items?.length || !total || !name || !email) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })
    const userId =
      docs[0]?.id ||
      (
        await payload.create({
          collection: 'users',
          data: { email, name, phone, password: email },
        })
      ).id

    const order = await payload.create({
      collection: 'orders',
      data: {
        orderedBy: userId,
        items : items?.map(({ product, quantity, variant }) => ({
          product: typeof product === 'string' ? Number(product) : product,
          quantity,
          variant,
        })),
        total,
        currency: currency ?? "EUR",
        status: "processing"
      },
      req,
    })

    return Response.json({ success: true, orderId: order.id }, { status: 200 })
  } catch (error) {
    payload.logger.error(error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}