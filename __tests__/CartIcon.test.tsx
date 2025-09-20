import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CartIcon from '../src/components/Header/CartIcon'
import cartReducer from '../src/store/slices/cartSlice'
import gamesReducer from '../src/store/slices/gamesSlice'
import uiReducer from '../src/store/slices/uiSlice'

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      games: gamesReducer,
      ui: uiReducer,
    },
    preloadedState: {
      cart: {
        items: [],
        summary: { items: [], totalItems: 0, totalPrice: 0 },
        isLoading: false,
        error: null,
        ...initialState.cart,
      },
      games: {
        games: [],
        availableFilters: [],
        totalPages: 1,
        currentPage: 1,
        selectedGenre: null,
        searchQuery: '',
        isLoading: false,
        error: null,
        ...initialState.games,
      },
      ui: {
        isCartOpen: false,
        isMobileMenuOpen: false,
        notifications: [],
        ...initialState.ui,
      },
    },
  })
}

describe('CartIcon', () => {
  let store: ReturnType<typeof createTestStore>

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  beforeEach(() => {
    store = createTestStore()
  })

  it('renders cart icon with correct structure', () => {
    renderWithProvider(<CartIcon />)
    
    const cartButton = screen.getByLabelText(/Shopping cart with \d+ items/)
    expect(cartButton).toBeInTheDocument()
    expect(cartButton).toHaveClass('relative', 'p-3', 'text-gray-700', 'hover:text-blue-600')
  })

  it('renders cart SVG icon', () => {
    renderWithProvider(<CartIcon />)
    
    const svgIcon = screen.getByLabelText(/Shopping cart with \d+ items/).querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
    expect(svgIcon).toHaveClass('w-6', 'h-6')
  })

  it('shows correct item count', () => {
    const testStore = createTestStore({
      cart: {
        summary: { items: [], totalItems: 5, totalPrice: 100 },
      },
    })
    
    render(
      <Provider store={testStore}>
        <CartIcon />
      </Provider>
    )
    
    const countBadge = screen.getByText('5')
    expect(countBadge).toBeInTheDocument()
    expect(countBadge).toHaveClass('absolute', '-top-1', '-right-1', 'bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'text-white')
  })

  it('shows 99+ for counts over 99', () => {
    const testStore = createTestStore({
      cart: {
        summary: { items: [], totalItems: 150, totalPrice: 100 },
      },
    })
    
    render(
      <Provider store={testStore}>
        <CartIcon />
      </Provider>
    )
    
    const countBadge = screen.getByText('99+')
    expect(countBadge).toBeInTheDocument()
  })

  it('does not show count badge when cart is empty', () => {
    renderWithProvider(<CartIcon />)
    
    const countBadge = screen.queryByText(/^\d+$/)
    expect(countBadge).not.toBeInTheDocument()
  })

  it('toggles cart when clicked', () => {
    renderWithProvider(<CartIcon />)
    
    const cartButton = screen.getByLabelText(/Shopping cart with \d+ items/)
    fireEvent.click(cartButton)
    
    const state = store.getState()
    expect(state.ui.isCartOpen).toBe(true)
  })

  it('has correct accessibility attributes', () => {
    renderWithProvider(<CartIcon />)
    
    const cartButton = screen.getByLabelText(/Shopping cart with \d+ items/)
    expect(cartButton).toHaveAttribute('aria-label')
    expect(cartButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('has correct focus styles', () => {
    renderWithProvider(<CartIcon />)
    
    const cartButton = screen.getByLabelText(/Shopping cart with \d+ items/)
    expect(cartButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2')
  })

  it('updates aria-expanded when cart is open', () => {
    const testStore = createTestStore({
      ui: { isCartOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <CartIcon />
      </Provider>
    )
    
    const cartButton = screen.getByLabelText(/Shopping cart with \d+ items/)
    expect(cartButton).toHaveAttribute('aria-expanded', 'true')
  })
})
