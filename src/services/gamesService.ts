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
  async getGames(filters: GamesFilters = {}): Promise<GamesResponse> {
    const searchParams = new URLSearchParams()
    
    if (filters.genre) {
      searchParams.append('genre', filters.genre)
    }
    
    if (filters.page) {
      searchParams.append('page', filters.page.toString())
    }

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
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
