import { cartService } from '../src/services/cartService'
import { Game } from '../src/utils/endpoint'
import {
  watchCartSagas,
  CART_ACTIONS,
  loadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  checkItemInCart,
} from '../src/store/sagas/cartSagas'
const mockGame: Game = {
  id: '1',
  genre: 'Action',
  image: '/game-images/test.jpg',
  name: 'Test Game',
  description: 'A test game',
  price: 59.99,
  isNew: true,
}

describe('cartSagas', () => {
  describe('Action Creators', () => {
    it('should create loadCart action', () => {
      const action = loadCart()
      expect(action).toEqual({ type: CART_ACTIONS.LOAD_CART })
    })

    it('should create addToCart action', () => {
      const action = addToCart(mockGame)
      expect(action).toEqual({ type: CART_ACTIONS.ADD_TO_CART, payload: mockGame })
    })

    it('should create removeFromCart action', () => {
      const action = removeFromCart('1')
      expect(action).toEqual({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: '1' })
    })

    it('should create updateQuantity action', () => {
      const action = updateQuantity('1', 3)
      expect(action).toEqual({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { gameId: '1', quantity: 3 } })
    })

    it('should create clearCart action', () => {
      const action = clearCart()
      expect(action).toEqual({ type: CART_ACTIONS.CLEAR_CART })
    })

    it('should create checkItemInCart action', () => {
      const action = checkItemInCart('1')
      expect(action).toEqual({ type: CART_ACTIONS.CHECK_ITEM_IN_CART, payload: '1' })
    })
  })

  describe('Action Types', () => {
    it('should have correct action types', () => {
      expect(CART_ACTIONS.LOAD_CART).toBe('cart/loadCart')
      expect(CART_ACTIONS.ADD_TO_CART).toBe('cart/addToCart')
      expect(CART_ACTIONS.REMOVE_FROM_CART).toBe('cart/removeFromCart')
      expect(CART_ACTIONS.UPDATE_QUANTITY).toBe('cart/updateQuantity')
      expect(CART_ACTIONS.CLEAR_CART).toBe('cart/clearCart')
      expect(CART_ACTIONS.CHECK_ITEM_IN_CART).toBe('cart/checkItemInCart')
    })
  })

  describe('watchCartSagas', () => {
    it('should export watchCartSagas function', () => {
      expect(typeof watchCartSagas).toBe('function')
    })

    it('should be a generator function', () => {
      const saga = watchCartSagas()
      expect(saga.next).toBeDefined()
      expect(typeof saga.next).toBe('function')
    })
  })
})
