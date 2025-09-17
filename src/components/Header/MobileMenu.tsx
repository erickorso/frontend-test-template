'use client'

import React, { memo, useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleMobileMenu } from '../../store/slices/uiSlice'

const MobileMenu: React.FC = memo(() => {
  const dispatch = useAppDispatch()
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = useCallback(() => {
    setIsAnimating(true)
    dispatch(toggleMobileMenu())
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300)
  }, [dispatch])

  const navItems = [
    { href: '/games', label: 'Games' },
    { href: '/categories', label: 'Categories' },
    { href: '/deals', label: 'Deals' },
    { href: '/about', label: 'About' },
  ]

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={handleToggle}
        className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleToggle} />
          <div className="relative flex flex-col w-full max-w-xs h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={handleToggle}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close mobile menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2" role="navigation" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
})

MobileMenu.displayName = 'MobileMenu'

export default MobileMenu
