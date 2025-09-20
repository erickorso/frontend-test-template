import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import CatalogPage from '../src/app/catalog/page'
import { GamesService } from '../src/services/gamesService'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}))

// Mock GamesService
jest.mock('../src/services/gamesService', () => ({
  GamesService: {
    getGames: jest.fn(),
    searchGames: jest.fn(),
  },
}))

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
  availableFilters: ['Action', 'RPG', 'Adventure'],
  totalPages: 2,
  currentPage: 1,
}

describe('CatalogPage', () => {
  const mockSearchParams = new URLSearchParams()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    ;(GamesService.getGames as jest.Mock).mockResolvedValue(mockGamesResponse)
  })

  it('renders catalog page with title', async () => {
    render(<CatalogPage />)
    
    expect(screen.getByText('Game Catalog')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Test Game 1')).toBeInTheDocument()
    })
  })

  it('shows loading indicator initially', () => {
    render(<CatalogPage />)
    
    expect(screen.getByRole('main')).toHaveClass('min-h-screen', 'bg-gray-50')
    // Loading spinner should be present initially
  })

  it('displays games in grid layout', async () => {
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Game 1')).toBeInTheDocument()
      expect(screen.getByText('Test Game 2')).toBeInTheDocument()
    })
    
    const gameCards = screen.getAllByText(/Test Game \d/)
    expect(gameCards).toHaveLength(2)
  })

  it('shows "New" label for new games', async () => {
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('New')).toBeInTheDocument()
    })
  })

  it('displays game information correctly', async () => {
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Game 1')).toBeInTheDocument()
      expect(screen.getByText('Test description 1')).toBeInTheDocument()
      expect(screen.getByText('$59.99')).toBeInTheDocument()
    })
    
    // Check for Action genre in the game card specifically
    const gameCards = screen.getAllByText('Action')
    expect(gameCards).toHaveLength(1) // Only in game card (no select in catalog page)
  })

  it('shows "See More" button when there are more pages', async () => {
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('See More')).toBeInTheDocument()
    })
  })

  it('handles "See More" button click', async () => {
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('See More')).toBeInTheDocument()
    })
    
    const seeMoreButton = screen.getByText('See More')
    fireEvent.click(seeMoreButton)
    
    expect(GamesService.getGames).toHaveBeenCalledWith(2, '')
  })

  it('shows error message when games fail to load', async () => {
    ;(GamesService.getGames as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load games. Please try again.')).toBeInTheDocument()
    })
  })

  it('shows no games message when no games found', async () => {
    ;(GamesService.getGames as jest.Mock).mockResolvedValue({
      games: [],
      availableFilters: [],
      totalPages: 0,
      currentPage: 1,
    })
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('No games found for the selected genre.')).toBeInTheDocument()
    })
  })

  it('loads games with genre filter from URL', async () => {
    mockSearchParams.set('genre', 'Action')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(GamesService.getGames).toHaveBeenCalledWith(1, 'Action')
    })
  })

  it('loads games with page parameter from URL', async () => {
    const testSearchParams = new URLSearchParams()
    testSearchParams.set('page', '2')
    ;(useSearchParams as jest.Mock).mockReturnValue(testSearchParams)
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(GamesService.getGames).toHaveBeenCalledWith(2, '')
    })
  })

  describe('Search functionality', () => {
    it('displays search query indicator when searching', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(GamesService.searchGames as jest.Mock).mockResolvedValue({
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Search: "zelda"')).toBeInTheDocument()
      })
    })

    it('calls searchGames when search query is present', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(GamesService.searchGames as jest.Mock).mockResolvedValue({
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(GamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 1, genre: '' })
      })
    })

    it('combines search and genre filters', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda&genre=Adventure')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(GamesService.searchGames as jest.Mock).mockResolvedValue({
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(GamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 1, genre: 'Adventure' })
        expect(screen.getByText('Search: "zelda"')).toBeInTheDocument()
        expect(screen.getByText('Genre: Adventure')).toBeInTheDocument()
      })
    })

    it('shows no results message when search returns empty', async () => {
      const mockSearchParams = new URLSearchParams('search=nonexistent')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(GamesService.searchGames as jest.Mock).mockResolvedValue({
        games: [],
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('No games found for the selected genre.')).toBeInTheDocument()
      })
    })
  })
})
