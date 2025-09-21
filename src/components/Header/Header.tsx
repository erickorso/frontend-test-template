'use client'

import React, { memo, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import CartIcon from './CartIcon'
import { Container } from '../Container'
import { GenreFilter } from '../GenreFilter'

const Header: React.FC = memo(() => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const searchParams = useSearchParams()
  
  // Initialize search query from URL params
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || ''
    setSearchQuery(urlSearchQuery)
  }, [searchParams])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Navigate to catalog with search query
    const searchParams = new URLSearchParams()
    searchParams.set('search', searchQuery.trim())
    searchParams.set('page', '1') // Reset to first page when searching
    
    window.location.href = `/catalog?${searchParams.toString()}`
  }, [searchQuery])

  // No navigation items needed

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* First Row: Logo and Cart Icon */}
      <div className="flex justify-between items-center h-16 bg-white shadow-sm">
        <Container className="flex justify-between items-center">
          {/* GamerShop Logo */}
          <Link href="/" className="text-gray-800 text-2xl font-bold hover:text-blue-600 transition-colors duration-200">
            GamerShop
          </Link>
          
          {/* Cart Icon */}
          <CartIcon />
        </Container>
      </div>

      {/* Second Row: Title, Navigation and Search */}
      <div className="bg-gray-100 py-4 shadow-md">
        <Container>
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Top Sellers
          </h1>

                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                   {/* Search Bar */}
                   <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md">
                     <label htmlFor="search" className="sr-only">Search games</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                         </svg>
                       </div>
                       <input
                         id="search"
                         name="search"
                         type="text"
                         value={searchQuery}
                         onChange={handleSearchChange}
                         placeholder="Search games..."
                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                         aria-label="Search games"
                       />
                     </div>
                   </form>

                   <div className="flex items-center gap-6">
                     {/* Genre Filter */}
                     <GenreFilter />
                     
                     {/* Cart Icon */}
                     <CartIcon />
                   </div>
                 </div>
        </Container>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
