import cartReducer, {
  setCartItems,
  setCartSummary,
  setCartLoading,
  setCartError,
  clearCartError,
} from '../src/store/slices/cartSlice'
import { CartItem } from '../src/services/cartService'

const mockCartItem: CartItem = {
  id: '1',
  genre: 'Action',
  image: '/game-images/test.jpg',
  name: 'Test Game',
  description: 'A test game',
  price: 59.99,
  isNew: true,
  quantity: 2,
}

const mockCartItems: CartItem[] = [mockCartItem]

const mockCartSummary = {
  items: mockCartItems,
  totalItems: 2,
  totalPrice: 119.98,
}

describe('cartSlice', () => {
  const initialState = {
    items: [],
    summary: {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    },
    isLoading: false,
    error: null,
  }

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('setCartItems', () => {
    it('should set cart items and update summary', () => {
      const action = setCartItems(mockCartItems)
      const newState = cartReducer(initialState, action)

      expect(newState.items).toEqual(mockCartItems)
      expect(newState.summary.items).toEqual(mockCartItems)
      expect(newState.summary.totalItems).toBe(2)
      expect(newState.summary.totalPrice).toBe(119.98)
    })

    it('should handle empty cart items', () => {
      const action = setCartItems([])
      const newState = cartReducer(initialState, action)

      expect(newState.items).toEqual([])
      expect(newState.summary.totalItems).toBe(0)
      expect(newState.summary.totalPrice).toBe(0)
    })
  })

  describe('setCartSummary', () => {
    it('should set cart summary', () => {
      const action = setCartSummary(mockCartSummary)
      const newState = cartReducer(initialState, action)

      expect(newState.summary).toEqual(mockCartSummary)
    })
  })

  describe('setCartLoading', () => {
    it('should set loading state to true', () => {
      const action = setCartLoading(true)
      const newState = cartReducer(initialState, action)

      expect(newState.isLoading).toBe(true)
    })

    it('should set loading state to false', () => {
      const action = setCartLoading(false)
      const newState = cartReducer(initialState, action)

      expect(newState.isLoading).toBe(false)
    })
  })

  describe('setCartError', () => {
    it('should set error message', () => {
      const errorMessage = 'Failed to load cart'
      const action = setCartError(errorMessage)
      const newState = cartReducer(initialState, action)

      expect(newState.error).toBe(errorMessage)
    })

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' }
      const action = setCartError(null)
      const newState = cartReducer(stateWithError, action)

      expect(newState.error).toBe(null)
    })
  })

  describe('clearCartError', () => {
    it('should clear error message', () => {
      const stateWithError = { ...initialState, error: 'Some error' }
      const action = clearCartError()
      const newState = cartReducer(stateWithError, action)

      expect(newState.error).toBe(null)
    })
  })

  describe('multiple actions', () => {
    it('should handle multiple state changes', () => {
      let state = cartReducer(initialState, setCartLoading(true))
      expect(state.isLoading).toBe(true)

      state = cartReducer(state, setCartItems(mockCartItems))
      expect(state.items).toEqual(mockCartItems)
      expect(state.isLoading).toBe(true)

      state = cartReducer(state, setCartLoading(false))
      expect(state.isLoading).toBe(false)
      expect(state.items).toEqual(mockCartItems)
    })
  })
})
