'use client'

import React, { memo } from 'react'
import Logo from './Logo'
import Navigation from './Navigation'
import CartIcon from './CartIcon'
import MobileMenu from './MobileMenu'

const Header: React.FC = memo(() => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <Navigation />
          
          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
