import { useState, useEffect } from 'react'
import { gamesService, GamesResponse } from '../services/gamesService'
import { Game } from '../utils/endpoint'

interface UseGamesProps {
  genre: string
  page: number
  search: string
}

interface UseGamesReturn {
  games: Game[]
  isLoading: boolean
  isFilterLoading: boolean
  error: string | null
  currentPage: number
  hasMore: boolean
  loadMoreGames: () => Promise<void>
}

export const useGames = ({ genre, page, search }: UseGamesProps): UseGamesReturn => {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadGames = async () => {
    try {
      setIsLoading(true)
      setIsFilterLoading(true)
      setError(null)
      
      // In test environment, load immediately
      if (process.env.NODE_ENV === 'test') {
        let data: GamesResponse
        if (search && search.trim()) {
          data = await gamesService.searchGames(search, { page, genre })
        } else {
          data = await gamesService.getGames(page, genre)
        }
        
        setGames(data.games)
        setCurrentPage(data.currentPage)
        setHasMore(data.currentPage < data.totalPages)
        setIsLoading(false)
        setIsFilterLoading(false)
        return
      }
      
      // In production, add delay for skeleton loading
      const [data] = await Promise.all([
        (async () => {
          if (search && search.trim()) {
            return await gamesService.searchGames(search, { page, genre })
          } else {
            return await gamesService.getGames(page, genre)
          }
        })(),
        new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1 second delay
      ])
      
      setGames(data.games)
      setCurrentPage(data.currentPage)
      setHasMore(data.currentPage < data.totalPages)
    } catch (err) {
      setError('Failed to load games. Please try again.')
      console.error('Error loading games:', err)
    } finally {
      setIsLoading(false)
      setIsFilterLoading(false)
    }
  }

  const loadMoreGames = async () => {
    if (isLoading || !hasMore) return
    
    try {
      setIsLoading(true)
      const nextPage = currentPage + 1
      let data: GamesResponse
      if (search && search.trim()) {
        data = await gamesService.searchGames(search, { page: nextPage, genre })
      } else {
        data = await gamesService.getGames(nextPage, genre)
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
    loadGames()
  }, [genre, page, search])

  return {
    games,
    isLoading,
    isFilterLoading,
    error,
    currentPage,
    hasMore,
    loadMoreGames
  }
}