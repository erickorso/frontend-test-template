import { renderHook, act } from '@testing-library/react'
import { useCartItems } from '../src/hooks/useCartItems'
import { cartService } from '../src/services/cartService'

// Mock cartService
jest.mock('../src/services/cartService', () => ({
  cartService: {
    getCartItems: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  },
}))

const mockCartService = cartService as jest.Mocked<typeof cartService>

const mockCartItems = [
  {
    id: '1',
    name: 'Test Game 1',
    price: 59.99,
    image: '/test.jpg',
    quantity: 1,
    isNew: true,
    genre: 'Action',
    description: 'Test description'
  },
  {
    id: '2',
    name: 'Test Game 2',
    price: 39.99,
    image: '/test2.jpg',
    quantity: 1,
    isNew: false,
    genre: 'RPG',
    description: 'Test description 2'
  }
]

describe('useCartItems', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
  })

  it('loads cart items on mount', () => {
    const { result } = renderHook(() => useCartItems())

    expect(result.current.cartItems).toEqual(['1', '2'])
    expect(mockCartService.getCartItems).toHaveBeenCalled()
  })

  it('handles cart loading error gracefully', () => {
    mockCartService.getCartItems.mockImplementation(() => {
      throw new Error('Cart loading error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCartItems())

    expect(result.current.cartItems).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith('Error loading cart items:', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('checks if item is in cart', () => {
    const { result } = renderHook(() => useCartItems())

    expect(result.current.isInCart('1')).toBe(true)
    expect(result.current.isInCart('2')).toBe(true)
    expect(result.current.isInCart('3')).toBe(false)
  })

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartItems())

    const newGame = { id: '3', name: 'Test Game 3', price: 29.99 }

    act(() => {
      result.current.addToCart(newGame)
    })

    expect(mockCartService.addToCart).toHaveBeenCalledWith(newGame)
    expect(result.current.cartItems).toEqual(['1', '2', '3'])
  })

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCartItems())

    act(() => {
      result.current.removeFromCart('1')
    })

    expect(mockCartService.removeFromCart).toHaveBeenCalledWith('1')
    expect(result.current.cartItems).toEqual(['2'])
  })

  it('handles add to cart error gracefully', () => {
    mockCartService.addToCart.mockImplementation(() => {
      throw new Error('Add to cart error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCartItems())

    act(() => {
      result.current.addToCart({ id: '3', name: 'Test Game 3' })
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error adding to cart:', expect.any(Error))
    // Cart items should not change on error
    expect(result.current.cartItems).toEqual(['1', '2'])

    consoleSpy.mockRestore()
  })

  it('handles remove from cart error gracefully', () => {
    mockCartService.removeFromCart.mockImplementation(() => {
      throw new Error('Remove from cart error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCartItems())

    act(() => {
      result.current.removeFromCart('1')
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error removing from cart:', expect.any(Error))
    // Cart items should not change on error
    expect(result.current.cartItems).toEqual(['1', '2'])

    consoleSpy.mockRestore()
  })

  it('updates cart items state correctly', () => {
    const { result } = renderHook(() => useCartItems())

    // Add item
    act(() => {
      result.current.addToCart({ id: '3', name: 'Test Game 3' })
    })

    expect(result.current.cartItems).toEqual(['1', '2'])
    expect(result.current.isInCart('3')).toBe(false)

    // Remove item
    act(() => {
      result.current.removeFromCart('2')
    })

    expect(result.current.cartItems).toEqual(['1', '2'])
    expect(result.current.isInCart('2')).toBe(true)
    expect(result.current.isInCart('3')).toBe(false)
  })
})
