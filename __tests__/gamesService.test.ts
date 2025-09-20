import { gamesService, type GamesResponse, type GamesFilters } from '../src/services/gamesService'

// Mock fetch
global.fetch = jest.fn()

describe('GamesService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getGames', () => {
    it('fetches games successfully without filters', async () => {
      const mockResponse: GamesResponse = {
        games: [
          {
            id: '1',
            genre: 'Action',
            image: '/game-images/test.jpg',
            name: 'Test Game',
            description: 'A test game',
            price: 59.99,
            isNew: true,
          },
        ],
        availableFilters: ['Action', 'RPG'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await gamesService.getGames()

      expect(fetch).toHaveBeenCalledWith('/api/games?page=1')
      expect(result).toEqual(mockResponse)
    })

    it('fetches games with genre filter', async () => {
      const mockResponse: GamesResponse = {
        games: [],
        availableFilters: ['Action'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await gamesService.getGames(1, 'Action')

      expect(fetch).toHaveBeenCalledWith('/api/games?genre=Action&page=1')
    })

    it('fetches games with page filter', async () => {
      const mockResponse: GamesResponse = {
        games: [],
        availableFilters: ['Action'],
        totalPages: 2,
        currentPage: 2,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await gamesService.getGames(2)

      expect(fetch).toHaveBeenCalledWith('/api/games?page=2')
    })

    it('fetches games with multiple filters', async () => {
      const mockResponse: GamesResponse = {
        games: [],
        availableFilters: ['Action'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await gamesService.getGames(1, 'Action')

      expect(fetch).toHaveBeenCalledWith('/api/games?genre=Action&page=1')
    })

    it('handles API errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(gamesService.getGames()).rejects.toThrow('Failed to fetch games')
    })

    it('handles network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(gamesService.getGames()).rejects.toThrow('Failed to fetch games')
    })
  })

  describe('getAvailableFilters', () => {
    it('returns available filters', async () => {
      const mockResponse: GamesResponse = {
        games: [],
        availableFilters: ['Action', 'RPG', 'Adventure'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const filters = await gamesService.getAvailableFilters()

      expect(filters).toEqual(['Action', 'RPG', 'Adventure'])
    })
  })

  describe('searchGames', () => {
    it('searches games by name', async () => {
      const mockResponse: GamesResponse = {
        games: [
          {
            id: '1',
            genre: 'Action',
            image: '/game-images/test.jpg',
            name: 'Test Game',
            description: 'A test game',
            price: 59.99,
            isNew: true,
          },
          {
            id: '2',
            genre: 'Action',
            image: '/game-images/other.jpg',
            name: 'Other Game',
            description: 'Another game',
            price: 39.99,
            isNew: false,
          },
        ],
        availableFilters: ['Action'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await gamesService.searchGames('Test')

      expect(result.games).toHaveLength(1)
      expect(result.games[0].name).toBe('Test Game')
    })

    it('returns all games when query is empty', async () => {
      const mockResponse: GamesResponse = {
        games: [
          {
            id: '1',
            genre: 'Action',
            image: '/game-images/test.jpg',
            name: 'Test Game',
            description: 'A test game',
            price: 59.99,
            isNew: true,
          },
        ],
        availableFilters: ['Action'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await gamesService.searchGames('')

      expect(result.games).toHaveLength(1)
    })

    it('searches case insensitively', async () => {
      const mockResponse: GamesResponse = {
        games: [
          {
            id: '1',
            genre: 'Action',
            image: '/game-images/test.jpg',
            name: 'Test Game',
            description: 'A test game',
            price: 59.99,
            isNew: true,
          },
        ],
        availableFilters: ['Action'],
        totalPages: 1,
        currentPage: 1,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await gamesService.searchGames('test')

      expect(result.games).toHaveLength(1)
      expect(result.games[0].name).toBe('Test Game')
    })
  })
})
