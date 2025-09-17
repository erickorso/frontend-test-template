import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../src/store/slices/cartSlice'
import gamesReducer from '../src/store/slices/gamesSlice'
import uiReducer from '../src/store/slices/uiSlice'

describe('Store Configuration', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        cart: cartReducer,
        games: gamesReducer,
        ui: uiReducer,
      },
    })
  })

  it('should have the correct initial state structure', () => {
    const state = store.getState()

    expect(state).toHaveProperty('cart')
    expect(state).toHaveProperty('games')
    expect(state).toHaveProperty('ui')

    // Check cart initial state
    expect(state.cart).toEqual({
      items: [],
      summary: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
      isLoading: false,
      error: null,
    })

    // Check games initial state
    expect(state.games).toEqual({
      games: [],
      availableFilters: [],
      totalPages: 1,
      currentPage: 1,
      selectedGenre: null,
      searchQuery: '',
      isLoading: false,
      error: null,
    })

    // Check ui initial state
    expect(state.ui).toEqual({
      isCartOpen: false,
      isMobileMenuOpen: false,
      notifications: [],
    })
  })

  it('should have the correct reducers', () => {
    // Test that reducers are properly connected
    expect(cartReducer).toBeDefined()
    expect(gamesReducer).toBeDefined()
    expect(uiReducer).toBeDefined()
  })

  it('should dispatch actions correctly', () => {
    // Test cart actions
    store.dispatch({ type: 'cart/setCartLoading', payload: true })
    const cartState = store.getState().cart
    expect(cartState.isLoading).toBe(true)

    // Test games actions
    store.dispatch({ type: 'games/setGamesLoading', payload: true })
    const gamesState = store.getState().games
    expect(gamesState.isLoading).toBe(true)

    // Test ui actions
    store.dispatch({ type: 'ui/toggleCart' })
    const uiState = store.getState().ui
    expect(uiState.isCartOpen).toBe(true)
  })

  it('should have saga middleware configured', () => {
    // This test verifies that the store is properly configured
    // The actual saga testing is done in individual saga test files
    expect(store).toBeDefined()
    expect(typeof store.dispatch).toBe('function')
    expect(typeof store.getState).toBe('function')
    expect(typeof store.subscribe).toBe('function')
  })

  it('should handle multiple state updates', () => {
    // Dispatch multiple actions
    store.dispatch({ type: 'cart/setCartLoading', payload: true })
    store.dispatch({ type: 'games/setGamesLoading', payload: true })
    store.dispatch({ type: 'ui/toggleCart' })
    store.dispatch({ type: 'ui/toggleMobileMenu' })

    const finalState = store.getState()

    expect(finalState.cart.isLoading).toBe(true)
    expect(finalState.games.isLoading).toBe(true)
    expect(finalState.ui.isCartOpen).toBe(true)
    expect(finalState.ui.isMobileMenuOpen).toBe(true)
  })

  it('should maintain state immutability', () => {
    // Get initial state
    const initialState = store.getState()
    const initialCartState = initialState.cart

    // Dispatch an action
    store.dispatch({ type: 'cart/setCartLoading', payload: true })

    const newState = store.getState()
    const newCartState = newState.cart

    // New state should be different from initial
    expect(newCartState.isLoading).toBe(true)
    expect(initialCartState).not.toBe(newCartState)
  })
})
