'use client'

import React, { memo, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '../../components/Container'
import { Game } from '../../utils/endpoint'
import { GamesService } from '../../services/gamesService'

const CatalogPage: React.FC = memo(() => {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  
  const searchParams = useSearchParams()
  const genre = searchParams.get('genre') || ''
  const searchQuery = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const loadGames = async (pageNum: number = 1, genreFilter: string = '', searchTerm: string = '') => {
    try {
      setIsLoading(true)
      setError(null)
      
      let data
      if (searchTerm.trim()) {
        // Use search service when there's a search query
        data = await GamesService.searchGames(searchTerm, { page: pageNum, genre: genreFilter })
      } else {
        // Use regular games service when no search
        data = await GamesService.getGames(pageNum, genreFilter)
      }
      
      setGames(data.games)
      setCurrentPage(data.currentPage)
      setHasMore(data.currentPage < data.totalPages)
    } catch (err) {
      setError('Failed to load games. Please try again.')
      console.error('Error loading games:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreGames = async () => {
    if (isLoading || !hasMore) return
    
    try {
      setIsLoading(true)
      const nextPage = currentPage + 1
      let data
      if (searchQuery.trim()) {
        data = await GamesService.searchGames(searchQuery, { page: nextPage, genre })
      } else {
        data = await GamesService.getGames(nextPage, genre)
      }
      
      setGames(prev => [...prev, ...data.games])
      setCurrentPage(data.currentPage)
      setHasMore(data.currentPage < data.totalPages)
    } catch (err) {
      setError('Failed to load more games. Please try again.')
      console.error('Error loading more games:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGames(page, genre, searchQuery)
  }, [page, genre, searchQuery])

  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Game Catalog</h1>
          
          {/* Search and filter indicators */}
          {(searchQuery || genre) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Search: "{searchQuery}"
                </span>
              )}
              {genre && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Genre: {genre}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && games.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Games grid */}
        {games.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-48 object-cover"
                  />
                  {game.isNew && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      New
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{game.genre}</p>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">${game.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* See more button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreGames}
              disabled={isLoading}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'See More'}
            </button>
          </div>
        )}

        {/* No games found */}
        {!isLoading && games.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No games found for the selected genre.</p>
          </div>
        )}
      </Container>
    </main>
  )
})

CatalogPage.displayName = 'CatalogPage'

export default CatalogPage
