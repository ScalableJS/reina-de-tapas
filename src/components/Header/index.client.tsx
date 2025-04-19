'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { Logo } from '@/components/Logo/Logo'

export function HeaderClient({ header }: { header: Header }) {
  const menu = header.navItems || []
  const pathname = usePathname();

  return (
    <nav className="relative z-20 flex items-end justify-between border-b container pt-2 max-w-[108rem]">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-end justify-between">
        <div className="flex w-full items-end gap-6 md:w-1/3 relative">
          <Link className="flex w-full items-center justify-center pt-4 pb-4 md:w-auto" href="/">
            <Logo className="relative top-24 -mt-24" />
          </Link>
          {menu.length && (
            <ul className="hidden gap-4 text-sm md:flex md:items-center">
              {menu.map((item) => {
                const link = item.link;
                if (typeof link.reference?.value === "number") return;

                let url = link.url;

                if (link.type === 'reference' && link.reference?.relationTo === 'categories') {
                  url = `/shop/${link.reference?.value?.slug}`;
                } else if (link.type === 'reference' && link.reference?.relationTo === 'pages') {
                  url = `/${link.reference?.value?.slug}`;
                }

                return (
                  <li key={item.id}>
                    <CMSLink
                      {...link}
                      url={url}
                      size="clear"
                      className={cn('relative navLink', {
                        active: url && url !== '/' ? pathname.includes(url) : false,
                      })}
                      appearance="nav"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end md:w-1/3 gap-4">
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
