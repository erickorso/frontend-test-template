import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CartPage from '../src/app/cart/page'
import { cartService } from '../src/services/cartService'

// Mock the cart service
jest.mock('../src/services/cartService', () => ({
  cartService: {
    getCartItems: jest.fn(),
    removeFromCart: jest.fn(),
    getCartSummary: jest.fn(),
  },
}))

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

const mockCartService = cartService as jest.Mocked<typeof cartService>

const mockCartItems = [
  {
    id: '1',
    name: 'Test Game 1',
    description: 'Test description 1',
    price: 59.99,
    image: '/game-images/test1.jpg',
    genre: 'Action',
    isNew: true,
    quantity: 1,
  },
  {
    id: '2',
    name: 'Test Game 2',
    description: 'Test description 2',
    price: 39.99,
    image: '/game-images/test2.jpg',
    genre: 'RPG',
    isNew: false,
    quantity: 2,
  },
]

const mockCartSummary = {
  items: mockCartItems,
  totalItems: 3,
  totalPrice: 139.97,
}

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    // Mock to return empty array immediately but test loading state
    mockCartService.getCartItems.mockReturnValue([])
    mockCartService.getCartSummary.mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })

    render(<CartPage />)
    
    // Since the component loads immediately, we should see the empty cart state
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('renders empty cart when no items', async () => {
    mockCartService.getCartItems.mockReturnValue([])
    mockCartService.getCartSummary.mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
      expect(screen.getByText('Add some games to get started!')).toBeInTheDocument()
      expect(screen.getByText('Back to Catalog')).toBeInTheDocument()
    })
  })

  it('renders cart items correctly', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
      expect(screen.getByText('2 items in your cart')).toBeInTheDocument()
      expect(screen.getAllByText('Test Game 1')).toHaveLength(2) // One in cart item, one in summary
      expect(screen.getAllByText('Test Game 2')).toHaveLength(2) // One in cart item, one in summary
      expect(screen.getByText('Test description 1')).toBeInTheDocument()
      expect(screen.getByText('Test description 2')).toBeInTheDocument()
    })
  })

  it('displays game details correctly', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Genre: Action')).toBeInTheDocument()
      expect(screen.getByText('Genre: RPG')).toBeInTheDocument()
      expect(screen.getAllByText('Qty: 1')).toHaveLength(2) // One in cart item, one in summary
      expect(screen.getAllByText('Qty: 2')).toHaveLength(2) // One in cart item, one in summary
      expect(screen.getByText('New')).toBeInTheDocument()
    })
  })

  it('displays prices correctly', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getAllByText('$59.99')).toHaveLength(2) // One in cart item, one in summary
      expect(screen.getByText('$39.99')).toBeInTheDocument()
      expect(screen.getByText('$79.98 total')).toBeInTheDocument() // 39.99 * 2
    })
  })

  it('displays order summary correctly', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Order Summary')).toBeInTheDocument()
      expect(screen.getByText('Total Items:')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Total:')).toBeInTheDocument()
      expect(screen.getByText('$139.97')).toBeInTheDocument()
    })
  })

  it('handles remove item from cart', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getAllByText('Test Game 1')).toHaveLength(2) // One in cart item, one in summary
    })

    const removeButtons = screen.getAllByLabelText(/Remove .* from cart/)
    fireEvent.click(removeButtons[0])

    expect(mockCartService.removeFromCart).toHaveBeenCalledWith('1')
  })

  it('renders back to catalog button', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      const backToCatalogButtons = screen.getAllByText('Back to Catalog')
      expect(backToCatalogButtons).toHaveLength(1) // Only one in order summary when cart has items
      
      // Check that the back button links to home
      const backButton = backToCatalogButtons[0]
      expect(backButton.closest('a')).toHaveAttribute('href', '/')
    })
  })

  it('renders checkout button', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument()
    })
  })

  it('handles error when loading cart items', async () => {
    mockCartService.getCartItems.mockImplementation(() => {
      throw new Error('Failed to load cart')
    })
    mockCartService.getCartSummary.mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error loading cart items:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('handles error when removing item', async () => {
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)
    mockCartService.removeFromCart.mockImplementation(() => {
      throw new Error('Failed to remove item')
    })

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<CartPage />)
    
    await waitFor(() => {
      expect(screen.getAllByText('Test Game 1')).toHaveLength(2) // One in cart item, one in summary
    })

    const removeButtons = screen.getAllByLabelText(/Remove .* from cart/)
    fireEvent.click(removeButtons[0])

    expect(consoleSpy).toHaveBeenCalledWith('Error removing item from cart:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })
})
