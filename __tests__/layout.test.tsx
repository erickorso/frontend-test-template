import { render, screen } from '@testing-library/react'
import RootLayout from '../src/app/layout'

// Mock Next.js font components
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Archivo: () => ({ variable: '--font-archivo' }),
}))

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )
    
    const child = screen.getByTestId('test-child')
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent('Test Content')
  })

  it('applies correct font classes to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    const body = container.querySelector('body')
    expect(body).toHaveClass('inter')
    expect(body).toHaveAttribute('class', expect.stringContaining('--font-archivo'))
  })

  it('has correct HTML structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
    
    const body = container.querySelector('body')
    expect(body).toBeInTheDocument()
  })

  it('exports correct metadata', () => {
    // Import the metadata directly to test it
    const { metadata } = require('../src/app/layout')
    
    expect(metadata).toEqual({
      title: "Apply Digital Test",
      description: "Frontend development test for Apply Digital",
    })
  })
})
