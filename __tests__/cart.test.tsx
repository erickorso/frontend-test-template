import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CartPage from '../src/app/cart/page'
import { useCart } from '../src/hooks/useCart'

// Mock the useCart hook
jest.mock('../src/hooks/useCart', () => ({
  useCart: jest.fn(),
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

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

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
  totalItems: 3,
  totalPrice: 139.97,
}

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCart.mockReturnValue({
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })
  })

  it('renders loading state initially', () => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: true,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
    expect(screen.getAllByText('Loading...')).toHaveLength(4) // 3 cart item skeletons + 1 order summary skeleton
  })

  it('renders empty cart when no items', () => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Catalog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Catalog' })).toHaveAttribute('href', '/catalog')
  })

  it('renders cart items when cart has items', () => {
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      totalItems: mockCartSummary.totalItems,
      totalPrice: mockCartSummary.totalPrice,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getAllByText('Test Game 1')).toHaveLength(2) // Item title and order summary
    expect(screen.getAllByText('Test Game 2')).toHaveLength(2) // Item title and order summary
    expect(screen.getAllByText('$59.99')).toHaveLength(2) // Item price and order summary
    expect(screen.getAllByText('$39.99')).toHaveLength(1) // Item price
    expect(screen.getAllByText('$139.97')).toHaveLength(2) // Order summary total and final total
  })

  it('renders error state when there is an error', () => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: 'Error loading cart items.',
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getByText('Error loading cart items.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Catalog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Catalog' })).toHaveAttribute('href', '/catalog')
  })

  it('calls removeFromCart when remove button is clicked', () => {
    const mockRemoveFromCart = jest.fn()
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      totalItems: mockCartSummary.totalItems,
      totalPrice: mockCartSummary.totalPrice,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    const removeButtons = screen.getAllByLabelText(/Remove.*from cart/)
    fireEvent.click(removeButtons[0])
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1')
  })

  it('calls updateCartItemQuantity when quantity is changed', () => {
    const mockUpdateCartItemQuantity = jest.fn()
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      totalItems: mockCartSummary.totalItems,
      totalPrice: mockCartSummary.totalPrice,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    const quantityInput = screen.getByLabelText('Quantity for Test Game 1')
    fireEvent.change(quantityInput, { target: { value: '3' } })
    
    expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('1', 3)
  })

  it('displays correct total items and price in order summary', () => {
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      totalItems: mockCartSummary.totalItems,
      totalPrice: mockCartSummary.totalPrice,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getByText('Items (3)')).toBeInTheDocument()
    expect(screen.getAllByText('$139.97')).toHaveLength(2) // Order summary total and final total
  })

  it('displays New badge for new items', () => {
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      totalItems: mockCartSummary.totalItems,
      totalPrice: mockCartSummary.totalPrice,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('displays genre information for each item', () => {
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      totalItems: mockCartSummary.totalItems,
      totalPrice: mockCartSummary.totalPrice,
      isLoading: false,
      error: null,
      removeFromCart: jest.fn(),
      updateCartItemQuantity: jest.fn(),
      refreshCart: jest.fn(),
    })

    render(<CartPage />)
    
    expect(screen.getByText('Genre: Action')).toBeInTheDocument()
    expect(screen.getByText('Genre: RPG')).toBeInTheDocument()
  })
})