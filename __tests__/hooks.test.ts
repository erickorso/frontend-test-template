import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../src/store/hooks'
import cartReducer from '../src/store/slices/cartSlice'
import gamesReducer from '../src/store/slices/gamesSlice'
import uiReducer from '../src/store/slices/uiSlice'

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      games: gamesReducer,
      ui: uiReducer,
    },
  })
}

describe('Redux Hooks', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  describe('useAppDispatch', () => {
    it('should return dispatch function', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      expect(typeof result.current).toBe('function')
    })

    it('should dispatch actions correctly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      // Dispatch an action
      result.current({ type: 'cart/setCartLoading', payload: true })

      const state = store.getState()
      expect(state.cart.isLoading).toBe(true)
    })
  })

  describe('useAppSelector', () => {
    it('should return cart state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result } = renderHook(() => useAppSelector((state) => state.cart), { wrapper })

      expect(result.current).toEqual({
        items: [],
        summary: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
        isLoading: false,
        error: null,
      })
    })

    it('should return games state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result } = renderHook(() => useAppSelector((state) => state.games), { wrapper })

      expect(result.current).toEqual({
        games: [],
        availableFilters: [],
        totalPages: 1,
        currentPage: 1,
        selectedGenre: null,
        searchQuery: '',
        isLoading: false,
        error: null,
      })
    })

    it('should return ui state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result } = renderHook(() => useAppSelector((state) => state.ui), { wrapper })

      expect(result.current).toEqual({
        isCartOpen: false,
        isMobileMenuOpen: false,
        notifications: [],
      })
    })

    it('should update when state changes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result, rerender } = renderHook(() => useAppSelector((state) => state.cart), { wrapper })

      // Initial state
      expect(result.current.isLoading).toBe(false)

      // Dispatch action to change state
      store.dispatch({ type: 'cart/setCartLoading', payload: true })

      // Rerender to get updated state
      rerender()

      expect(result.current.isLoading).toBe(true)
    })

    it('should work with multiple selectors', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result: cartResult } = renderHook(() => useAppSelector((state) => state.cart), { wrapper })
      const { result: gamesResult } = renderHook(() => useAppSelector((state) => state.games), { wrapper })
      const { result: uiResult } = renderHook(() => useAppSelector((state) => state.ui), { wrapper })

      expect(cartResult.current.isLoading).toBe(false)
      expect(gamesResult.current.isLoading).toBe(false)
      expect(uiResult.current.isCartOpen).toBe(false)
    })

    it('should handle selector with parameters', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result } = renderHook(
        () => useAppSelector((state) => ({
          cartLoading: state.cart.isLoading,
          gamesLoading: state.games.isLoading,
          cartOpen: state.ui.isCartOpen,
        })),
        { wrapper }
      )

      expect(result.current).toEqual({
        cartLoading: false,
        gamesLoading: false,
        cartOpen: false,
      })
    })
  })

  describe('Hook integration', () => {
    it('should work together in a component-like scenario', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(Provider, { store }, children)

      const { result: dispatch } = renderHook(() => useAppDispatch(), { wrapper })
      const { result: cartState } = renderHook(() => useAppSelector((state) => state.cart), { wrapper })

      // Initial state
      expect(cartState.current.isLoading).toBe(false)

      // Dispatch action
      dispatch.current({ type: 'cart/setCartLoading', payload: true })

      // State should be updated
      expect(store.getState().cart.isLoading).toBe(true)
    })
  })
})
