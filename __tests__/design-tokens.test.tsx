import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock Next.js components
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Archivo: () => ({ variable: '--font-archivo' }),
}))

describe('Design Tokens Integration', () => {
  it('applies custom color tokens correctly', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    
    // Test that our custom error color token is applied
    expect(main).toHaveClass('text-error')
  })

  it('applies typography tokens correctly', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    
    // Test typography classes
    expect(main).toHaveClass('font-bold', 'text-4xl')
  })

  it('applies layout tokens correctly', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    
    // Test layout classes
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-between')
  })
})
