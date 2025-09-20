import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock Next.js components that might cause issues in tests
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Archivo: () => ({ variable: '--font-archivo' }),
}))

describe('Design Tokens Integration', () => {
  it('applies custom color tokens correctly', () => {
    render(<Home />)
    const heroSection = screen.getByText('Welcome to Game Store').closest('section')
    expect(heroSection).toHaveClass('from-blue-600', 'to-purple-600', 'text-white')
  })

  it('applies typography tokens correctly', () => {
    render(<Home />)
    const heroHeading = screen.getByText('Welcome to Game Store')
    expect(heroHeading).toHaveClass('font-bold', 'text-4xl', 'md:text-6xl')
  })

  it('applies layout tokens correctly', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen', 'bg-gray-50')
  })
})