import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Header from '../src/components/Header/Header'
import cartReducer from '../src/store/slices/cartSlice'
import gamesReducer from '../src/store/slices/gamesSlice'
import uiReducer from '../src/store/slices/uiSlice'

// Mock Next.js navigation hooks
const mockSearchParams = new URLSearchParams()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/catalog'),
  useRouter: jest.fn(() => ({ push: mockPush })),
  useSearchParams: jest.fn(() => mockSearchParams),
}))

// Mock GenreFilter to avoid useSearchParams issues in Header tests
jest.mock('../src/components/GenreFilter', () => ({
  GenreFilter: () => <div data-testid="genre-filter">Genre Filter</div>
}))

// Helper to create a test store
const createTestStore = (initialState?: any) =>
  configureStore({
    reducer: {
      ui: uiReducer,
      cart: cartReducer,
      games: gamesReducer,
    },
    preloadedState: initialState,
  })

// Helper to render component with Redux Provider
const renderWithProvider = (component: React.ReactElement, store?: any) => {
  const testStore = store || createTestStore()
  return {
    ...render(<Provider store={testStore}>{component}</Provider>),
    store: testStore,
  }
}

describe('Header', () => {
  it('renders header with correct structure', () => {
    renderWithProvider(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('sticky', 'top-0', 'z-40', 'w-full')
  })

  it('renders first row with logo and cart icon', () => {
    renderWithProvider(<Header />)
    
    const logoLink = screen.getByRole('link', { name: 'ErickShop' })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(logoLink).toHaveClass('text-gray-800', 'text-2xl', 'font-bold')
    
    const cartButtons = screen.getAllByLabelText(/Shopping cart with \d+ items/)
    expect(cartButtons).toHaveLength(2) // Should have 2 cart buttons (one in each row)
    expect(cartButtons[0]).toBeInTheDocument()
  })

  it('renders second row with title, search and genre filter', () => {
    renderWithProvider(<Header />)
    
    // Check title
    const title = screen.getByRole('heading', { name: 'Top Sellers' })
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-3xl', 'font-extrabold', 'text-gray-900')
    
    // Check search bar (now on the left)
    const searchInput = screen.getByPlaceholderText('Search games...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
    
    // Check genre filter
    const genreFilter = screen.getByTestId('genre-filter')
    expect(genreFilter).toBeInTheDocument()
  })

  it('has correct first row styling', () => {
    renderWithProvider(<Header />)
    
    // Check the outer div (parent of Container) - this is the div with bg-white
    const firstRow = screen.getByText('ErickShop').closest('div')?.parentElement
    expect(firstRow).toHaveClass('bg-white', 'relative', 'z-10', 'h-16')
    
    // Check the Container div (direct parent of logo)
    const containerDiv = screen.getByText('ErickShop').closest('div')
    expect(containerDiv).toHaveClass('flex', 'justify-between', 'items-center', 'h-16')
  })

  it('has correct second row styling', () => {
    renderWithProvider(<Header />)
    
    const secondRow = screen.getByText('Top Sellers').closest('div')?.parentElement?.parentElement
    expect(secondRow).toHaveClass('bg-gray-100', 'py-4', 'shadow-md')
  })

  it('uses Container component correctly', () => {
    renderWithProvider(<Header />)
    
    // Check that Container classes are applied
    const containers = document.querySelectorAll('.w-full.mx-auto')
    expect(containers).toHaveLength(2) // One for each row
  })

  it('handles search input changes', () => {
    renderWithProvider(<Header />)
    
    const searchInput = screen.getByPlaceholderText('Search games...') as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'zelda' } })
    expect(searchInput.value).toBe('zelda')
  })

  it('handles search form submission', () => {
    renderWithProvider(<Header />)
    
    const searchInput = screen.getByPlaceholderText('Search games...')
    const form = searchInput.closest('form')
    
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    fireEvent.submit(form!)
    
    // Verify that the form submission doesn't throw an error
    expect(form).toBeInTheDocument()
    expect(searchInput.value).toBe('test search')
  })

  it('initializes search input with URL parameter', () => {
    // Set search params before rendering
    mockSearchParams.set('search', 'zelda')
    
    renderWithProvider(<Header />)
    
    const searchInput = screen.getByPlaceholderText('Search games...') as HTMLInputElement
    expect(searchInput.value).toBe('zelda')
    
    // Clean up
    mockSearchParams.delete('search')
  })
})