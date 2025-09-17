import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Header from '../src/components/Header/Header'
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

const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      games: gamesReducer,
      ui: uiReducer,
    },
  })
}

describe('Header', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  it('renders header with correct structure', () => {
    renderWithProvider(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('bg-white', 'shadow-md', 'sticky', 'top-0', 'z-50')
  })

  it('renders logo component', () => {
    renderWithProvider(<Header />)
    
    const logoLink = screen.getByLabelText('Game Store - Go to homepage')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders navigation component', () => {
    renderWithProvider(<Header />)
    
    const navigation = screen.getByLabelText('Main navigation')
    expect(navigation).toBeInTheDocument()
    expect(navigation).toHaveClass('hidden', 'md:flex')
  })

  it('renders cart icon', () => {
    renderWithProvider(<Header />)
    
    const cartButton = screen.getByLabelText(/Shopping cart with \d+ items/)
    expect(cartButton).toBeInTheDocument()
  })

  it('renders mobile menu', () => {
    renderWithProvider(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('has correct container structure', () => {
    renderWithProvider(<Header />)
    
    const container = screen.getByRole('banner').querySelector('.max-w-7xl.mx-auto')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
  })

  it('has correct flex layout', () => {
    renderWithProvider(<Header />)
    
    const flexContainer = screen.getByRole('banner').querySelector('.flex.justify-between')
    expect(flexContainer).toBeInTheDocument()
    expect(flexContainer).toHaveClass('items-center', 'h-16')
  })
})
