import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  menu: Footer['navItems']
}

export function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav>
      <ul>
        {menu.map((item) => {
          return (
            <li key={item.id}>
              {/*@ts-expect-error: Payload CMS may return numeric reference IDs, but CMSLink expects string | Page | Product*/}
              <CMSLink appearance="link" {...item.link} />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
