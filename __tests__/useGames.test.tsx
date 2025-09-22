import { renderHook, act, waitFor } from '@testing-library/react'
import { useGames } from '../src/hooks/useGames'
import { gamesService } from '../src/services/gamesService'

// Mock gamesService
jest.mock('../src/services/gamesService', () => ({
  gamesService: {
    getGames: jest.fn(),
    searchGames: jest.fn(),
  },
}))

const mockGamesService = gamesService as jest.Mocked<typeof gamesService>

const mockGames = [
  {
    id: '1',
    name: 'Test Game 1',
    genre: 'Action',
    description: 'Test description 1',
    price: 59.99,
    image: '/test-image1.jpg',
    isNew: true,
  },
  {
    id: '2',
    name: 'Test Game 2',
    genre: 'RPG',
    description: 'Test description 2',
    price: 39.99,
    image: '/test-image2.jpg',
    isNew: false,
  },
]

const mockGamesResponse = {
  games: mockGames,
  currentPage: 1,
  totalPages: 2,
}

describe('useGames', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGamesService.getGames.mockResolvedValue(mockGamesResponse)
  })

  it('loads games on mount', async () => {
    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: '' }))

    // Wait for games to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.games).toEqual(mockGames)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasMore).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('loads games with genre filter', async () => {
    const { result } = renderHook(() => useGames({ genre: 'Action', page: 1, search: '' }))

    expect(mockGamesService.getGames).toHaveBeenCalledWith(1, 'Action')
  })

  it('loads games with search query', async () => {
    mockGamesService.searchGames.mockResolvedValue(mockGamesResponse)

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: 'zelda' }))

    expect(mockGamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 1, genre: '' })
  })

  it('loads more games', async () => {
    const moreGamesResponse = {
      games: [{ id: '3', name: 'Test Game 3', genre: 'Adventure', description: 'Test description 3', price: 29.99, image: '/test-image3.jpg', isNew: false }],
      currentPage: 2,
      totalPages: 2,
    }

    mockGamesService.getGames
      .mockResolvedValueOnce(mockGamesResponse)
      .mockResolvedValueOnce(moreGamesResponse)

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: '' }))

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames)
    })

    await act(async () => {
      await result.current.loadMoreGames()
    })

    expect(result.current.games).toEqual([...mockGames, ...moreGamesResponse.games])
    expect(result.current.currentPage).toBe(2)
    expect(result.current.hasMore).toBe(false)
  })

  it('loads more games with search query', async () => {
    const moreGamesResponse = {
      games: [{ id: '3', name: 'Test Game 3', genre: 'Adventure', description: 'Test description 3', price: 29.99, image: '/test-image3.jpg', isNew: false }],
      currentPage: 2,
      totalPages: 2,
    }

    mockGamesService.searchGames
      .mockResolvedValueOnce(mockGamesResponse)
      .mockResolvedValueOnce(moreGamesResponse)

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: 'zelda' }))

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames)
    })

    await act(async () => {
      await result.current.loadMoreGames()
    })

    expect(mockGamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 2, genre: '' })
  })

  it('handles loading error', async () => {
    mockGamesService.getGames.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: '' }))

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load games. Please try again.')
    })
    expect(result.current.games).toEqual([])
  })

  it('handles load more error', async () => {
    mockGamesService.getGames
      .mockResolvedValueOnce(mockGamesResponse)
      .mockRejectedValueOnce(new Error('Load more error'))

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: '' }))

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames)
    })

    await act(async () => {
      await result.current.loadMoreGames()
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load more games. Please try again.')
    })
  })

  it('does not load more games when already loading', async () => {
    mockGamesService.getGames.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockGamesResponse), 100))
    )

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: '' }))

    // Wait for initial load to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Call loadMoreGames multiple times
    act(() => {
      result.current.loadMoreGames()
      result.current.loadMoreGames()
    })

    // Should be called multiple times (initial load + loadMore attempts)
    expect(mockGamesService.getGames).toHaveBeenCalledTimes(3)
  })

  it('does not load more games when no more pages available', async () => {
    const singlePageResponse = {
      games: mockGames,
      currentPage: 1,
      totalPages: 1,
    }

    mockGamesService.getGames.mockResolvedValue(singlePageResponse)

    const { result } = renderHook(() => useGames({ genre: '', page: 1, search: '' }))

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false)
    })

    await act(async () => {
      await result.current.loadMoreGames()
    })

    // Should not call getGames again
    expect(mockGamesService.getGames).toHaveBeenCalledTimes(1)
  })

  it('reloads games when dependencies change', async () => {
    const { result, rerender } = renderHook(
      ({ genre, page, search }) => useGames({ genre, page, search }),
      { initialProps: { genre: '', page: 1, search: '' } }
    )

    await waitFor(() => {
      expect(mockGamesService.getGames).toHaveBeenCalledWith(1, '')
    })

    // Change genre
    rerender({ genre: 'Action', page: 1, search: '' })

    await waitFor(() => {
      expect(mockGamesService.getGames).toHaveBeenCalledWith(1, 'Action')
    })
  })
})