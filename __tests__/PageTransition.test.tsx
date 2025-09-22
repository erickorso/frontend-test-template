import React from 'react'
import { render, screen } from '@testing-library/react'
import PageTransition from '../src/components/PageTransition/PageTransition'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="page-transition" {...props}>
        {children}
      </div>
    ),
  },
}))

describe('PageTransition', () => {
  it('renders children correctly', () => {
    render(
      <PageTransition>
        <div data-testid="test-content">Test Content</div>
      </PageTransition>
    )

    expect(screen.getByTestId('page-transition')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <PageTransition className="custom-class">
        <div>Test Content</div>
      </PageTransition>
    )

    expect(screen.getByTestId('page-transition')).toHaveClass('custom-class')
  })

  it('renders without className prop', () => {
    render(
      <PageTransition>
        <div>Test Content</div>
      </PageTransition>
    )

    expect(screen.getByTestId('page-transition')).toBeInTheDocument()
  })

  it('renders multiple children', () => {
    render(
      <PageTransition>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </PageTransition>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })
})
