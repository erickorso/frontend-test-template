import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Footer from '../src/components/Footer/Footer'
import cartReducer from '../src/store/slices/cartSlice'
import gamesReducer from '../src/store/slices/gamesSlice'
import uiReducer from '../src/store/slices/uiSlice'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, width, height, className, ...props }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} {...props} />
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

describe('Footer', () => {
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

  it('renders footer with correct structure', () => {
    renderWithProvider(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('bg-gray-800', 'text-white')
  })

  it('uses Container component correctly', () => {
    renderWithProvider(<Footer />)
    
    // Check that Container classes are applied
    const container = screen.getByAltText('A APPLY DIGITAL').closest('div')?.parentElement
    expect(container).toHaveClass('w-full', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'max-w-[1280px]', 'py-4')
  })

  it('renders company logo as a link to home', () => {
    renderWithProvider(<Footer />)
    
    const logoLink = screen.getByRole('link')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    
    const logo = screen.getByAltText('A APPLY DIGITAL')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo_white.svg')
    expect(logo).toHaveClass('h-8', 'w-auto')
  })

  it('has centered logo layout', () => {
    renderWithProvider(<Footer />)
    
    const logoContainer = screen.getByAltText('A APPLY DIGITAL').parentElement?.parentElement
    expect(logoContainer).toHaveClass('flex', 'justify-center', 'items-center')
  })

  it('has correct footer styling', () => {
    renderWithProvider(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('bg-gray-800', 'text-white')
  })
})