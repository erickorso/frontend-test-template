import { Game } from '@/utils/endpoint'

// Re-export Game interface for external use
export type { Game }

export interface GamesResponse {
  games: Game[]
  availableFilters: string[]
  totalPages: number
  currentPage: number
}

export interface GamesFilters {
  genre?: string
  page?: number
}

class GamesService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/games'
  }

  /**
   * Fetches games from the API with optional filters
   */
  async getGames(page: number = 1, genre?: string): Promise<GamesResponse> {
    const searchParams = new URLSearchParams()
    
    if (genre) {
      searchParams.append('genre', genre)
    }
    
    searchParams.append('page', page.toString())

    const url = `${this.baseUrl}?${searchParams.toString()}`
    
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching games:', error)
      throw new Error('Failed to fetch games')
    }
  }

  /**
   * Fetches games from the API with optional filters (legacy method)
   */
  async getGamesWithFilters(filters: GamesFilters = {}): Promise<GamesResponse> {
    return this.getGames(filters.page || 1, filters.genre)
  }

  /**
   * Gets available genre filters
   */
  async getAvailableFilters(): Promise<string[]> {
    const response = await this.getGames()
    return response.availableFilters
  }

  /**
   * Searches games by name
   */
  async searchGames(query: string, filters: GamesFilters = {}): Promise<GamesResponse> {
    const response = await this.getGames(filters)
    
    if (!query.trim()) {
      return response
    }

    const filteredGames = response.games.filter(game =>
      game.name.toLowerCase().includes(query.toLowerCase())
    )

    return {
      ...response,
      games: filteredGames
    }
  }
}

export const gamesService = new GamesService()
