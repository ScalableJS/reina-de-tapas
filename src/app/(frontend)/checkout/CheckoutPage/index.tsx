'use client'

import { LoadingShimmer } from '@/components/LoadingShimmer'
import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useCart } from '@/providers/Cart'
import { useTheme } from '@/providers/Theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, Suspense, useEffect, useRef, useState } from 'react'

import { cssVariables } from '@/cssVariables'
import { CheckoutForm } from '../CheckoutForm'


export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)
  const [clientSecret, setClientSecret] = useState()
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)

  const { cart, cartIsEmpty, cartTotal } = useCart()



  return (
    <div className="flex flex-col items-stretch justify-stretch md:flex-row grow">
      <div className="basis-full lg:basis-1/2 flex flex-col gap-8 lg:pr-8 pt-8">
        <h2 className="font-medium text-3xl">Contact</h2>
        {!user && (
          <div className="prose dark:prose-invert dark:bg-black rounded-sm p-4 grow w-full flex items-center">
            <Button asChild className="no-underline text-inherit" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
            <p className="mt-0">
              <span className="mx-2">or</span>
              <Link href="/create-account">create an account</Link>
            </p>
          </div>
        )}
        {user ? (
          <div className="dark:bg-black rounded-sm p-4 w-full">
            <div>
              <p>{user.email}</p>{' '}
              <p>
                Not you? <Link href="/logout">Log out</Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="datk:bg-black rounded-sm p-4 w-full">
            <div>
              <p className="mb-4">Enter your email to checkout as a guest.</p>
              <div className="max-w-sm mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </div>
              <Button
                disabled={!email}
                onClick={() => {
                  setEmailEditable(false)
                }}
                variant="default"
              >
                Continue as guest
              </Button>
            </div>
          </div>
        )}

        <h2 className="font-medium text-3xl">Payment</h2>

        {cartIsEmpty && (
          <div className="prose dark:prose-invert">
            <p>
              Your cart is empty.
              <Link href="/search">Continue shopping?</Link>
            </p>
          </div>
        )}
        {!clientSecret && !error && (
          <div className="my-8">
            <LoadingShimmer number={2} />
          </div>
        )}
        {!clientSecret && error && (
          <div className="my-8">
            <Message error={error} />

            <Button onClick={() => router.refresh()} variant="default">
              Try again
            </Button>
          </div>
        )}
        <CheckoutForm />
      </div>

      {!cartIsEmpty && (
        <div className="basis-full lg:basis-1/2 lg:pl-8 p-8 border-l bg-primary/5 flex flex-col gap-8">
          <h2 className="text-3xl font-medium">Your cart</h2>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const {
                product,
                product: { id, meta, title, gallery },
                quantity,
                variant: variantId,
              } = item

              if (!quantity) return null

              const image = gallery?.[0] || meta?.image

              return (
                <div className="flex items-start gap-4" key={index}>
                  <div className="flex items-stretch justify-stretch h-20 w-20 p-2 rounded-lg border">
                    <div className="relative w-full h-full">
                      {image && typeof image !== 'number' && (
                        <Media className="" fill imgClassName="rounded-lg" resource={image} />
                      )}
                    </div>
                  </div>
                  <div className="flex grow justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-lg">{title}</p>
                      {variantId && (
                        <p className="text-sm font-mono text-primary/50 tracking-[0.1em]">
                          {product.variants
                            ?.find((v) => v.id === variantId)
                            ?.options.map((option) => option.value)
                            .join(', ')}
                        </p>
                      )}
                      <div>
                        {'x'}
                        {quantity}
                      </div>
                    </div>

                    {product.price && <Price amount={product.price} currencyCode="usd" />}
                  </div>
                </div>
              )
            }
            return null
          })}
          <hr />
          <div className="flex justify-between items-center gap-2">
            <span className="uppercase">Total</span>{' '}
            <Price className="text-3xl font-medium" amount={cartTotal.amount} currencyCode="usd" />
          </div>
        </div>
      )}
    </div>
  )
}
