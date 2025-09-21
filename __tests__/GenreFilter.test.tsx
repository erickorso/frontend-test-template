import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import GenreFilter from '../src/components/GenreFilter/GenreFilter'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockPush = jest.fn()
const mockSearchParams = new URLSearchParams()

describe('GenreFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
  })

  it('renders genre filter with all options', () => {
    render(<GenreFilter />)
    
    expect(screen.getByLabelText('Filter games by genre')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('RPG')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
  })

  it('shows current genre selection', () => {
    mockSearchParams.set('genre', 'Action')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    render(<GenreFilter />)
    
    const select = screen.getByLabelText('Filter games by genre') as HTMLSelectElement
    expect(select.value).toBe('Action')
  })

  it('handles genre change and navigates to catalog', () => {
    render(<GenreFilter />)
    
    const select = screen.getByLabelText('Filter games by genre') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'RPG' } })
    
    expect(mockPush).toHaveBeenCalledWith('/catalog?genre=RPG')
  })

  it('handles "All" selection and removes genre parameter', () => {
    mockSearchParams.set('genre', 'Action')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    render(<GenreFilter />)
    
    const select = screen.getByLabelText('Filter games by genre') as HTMLSelectElement
    fireEvent.change(select, { target: { value: '' } })
    
    expect(mockPush).toHaveBeenCalledWith('/catalog')
  })

  it('resets page parameter when changing genre', () => {
    mockSearchParams.set('page', '2')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    render(<GenreFilter />)
    
    const select = screen.getByLabelText('Filter games by genre') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'Adventure' } })
    
    expect(mockPush).toHaveBeenCalledWith('/catalog?genre=Adventure')
  })

  it('preserves other parameters when changing genre', () => {
    mockSearchParams.set('search', 'zelda')
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    render(<GenreFilter />)
    
    const select = screen.getByLabelText('Filter games by genre') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'Adventure' } })
    
    // Check that the URL contains both parameters (order may vary)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('search=zelda'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('genre=Adventure'))
  })

  it('has correct styling classes', () => {
    render(<GenreFilter />)
    
    const select = screen.getByLabelText('Filter games by genre')
    expect(select).toHaveClass(
      'block',
      'px-3',
      'py-2',
      'bg-transparent',
      'focus:outline-none',
      'sm:text-sm',
      'text-gray-700',
      'hover:text-blue-600',
      'transition-colors',
      'duration-200'
    )
  })

  it('has correct label styling', () => {
    render(<GenreFilter />)
    
    const label = screen.getByText('Genre:')
    expect(label).toHaveClass('text-sm', 'text-gray-600')
  })

  it('renders separator between label and select', () => {
    render(<GenreFilter />)
    
    const separator = screen.getByText('|')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveClass('text-gray-300')
  })
})
