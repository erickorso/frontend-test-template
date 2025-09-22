'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'

export const dynamic = 'force-dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Container } from '../../components/Container'
import { GameCardSkeleton } from '../../components/Skeleton'
import { PageTransition } from '../../components/PageTransition'
import { useGames, useCartItems } from '../../hooks'

const CatalogPage: React.FC = memo(() => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const genre = searchParams.get('genre') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const { games, isLoading, isFilterLoading, error, currentPage, hasMore, loadMoreGames } = useGames({
    genre,
    page,
    search
  })

  const { isInCart, addToCart, removeFromCart } = useCartItems()

  // Function to remove search filter
  const removeSearchFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/catalog?${params.toString()}`)
  }

  // Function to remove genre filter
  const removeGenreFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('genre')
    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Game Catalog</h1>

        {/* Search and filter indicators with remove buttons */}
        {(search || genre) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Search: &quot;{search}&quot;
                <button
                  onClick={removeSearchFilter}
                  className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  aria-label="Remove search filter"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {genre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Genre: {genre}
                <button
                  onClick={removeGenreFilter}
                  className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                  aria-label="Remove genre filter"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Game Grid Container with Loading Overlay */}
        <div className="relative">
          {/* Loading state overlay - shows when filtering */}
          {isFilterLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-30 z-20 rounded-lg min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p className="text-xl text-gray-700 mt-6 font-semibold">Loading games...</p>
              </div>
            </div>
          )}

          {/* Skeleton loading for initial load */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fadeIn">
              {Array.from({ length: 8 }).map((_, index) => (
                <GameCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Game Grid */}
          {!isLoading && games.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: index * 0.1
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 group"
                >
                  <div className="relative p-3">
                    <Image
                      src={game.image}
                      alt={game.name}
                      width={400}
                      height={240}
                      className="w-full h-60 object-cover rounded-t"
                    />
                    {game.isNew && (
                      <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded border border-gray-200">
                        New
                      </span>
                    )}
                    {/* Description overlay - only visible on desktop hover */}
                    <div className="absolute inset-0 bg-[#404040] bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center p-4">
                      <p className="text-white text-base text-center leading-relaxed">{game.description}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 uppercase mb-1">Genre: {game.genre}</p>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{game.name}</h3>
                      <span className="text-xl font-bold text-gray-900 flex-shrink-0">${game.price.toFixed(2)}</span>
                    </div>
                    {isInCart(game.id) ? (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRemoveFromCart(game.id)}
                        className="w-full border border-red-600 text-red-600 rounded text-sm font-semibold hover:bg-red-50 transition-colors duration-200 uppercase"
                        style={{ 
                          height: '56px',
                          borderRadius: '4px',
                          padding: '0 16px'
                        }}
                      >
                        Remove
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(game)}
                        className="w-full border border-gray-800 text-gray-800 rounded text-sm font-semibold hover:bg-gray-50 transition-colors duration-200 uppercase"
                        style={{ 
                          height: '56px',
                          borderRadius: '4px',
                          padding: '0 16px'
                        }}
                      >
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {/* No games found */}
          {!isLoading && games.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {genre ? `No games found for the selected genre: ${genre}` : 'No games found'}
              </p>
            </div>
          )}
        </div>

        {/* See more button */}
        {hasMore && (
          <div className="text-left">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMoreGames}
              disabled={isLoading}
              className="bg-[#585660] text-white font-semibold hover:bg-[#4a4a52] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              style={{
                width: '137px',
                height: '56px',
                padding: '12px 24px',
                borderRadius: '8px'
              }}
            >
              {isLoading ? 'Loading...' : 'See More'}
            </motion.button>
          </div>
        )}
        </Container>
      </main>
    </PageTransition>
  )
})

CatalogPage.displayName = 'CatalogPage'

export default CatalogPage
