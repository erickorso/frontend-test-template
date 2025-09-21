import React from 'react'
import { render, screen } from '@testing-library/react'
import FooterLinks from '../src/components/Footer/FooterLinks'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

describe('FooterLinks', () => {
  const mockLinks = [
    { href: '/games', label: 'All Games' },
    { href: '/categories', label: 'Categories' },
    { href: '/deals', label: 'Deals' },
  ]

  it('renders with correct title', () => {
    render(<FooterLinks title="Test Links" links={mockLinks} />)
    
    const title = screen.getByText('Test Links')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold', 'mb-4', 'text-white')
  })

  it('renders all provided links', () => {
    render(<FooterLinks title="Test Links" links={mockLinks} />)
    
    mockLinks.forEach((link) => {
      const linkElement = screen.getByText(link.label)
      expect(linkElement).toBeInTheDocument()
      expect(linkElement).toHaveAttribute('href', link.href)
    })
  })

  it('applies correct styles to links', () => {
    render(<FooterLinks title="Test Links" links={mockLinks} />)
    
    const firstLink = screen.getByText('All Games')
    expect(firstLink).toHaveClass('text-gray-400', 'hover:text-white', 'transition-colors', 'duration-200', 'text-sm', 'block', 'py-1')
  })

  it('renders links in a list structure', () => {
    render(<FooterLinks title="Test Links" links={mockLinks} />)
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    expect(list).toHaveClass('space-y-3')
    
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(mockLinks.length)
  })

  it('handles empty links array', () => {
    render(<FooterLinks title="Empty Links" links={[]} />)
    
    const title = screen.getByText('Empty Links')
    expect(title).toBeInTheDocument()
    
    const listItems = screen.queryAllByRole('listitem')
    expect(listItems).toHaveLength(0)
  })

  it('handles single link', () => {
    const singleLink = [{ href: '/single', label: 'Single Link' }]
    render(<FooterLinks title="Single Link" links={singleLink} />)
    
    // Check that both title and link exist
    expect(screen.getAllByText('Single Link')).toHaveLength(2) // Title and link
    const link = screen.getByRole('link', { name: 'Single Link' })
    expect(link).toHaveAttribute('href', '/single')
  })
})
