import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Navigation from '../src/components/Header/Navigation'
import cartReducer from '../src/store/slices/cartSlice'
import gamesReducer from '../src/store/slices/gamesSlice'
import uiReducer from '../src/store/slices/uiSlice'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

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

describe('Navigation', () => {
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

  it('renders navigation with correct structure', () => {
    renderWithProvider(<Navigation />)
    
    const navigation = screen.getByLabelText('Main navigation')
    expect(navigation).toBeInTheDocument()
    expect(navigation).toHaveClass('hidden', 'md:flex', 'items-center', 'space-x-8')
  })

  it('renders all navigation items', () => {
    renderWithProvider(<Navigation />)
    
    expect(screen.getByText('Games')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders navigation links with correct hrefs', () => {
    renderWithProvider(<Navigation />)
    
    expect(screen.getByText('Games')).toHaveAttribute('href', '/games')
    expect(screen.getByText('Categories')).toHaveAttribute('href', '/categories')
    expect(screen.getByText('Deals')).toHaveAttribute('href', '/deals')
    expect(screen.getByText('About')).toHaveAttribute('href', '/about')
  })

  it('renders count badge for deals', () => {
    renderWithProvider(<Navigation />)
    
    const dealsLink = screen.getByText('Deals')
    const countBadge = dealsLink.parentElement?.querySelector('.bg-red-500')
    expect(countBadge).toBeInTheDocument()
    expect(countBadge).toHaveTextContent('5')
  })

  it('has correct hover styles', () => {
    renderWithProvider(<Navigation />)
    
    const gamesLink = screen.getByText('Games')
    expect(gamesLink).toHaveClass('text-gray-700', 'hover:text-blue-600', 'font-medium', 'transition-colors', 'duration-200')
  })

  it('has correct group hover effects', () => {
    renderWithProvider(<Navigation />)
    
    const gamesLink = screen.getByText('Games')
    expect(gamesLink).toHaveClass('group')
    
    const underline = gamesLink.querySelector('.absolute.bottom-0')
    expect(underline).toHaveClass('w-0', 'h-0.5', 'bg-blue-600', 'transition-all', 'duration-200', 'group-hover:w-full')
  })

  it('is accessible', () => {
    renderWithProvider(<Navigation />)
    
    const navigation = screen.getByLabelText('Main navigation')
    expect(navigation).toHaveAttribute('role', 'navigation')
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation')
  })
})
