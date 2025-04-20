import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utils/mergeOpenGraph'

import { CheckoutPage } from './CheckoutPage'

export default function Checkout() {
  return (
    <div className="container min-h-[90vh] flex">

      <h1 className="sr-only">Checkout</h1>

      <CheckoutPage />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}
