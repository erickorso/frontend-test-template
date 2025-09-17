import { cartService, type CartItem, type CartSummary } from '../src/services/cartService'
import { Game } from '../src/utils/endpoint'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CartService', () => {
  const mockGame: Game = {
    id: '1',
    genre: 'Action',
    image: '/game-images/test.jpg',
    name: 'Test Game',
    description: 'A test game',
    price: 59.99,
    isNew: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('getCartItems', () => {
    it('returns empty array when localStorage is empty', () => {
      const items = cartService.getCartItems()
      expect(items).toEqual([])
    })

    it('returns cart items from localStorage', () => {
      const mockCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))

      const items = cartService.getCartItems()
      expect(items).toEqual(mockCartItems)
    })

    it('returns empty array when localStorage has invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      const items = cartService.getCartItems()
      expect(items).toEqual([])
    })
  })

  describe('addToCart', () => {
    it('adds new game to cart', () => {
      cartService.addToCart(mockGame)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-cart',
        JSON.stringify([{ ...mockGame, quantity: 1 }])
      )
    })

    it('increments quantity when game already exists', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      cartService.addToCart(mockGame)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-cart',
        JSON.stringify([{ ...mockGame, quantity: 2 }])
      )
    })
  })

  describe('removeFromCart', () => {
    it('removes game from cart', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      cartService.removeFromCart('1')

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-cart',
        JSON.stringify([])
      )
    })

    it('does not remove non-existent game', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      cartService.removeFromCart('2')

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-cart',
        JSON.stringify(existingCartItems)
      )
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity of existing item', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      cartService.updateQuantity('1', 3)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-cart',
        JSON.stringify([{ ...mockGame, quantity: 3 }])
      )
    })

    it('removes item when quantity is 0', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      cartService.updateQuantity('1', 0)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-cart',
        JSON.stringify([])
      )
    })

    it('does not update non-existent item', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      cartService.updateQuantity('2', 3)

      // Should not call setItem when item doesn't exist
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('isInCart', () => {
    it('returns true when game is in cart', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      const isInCart = cartService.isInCart('1')
      expect(isInCart).toBe(true)
    })

    it('returns false when game is not in cart', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 1 },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      const isInCart = cartService.isInCart('2')
      expect(isInCart).toBe(false)
    })
  })

  describe('getCartSummary', () => {
    it('calculates correct totals', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 2 },
        {
          id: '2',
          genre: 'RPG',
          image: '/game-images/rpg.jpg',
          name: 'RPG Game',
          description: 'An RPG game',
          price: 39.99,
          isNew: false,
          quantity: 1,
        },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      const summary = cartService.getCartSummary()

      expect(summary.totalItems).toBe(3)
      expect(summary.totalPrice).toBe(159.97) // (59.99 * 2) + (39.99 * 1)
      expect(summary.items).toHaveLength(2)
    })

    it('returns zero totals for empty cart', () => {
      const summary = cartService.getCartSummary()

      expect(summary.totalItems).toBe(0)
      expect(summary.totalPrice).toBe(0)
      expect(summary.items).toEqual([])
    })
  })

  describe('clearCart', () => {
    it('removes cart from localStorage', () => {
      cartService.clearCart()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('game-cart')
    })
  })

  describe('getCartItemsCount', () => {
    it('returns correct count', () => {
      const existingCartItems: CartItem[] = [
        { ...mockGame, quantity: 2 },
        {
          id: '2',
          genre: 'RPG',
          image: '/game-images/rpg.jpg',
          name: 'RPG Game',
          description: 'An RPG game',
          price: 39.99,
          isNew: false,
          quantity: 1,
        },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCartItems))

      const count = cartService.getCartItemsCount()
      expect(count).toBe(3)
    })
  })
})
