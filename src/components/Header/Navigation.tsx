'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { useAppSelector } from '../../store/hooks'

interface NavItem {
  href: string
  label: string
  count?: number
}

const Navigation: React.FC = memo(() => {
  const { totalItems } = useAppSelector((state) => state.cart.summary)

  const navItems: NavItem[] = [
    { href: '/games', label: 'Games' },
    { href: '/categories', label: 'Categories' },
    { href: '/deals', label: 'Deals', count: 5 },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group"
        >
          {item.label}
          {item.count && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {item.count}
            </span>
          )}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
        </Link>
      ))}
    </nav>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
