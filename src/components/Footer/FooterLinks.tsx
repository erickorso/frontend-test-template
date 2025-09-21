'use client'

import React, { memo } from 'react'
import Link from 'next/link'

interface FooterLink {
  href: string
  label: string
}

interface FooterLinksProps {
  title: string
  links: FooterLink[]
}

const FooterLinks: React.FC<FooterLinksProps> = memo(({ title, links }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
})

FooterLinks.displayName = 'FooterLinks'

export default FooterLinks
