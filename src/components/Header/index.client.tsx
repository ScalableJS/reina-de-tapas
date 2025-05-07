'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'

export function HeaderClient({ header }: { header: Header }) {
  const menu = header.navItems || []
  const pathname = usePathname()
  if (pathname === '/search' || pathname === '/checkout') {
    return null
  }

  return (
    <nav className="relative z-20 flex items-end justify-between border-b bg-white dark:bg-black">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full justify-between container">
        <div className="flex w-full gap-6 md:w-1/3 relative">
          <Link className="" href="/">
            <Logo className="flex size-16 md:size-26" />
          </Link>
          {menu.length && (
            <ul className="hidden gap-4 text-sm md:flex md:items-center">
              {menu.map((item) => {
                const { link } = item;
                const url = link.url;
                
                return (
                  <li key={item.id}>
                    <Link
                      href={`/shop/${url}`}
                      className={cn(
                        pathname.includes(url) && 'relative navLink',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-end md:w-1/3 gap-4">
          {header.phone && (
            <a
              href={`tel:${header.phone.replace(/[^+\d]/g, '')}`}
              className="hidden text-sm font-medium hover:text-primary md:block py-4"
              aria-label={`Call phone number ${header.phone}`}
            >
              {header.phone}
            </a>
          )}
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            <li>
              <CMSLink
                label={'Search'}
                url="/search"
                className={cn('relative navLink', { active: pathname === '/search' })}
                type="custom"
                size={'clear'}
                appearance="nav"
              />
            </li>
          </ul>
          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </nav>
  )
}
