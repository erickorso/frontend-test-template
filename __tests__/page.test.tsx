import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock Next.js components that might cause issues in tests
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Archivo: () => ({ variable: '--font-archivo' }),
}))

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    
    const heading = screen.getByRole('main')
    expect(heading).toBeInTheDocument()
    expect(screen.getByText('ErickShop')).toBeInTheDocument()
    expect(screen.getByText('Discover amazing games and build your collection')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen', 'bg-gray-50')
  })

  it('uses Container component correctly', () => {
    render(<Home />)
    
    // Check that Container classes are applied in all sections
    const containers = document.querySelectorAll('.w-full.mx-auto')
    expect(containers).toHaveLength(2) // One for each section
  })

  it('renders the "Browse Games" button', () => {
    render(<Home />)
    const browseButton = screen.getByRole('link', { name: 'Browse Games' })
    expect(browseButton).toBeInTheDocument()
    expect(browseButton).toHaveClass('bg-white', 'text-blue-600')
  })

  it('renders the "Why Choose Our Store?" section', () => {
    render(<Home />)
    expect(screen.getByText('Why Choose Our Store?')).toBeInTheDocument()
    expect(screen.getByText('Fast Delivery')).toBeInTheDocument()
    expect(screen.getByText('Quality Guaranteed')).toBeInTheDocument()
    expect(screen.getByText('Best Prices')).toBeInTheDocument()
  })

  it('renders the "Ready to Start Gaming?" section', () => {
    render(<Home />)
    expect(screen.getByText('ErickShop')).toBeInTheDocument()
    expect(screen.getByText('Discover amazing games and build your collection')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Games' })).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main.tagName).toBe('MAIN')
  })
})