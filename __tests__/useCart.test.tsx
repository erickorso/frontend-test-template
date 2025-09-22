import { renderHook, act } from '@testing-library/react'
import { useCart } from '../src/hooks/useCart'
import { cartService } from '../src/services/cartService'

// Mock cartService
jest.mock('../src/services/cartService', () => ({
  cartService: {
    getCartItems: jest.fn(),
    getCartSummary: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateCartItemQuantity: jest.fn(),
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
  }
]

const mockCartSummary = {
  totalItems: 1,
  totalPrice: 59.99
}

describe('useCart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCartService.getCartItems.mockReturnValue(mockCartItems)
    mockCartService.getCartSummary.mockReturnValue(mockCartSummary)
  })

  it('loads cart data on mount', async () => {
    const { result } = renderHook(() => useCart())

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.cartItems).toEqual(mockCartItems)
    expect(result.current.totalItems).toBe(1)
    expect(result.current.totalPrice).toBe(59.99)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles cart loading error', async () => {
    mockCartService.getCartItems.mockImplementation(() => {
      throw new Error('Cart loading error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe('Error loading cart items.')
    expect(consoleSpy).toHaveBeenCalledWith('Error loading cart items:', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('adds item to cart', async () => {
    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const newGame = { id: '2', name: 'Test Game 2', price: 39.99 }

    act(() => {
      result.current.addToCart(newGame)
    })

    expect(mockCartService.addToCart).toHaveBeenCalledWith(newGame)
  })

  it('removes item from cart', async () => {
    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.removeFromCart('1')
    })

    expect(mockCartService.removeFromCart).toHaveBeenCalledWith('1')
  })

  it('updates cart item quantity', async () => {
    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.updateCartItemQuantity('1', 2)
    })

    expect(mockCartService.updateCartItemQuantity).toHaveBeenCalledWith('1', 2)
  })

  it('handles add to cart error', async () => {
    mockCartService.addToCart.mockImplementation(() => {
      throw new Error('Add to cart error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.addToCart({ id: '2', name: 'Test Game 2' })
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error adding to cart:', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('handles remove from cart error', async () => {
    mockCartService.removeFromCart.mockImplementation(() => {
      throw new Error('Remove from cart error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.removeFromCart('1')
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error removing from cart:', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('handles update quantity error', async () => {
    mockCartService.updateCartItemQuantity.mockImplementation(() => {
      throw new Error('Update quantity error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.updateCartItemQuantity('1', 2)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error updating cart item quantity:', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('refreshes cart data', async () => {
    const { result } = renderHook(() => useCart())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const newCartItems = [...mockCartItems, { id: '2', name: 'Test Game 2', price: 39.99, image: '/test2.jpg', quantity: 1, isNew: false, genre: 'RPG', description: 'Test description 2' }]
    const newSummary = { totalItems: 2, totalPrice: 99.98 }

    mockCartService.getCartItems.mockReturnValue(newCartItems)
    mockCartService.getCartSummary.mockReturnValue(newSummary)

    await act(async () => {
      await result.current.refreshCart()
    })

    expect(result.current.cartItems).toEqual(newCartItems)
    expect(result.current.totalItems).toBe(2)
    expect(result.current.totalPrice).toBe(99.98)
  })
})
