'use client'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'
import Link from 'next/link'
import { useState } from 'react'
import { InputField } from './InputField'
import { useRouter } from 'next/navigation'

export function CheckoutPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [locked, setLocked] = useState(false)

  const { cart, cartIsEmpty, cartTotal, clearCart } = useCart()
  const router = useRouter()

  const allFilled = name && email && phone

  const handleCheckout = async () => {
    try {
      setLocked(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/order-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          ...cart,
          total: cartTotal.amount,
          currency: 'EUR',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId } = await response.json()

      clearCart()
      // TODO: Thank you message or page
      // router.push(`/orders/${orderId}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLocked(false)
    }
  }

  return (
    <div className="flex grow flex-col items-stretch justify-stretch md:flex-row">
      <div className="flex basis-full flex-col gap-8 pt-8 lg:basis-1/2 lg:pr-8">
        <h2 className="text-3xl font-medium">Please enter your contact details</h2>

        <div className="rounded-sm p-4 dark:bg-black">
          <div className="flex flex-col gap-4">
            <InputField
              id="name"
              label="Your Name"
              value={name}
              onChange={setName}
              disabled={locked}
              required
            />
            <InputField
              id="email"
              label="Your Email"
              type="email"
              value={email}
              onChange={setEmail}
              disabled={locked}
              required
            />
            <InputField
              id="phone"
              label="Your Phone"
              type="tel"
              value={phone}
              onChange={setPhone}
              disabled={locked}
              required
            />

            <Button
              className="w-full mt-4"
              variant="default"
              size="lg"
              disabled={!allFilled}
              onClick={() => handleCheckout()}
            >
              Checkout
            </Button>
          </div>
        </div>

        {cartIsEmpty && (
          <p className="prose dark:prose-invert">
            Your cart is empty. <Link href="/search">Continue shopping?</Link>
          </p>
        )}
      </div>

      {!cartIsEmpty && (
        <div className="flex basis-full flex-col gap-8 border-l bg-primary/5 p-8 lg:basis-1/2 lg:pl-8">
          <h2 className="text-3xl font-medium">Your cart</h2>

          {cart?.items?.map((item, index) => {
            if (typeof item.product !== 'object' || !item.product) return null

            const {
              product,
              product: { title, gallery, meta },
              quantity,
              variant: variantId,
            } = item
            if (!quantity) return null

            const image = gallery?.[0] || meta?.image

            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex size-20 items-stretch justify-stretch rounded-lg border p-2 shrink-0">
                  <div className="relative h-full w-full">
                    {image && typeof image !== 'number' && (
                      <Media className="" fill imgClassName="rounded-lg" resource={image} />
                    )}
                  </div>
                </div>

                <div className="flex grow items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium">{title}</p>
                    {variantId && (
                      <p className="font-mono text-sm tracking-[0.1em] text-primary/50">
                        {product.variants
                          ?.find((v) => v.id === variantId)
                          ?.options.map((o) => o.value)
                          .join(', ')}
                      </p>
                    )}
                    <div>
                      {'x'}
                      {quantity}
                    </div>
                  </div>

                  {product.price && <Price amount={product.price} />}
                </div>
              </div>
            )
          })}

          <hr />

          <div className="flex items-center justify-between gap-2">
            <span className="uppercase">Total</span>
            <Price className="text-3xl font-medium" amount={cartTotal.amount} />
          </div>
        </div>
      )}
    </div>
  )
}
