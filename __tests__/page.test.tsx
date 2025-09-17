import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock Next.js components that might cause issues in tests
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Archivo: () => ({ variable: '--font-archivo' }),
}))

describe('Home Page', () => {
  it('renders hello world message', () => {
    render(<Home />)
    
    // Using RTL best practices - query by accessible role/text
    const heading = screen.getByRole('main')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Hello, world!')
  })

  it('applies correct styling classes', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-between', 'p-24', 'font-bold', 'text-4xl', 'text-error')
  })

  it('has proper semantic structure', () => {
    render(<Home />)
    
    // Check that main element exists and has correct role
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main.tagName).toBe('MAIN')
  })
})
