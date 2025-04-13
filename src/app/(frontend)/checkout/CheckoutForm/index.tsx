'use client'

import type { Order } from '@/payload-types'

import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export const CheckoutForm: React.FC = () => {
  const [error, setError] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()

  function wait(delay = 500) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  const handleSubmit = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault()
      setIsLoading(true)
        try {


          // const redirect = `/orders/${data.docs?.[0]?.id}?paymentId=${paymentIntent.id}`
          // clearCart()
          // router.push(redirect)
         // ${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation
          // clearCart
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Something went wrong.'
          setError(`Error while submitting payment: ${msg}`)

        } finally {
          setIsLoading(false)
        }

    },
    [clearCart, router],
  )

  return (
    <form className="'" onSubmit={handleSubmit}>
      {error && <Message error={error} />}
      {/*<PaymentElement />*/}
      <div className="mt-8 flex gap-4">
        <Button disabled={isLoading} type="submit" variant="default">
          {isLoading ? 'Loading...' : 'Pay now'}
        </Button>
      </div>
    </form>
  )
}

export default CheckoutForm
