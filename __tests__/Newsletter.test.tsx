import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Newsletter from '../src/components/Footer/Newsletter'

describe('Newsletter', () => {
  it('renders newsletter title and description', () => {
    render(<Newsletter />)
    
    const title = screen.getByText('Stay Updated')
    const description = screen.getByText(/Get the latest news about new games/)
    
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it('renders email input and subscribe button', () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByText('Subscribe')
    
    expect(emailInput).toBeInTheDocument()
    expect(subscribeButton).toBeInTheDocument()
  })

  it('updates email input value', () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(emailInput.value).toBe('test@example.com')
  })

  it('disables subscribe button when email is empty', () => {
    render(<Newsletter />)
    
    const subscribeButton = screen.getByText('Subscribe')
    expect(subscribeButton).toBeDisabled()
  })

  it('enables subscribe button when email is provided', () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByText('Subscribe')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(subscribeButton).not.toBeDisabled()
  })

  it('shows loading state when submitting', async () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByText('Subscribe')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50')
    })
  })

  it('shows success message after subscription', async () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const subscribeButton = screen.getByText('Subscribe')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Thanks for subscribing/)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('shows success message after subscription', async () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement
    const subscribeButton = screen.getByText('Subscribe')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)
    
    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText(/Thanks for subscribing/)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('renders privacy notice', () => {
    render(<Newsletter />)
    
    const privacyNotice = screen.getByText(/We respect your privacy/)
    expect(privacyNotice).toBeInTheDocument()
  })

  it('has correct input styles', () => {
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    expect(emailInput).toHaveClass(
      'flex-1',
      'px-4',
      'py-2',
      'bg-gray-800',
      'border',
      'border-gray-700',
      'rounded-l-lg',
      'text-white',
      'placeholder-gray-400'
    )
  })

  it('has correct button styles', () => {
    render(<Newsletter />)
    
    const subscribeButton = screen.getByText('Subscribe')
    expect(subscribeButton).toHaveClass(
      'px-6',
      'py-2',
      'bg-blue-600',
      'text-white',
      'rounded-r-lg',
      'hover:bg-blue-700'
    )
  })
})
