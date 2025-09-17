import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import MobileMenu from '../src/components/Header/MobileMenu'
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

describe('MobileMenu', () => {
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

  it('renders mobile menu button', () => {
    renderWithProvider(<MobileMenu />)
    
    const menuButton = screen.getByLabelText('Toggle mobile menu')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveClass('p-2', 'text-gray-700', 'hover:text-blue-600')
  })

  it('renders hamburger icon when closed', () => {
    renderWithProvider(<MobileMenu />)
    
    const menuButton = screen.getByLabelText('Toggle mobile menu')
    const svg = menuButton.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).not.toHaveClass('rotate-90')
  })

  it('toggles mobile menu when clicked', () => {
    renderWithProvider(<MobileMenu />)
    
    const menuButton = screen.getByLabelText('Toggle mobile menu')
    fireEvent.click(menuButton)
    
    const state = store.getState()
    expect(state.ui.isMobileMenuOpen).toBe(true)
  })

  it('shows mobile menu overlay when open', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    const overlay = screen.getByText('Menu').closest('.fixed.inset-0')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'md:hidden')
  })

  it('renders navigation items in mobile menu', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    expect(screen.getByText('Games')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders overlay when mobile menu is open', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    const overlay = screen.getByText('Menu').closest('.fixed.inset-0')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'md:hidden')
  })

  it('closes mobile menu when close button is clicked', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    const closeButton = screen.getByLabelText('Close mobile menu')
    fireEvent.click(closeButton)
    
    const state = testStore.getState()
    expect(state.ui.isMobileMenuOpen).toBe(false)
  })

  it('rotates icon when menu is open', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    const menuButton = screen.getByLabelText('Toggle mobile menu')
    const svg = menuButton.querySelector('svg')
    expect(svg).toHaveClass('rotate-90')
  })

  it('has correct accessibility attributes', () => {
    renderWithProvider(<MobileMenu />)
    
    const menuButton = screen.getByLabelText('Toggle mobile menu')
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle mobile menu')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows close icon when menu is open', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    const closeButton = screen.getByLabelText('Close mobile menu')
    expect(closeButton).toBeInTheDocument()
  })

  it('has correct mobile menu structure', () => {
    const testStore = createTestStore({
      ui: { isMobileMenuOpen: true },
    })
    
    render(
      <Provider store={testStore}>
        <MobileMenu />
      </Provider>
    )
    
    const menuTitle = screen.getByText('Menu')
    expect(menuTitle).toBeInTheDocument()
    expect(menuTitle).toHaveClass('text-lg', 'font-semibold', 'text-gray-900')
  })
})
