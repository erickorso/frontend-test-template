import React from 'react'
import { render, screen } from '@testing-library/react'
import Logo from '../src/components/Header/Logo'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

describe('Logo', () => {
  it('renders logo with correct structure', () => {
    render(<Logo />)
    
    const logoLink = screen.getByLabelText('Game Store - Go to homepage')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(logoLink).toHaveClass('flex', 'items-center', 'space-x-2', 'text-2xl', 'font-bold')
  })

  it('renders logo icon', () => {
    render(<Logo />)
    
    const logoIcon = screen.getByText('G')
    expect(logoIcon).toBeInTheDocument()
    expect(logoIcon).toHaveClass('text-white', 'font-bold', 'text-lg')
  })

  it('renders logo text on larger screens', () => {
    render(<Logo />)
    
    const logoText = screen.getByText('Game Store')
    expect(logoText).toBeInTheDocument()
    expect(logoText).toHaveClass('hidden', 'sm:block')
  })

  it('has correct hover styles', () => {
    render(<Logo />)
    
    const logoLink = screen.getByLabelText('Game Store - Go to homepage')
    expect(logoLink).toHaveClass('hover:text-blue-600', 'transition-colors', 'duration-200')
  })

  it('has correct icon container styles', () => {
    render(<Logo />)
    
    const iconContainer = screen.getByText('G').parentElement
    expect(iconContainer).toHaveClass('w-8', 'h-8', 'bg-blue-600', 'rounded-lg', 'flex', 'items-center', 'justify-center')
  })

  it('is accessible', () => {
    render(<Logo />)
    
    const logoLink = screen.getByLabelText('Game Store - Go to homepage')
    expect(logoLink).toHaveAttribute('aria-label', 'Game Store - Go to homepage')
  })
})
