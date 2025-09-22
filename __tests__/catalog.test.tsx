import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSearchParams, useRouter } from 'next/navigation'
import CatalogPage from '../src/app/catalog/page'
import { gamesService } from '../src/services/gamesService'
import { cartService } from '../src/services/cartService'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}))

// Mock GamesService
jest.mock('../src/services/gamesService', () => ({
  gamesService: {
    getGames: jest.fn(),
    searchGames: jest.fn(),
  },
}))

// Mock CartService
jest.mock('../src/services/cartService', () => ({
  cartService: {
    getCartItems: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
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
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(gamesService.getGames as jest.Mock).mockResolvedValue(mockGamesResponse)
    ;(cartService.getCartItems as jest.Mock).mockReturnValue([])
    ;(cartService.addToCart as jest.Mock).mockImplementation(() => {})
    ;(cartService.removeFromCart as jest.Mock).mockImplementation(() => {})
    jest.runAllTimers()
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
    const gameCards = screen.getAllByText('Genre: Action')
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
    
    expect(gamesService.getGames).toHaveBeenCalledWith(2, '')
  })

  it('shows error message when games fail to load', async () => {
    ;(gamesService.getGames as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load games. Please try again.')).toBeInTheDocument()
    })
  })

  it('shows no games message when no games found', async () => {
    ;(gamesService.getGames as jest.Mock).mockResolvedValue({
      games: [],
      availableFilters: [],
      totalPages: 0,
      currentPage: 1,
    })
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(screen.getByText('No games found')).toBeInTheDocument()
    })
  })

  it('loads games with genre filter from URL', async () => {
    mockSearchParams.set('genre', 'Action')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(gamesService.getGames).toHaveBeenCalledWith(1, 'Action')
    })
  })

  it('loads games with page parameter from URL', async () => {
    const testSearchParams = new URLSearchParams()
    testSearchParams.set('page', '2')
    ;(useSearchParams as jest.Mock).mockReturnValue(testSearchParams)
    
    render(<CatalogPage />)
    
    await waitFor(() => {
      expect(gamesService.getGames).toHaveBeenCalledWith(2, '')
    })
  })

  describe('Search functionality', () => {
    it('displays search query indicator when searching', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(gamesService.searchGames as jest.Mock).mockResolvedValue({
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
      
      ;(gamesService.searchGames as jest.Mock).mockResolvedValue({
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(gamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 1, genre: '' })
      })
    })

    it('combines search and genre filters', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda&genre=Adventure')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(gamesService.searchGames as jest.Mock).mockResolvedValue({
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(gamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 1, genre: 'Adventure' })
        expect(screen.getByText('Search: "zelda"')).toBeInTheDocument()
        expect(screen.getByText('Genre: Adventure')).toBeInTheDocument()
      })
    })

    it('shows no results message when search returns empty', async () => {
      const mockSearchParams = new URLSearchParams('search=nonexistent')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(gamesService.searchGames as jest.Mock).mockResolvedValue({
        games: [],
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('No games found')).toBeInTheDocument()
      })
    })
  })

  describe('Cart functionality', () => {
    it('loads cart items on mount', async () => {
      const mockCartItems = [
        { id: '1', name: 'Test Game 1', price: 59.99, image: '/test.jpg', quantity: 1, isNew: true, genre: 'Action' }
      ]
      ;(cartService.getCartItems as jest.Mock).mockReturnValue(mockCartItems)
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(cartService.getCartItems).toHaveBeenCalled()
      })
    })

    it('handles cart loading error gracefully', async () => {
      ;(cartService.getCartItems as jest.Mock).mockImplementation(() => {
        throw new Error('Cart loading error')
      })
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading cart items:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('adds game to cart when Add to Cart button is clicked', async () => {
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Test Game 1')).toBeInTheDocument()
      })
      
      const addButton = screen.getAllByText('Add to Cart')[0]
      fireEvent.click(addButton)
      
      expect(cartService.addToCart).toHaveBeenCalledWith(mockGames[0])
    })

    it('removes game from cart when Remove button is clicked', async () => {
      const mockCartItems = [
        { id: '1', name: 'Test Game 1', price: 59.99, image: '/test.jpg', quantity: 1, isNew: true, genre: 'Action' }
      ]
      ;(cartService.getCartItems as jest.Mock).mockReturnValue(mockCartItems)
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Remove')).toBeInTheDocument()
      })
      
      const removeButton = screen.getAllByText('Remove')[0]
      fireEvent.click(removeButton)
      
      expect(cartService.removeFromCart).toHaveBeenCalledWith('1')
    })

    it('handles add to cart error gracefully', async () => {
      ;(cartService.addToCart as jest.Mock).mockImplementation(() => {
        throw new Error('Add to cart error')
      })
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Test Game 1')).toBeInTheDocument()
      })
      
      const addButton = screen.getAllByText('Add to Cart')[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error adding to cart:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('handles remove from cart error gracefully', async () => {
      const mockCartItems = [
        { id: '1', name: 'Test Game 1', price: 59.99, image: '/test.jpg', quantity: 1, isNew: true, genre: 'Action' }
      ]
      ;(cartService.getCartItems as jest.Mock).mockReturnValue(mockCartItems)
      ;(cartService.removeFromCart as jest.Mock).mockImplementation(() => {
        throw new Error('Remove from cart error')
      })
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Remove')).toBeInTheDocument()
      })
      
      const removeButton = screen.getAllByText('Remove')[0]
      fireEvent.click(removeButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error removing from cart:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Filter removal functionality', () => {
    it('removes search filter when X button is clicked', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(gamesService.searchGames as jest.Mock).mockResolvedValue({
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Search: "zelda"')).toBeInTheDocument()
      })
      
      const removeButton = screen.getByLabelText('Remove search filter')
      fireEvent.click(removeButton)
      
      expect(mockRouter.push).toHaveBeenCalledWith('/catalog?')
    })

    it('removes genre filter when X button is clicked', async () => {
      const mockSearchParams = new URLSearchParams('genre=Action')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Genre: Action')).toBeInTheDocument()
      })
      
      const removeButton = screen.getByLabelText('Remove genre filter')
      fireEvent.click(removeButton)
      
      expect(mockRouter.push).toHaveBeenCalledWith('/catalog?')
    })
  })

  describe('Load more games functionality', () => {
    it('loads more games when See More button is clicked', async () => {
      const moreGamesResponse = {
        games: [
          { id: '3', name: 'Test Game 3', genre: 'Adventure', description: 'Test description 3', price: 29.99, image: '/test-image3.jpg', isNew: false }
        ],
        currentPage: 2,
        totalPages: 2,
      }
      ;(gamesService.getGames as jest.Mock)
        .mockResolvedValueOnce(mockGamesResponse)
        .mockResolvedValueOnce(moreGamesResponse)
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('See More')).toBeInTheDocument()
      })
      
      const seeMoreButton = screen.getByText('See More')
      fireEvent.click(seeMoreButton)
      
      await waitFor(() => {
        expect(gamesService.getGames).toHaveBeenCalledWith(2, '')
        expect(screen.getByText('Test Game 3')).toBeInTheDocument()
      })
    })

    it('loads more games with search query when See More button is clicked', async () => {
      const mockSearchParams = new URLSearchParams('search=zelda')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      const moreGamesResponse = {
        games: [
          { id: '3', name: 'Test Game 3', genre: 'Adventure', description: 'Test description 3', price: 29.99, image: '/test-image3.jpg', isNew: false }
        ],
        currentPage: 2,
        totalPages: 2,
      }
      ;(gamesService.searchGames as jest.Mock)
        .mockResolvedValueOnce({ games: mockGames, currentPage: 1, totalPages: 2 })
        .mockResolvedValueOnce(moreGamesResponse)
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('See More')).toBeInTheDocument()
      })
      
      const seeMoreButton = screen.getByText('See More')
      fireEvent.click(seeMoreButton)
      
      await waitFor(() => {
        expect(gamesService.searchGames).toHaveBeenCalledWith('zelda', { page: 2, genre: '' })
        expect(screen.getByText('Test Game 3')).toBeInTheDocument()
      })
    })

    it('handles load more games error gracefully', async () => {
      ;(gamesService.getGames as jest.Mock)
        .mockResolvedValueOnce(mockGamesResponse)
        .mockRejectedValueOnce(new Error('Load more error'))
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('See More')).toBeInTheDocument()
      })
      
      const seeMoreButton = screen.getByText('See More')
      fireEvent.click(seeMoreButton)
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load more games. Please try again.')).toBeInTheDocument()
        expect(consoleSpy).toHaveBeenCalledWith('Error loading more games:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('does not load more games when already loading', async () => {
      ;(gamesService.getGames as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockGamesResponse), 100))
      )
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('See More')).toBeInTheDocument()
      })
      
      const seeMoreButton = screen.getByText('See More')
      fireEvent.click(seeMoreButton)
      fireEvent.click(seeMoreButton) // Click again while loading
      
      // Should only be called once (initial load)
      expect(gamesService.getGames).toHaveBeenCalledTimes(1)
    })

    it('does not load more games when no more pages available', async () => {
      const singlePageResponse = {
        games: mockGames,
        currentPage: 1,
        totalPages: 1,
      }
      ;(gamesService.getGames as jest.Mock).mockResolvedValue(singlePageResponse)
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.queryByText('See More')).not.toBeInTheDocument()
      })
    })
  })

  describe('Loading states', () => {
    it('shows filter loading overlay when filtering', async () => {
      const mockSearchParams = new URLSearchParams('genre=Action')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(gamesService.getGames as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockGamesResponse), 100))
      )
      
      render(<CatalogPage />)
      
      // Should show loading overlay
      expect(screen.getByText('Loading games...')).toBeInTheDocument()
    })

    it('shows loading state on See More button when loading more games', async () => {
      ;(gamesService.getGames as jest.Mock)
        .mockResolvedValueOnce(mockGamesResponse)
        .mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve(mockGamesResponse), 100))
        )
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('See More')).toBeInTheDocument()
      })
      
      const seeMoreButton = screen.getByText('See More')
      fireEvent.click(seeMoreButton)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('No games found with genre filter', () => {
    it('shows specific message when no games found for selected genre', async () => {
      const mockSearchParams = new URLSearchParams('genre=Action')
      ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
      
      ;(gamesService.getGames as jest.Mock).mockResolvedValue({
        games: [],
        currentPage: 1,
        totalPages: 1,
      })
      
      render(<CatalogPage />)
      
      await waitFor(() => {
        expect(screen.getByText('No games found for the selected genre: Action')).toBeInTheDocument()
      })
    })
  })
})
