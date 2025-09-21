import React from 'react'
import { render, screen } from '@testing-library/react'
import SocialLinks from '../src/components/Footer/SocialLinks'

describe('SocialLinks', () => {
  it('renders follow us title', () => {
    render(<SocialLinks />)
    
    const title = screen.getByText('Follow Us')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-sm', 'font-semibold', 'text-white', 'mb-3')
  })

  it('renders all social media links', () => {
    render(<SocialLinks />)
    
    const socialLinks = [
      { name: 'Facebook', href: 'https://facebook.com' },
      { name: 'Twitter', href: 'https://twitter.com' },
      { name: 'Instagram', href: 'https://instagram.com' },
      { name: 'YouTube', href: 'https://youtube.com' },
    ]

    socialLinks.forEach((social) => {
      const link = screen.getByLabelText(`Follow us on ${social.name}`)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', social.href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('applies correct styles to social links', () => {
    render(<SocialLinks />)
    
    const facebookLink = screen.getByLabelText('Follow us on Facebook')
    expect(facebookLink).toHaveClass(
      'text-gray-400',
      'hover:text-white',
      'transition-colors',
      'duration-200',
      'p-2',
      'hover:bg-gray-800',
      'rounded-lg'
    )
  })

  it('renders social icons', () => {
    const { container } = render(<SocialLinks />)
    
    const svgElements = container.querySelectorAll('svg')
    expect(svgElements.length).toBe(4)
  })

  it('has correct container structure', () => {
    render(<SocialLinks />)
    
    const container = screen.getByText('Follow Us').parentElement?.querySelector('.flex')
    expect(container).toHaveClass('flex', 'space-x-4')
  })

  it('renders exactly 4 social links', () => {
    render(<SocialLinks />)
    
    const socialLinks = screen.getAllByRole('link')
    expect(socialLinks).toHaveLength(4)
  })
})
