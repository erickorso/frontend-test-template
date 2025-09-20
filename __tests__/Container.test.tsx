import React from 'react'
import { render, screen } from '@testing-library/react'
import { Container } from '../src/components/Container'

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="test-content">Test Content</div>
      </Container>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toHaveTextContent('Test Content')
  })

  it('applies default classes correctly', () => {
    const { container } = render(
      <Container>
        <div>Test</div>
      </Container>
    )
    
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('w-full', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'max-w-[1280px]')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Test</div>
      </Container>
    )
    
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('custom-class')
  })

  it('applies fluid prop correctly', () => {
    const { container } = render(
      <Container fluid>
        <div>Test</div>
      </Container>
    )
    
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('w-full', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
    expect(containerDiv).not.toHaveClass('max-w-[1280px]')
  })

  it('combines default and custom classes correctly', () => {
    const { container } = render(
      <Container className="py-4 text-center">
        <div>Test</div>
      </Container>
    )
    
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass(
      'w-full', 
      'mx-auto', 
      'px-4', 
      'sm:px-6', 
      'lg:px-8', 
      'max-w-[1280px]',
      'py-4',
      'text-center'
    )
  })

  it('handles fluid with custom className', () => {
    const { container } = render(
      <Container fluid className="bg-gray-100">
        <div>Test</div>
      </Container>
    )
    
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('w-full', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gray-100')
    expect(containerDiv).not.toHaveClass('max-w-[1280px]')
  })

  it('renders with multiple children', () => {
    render(
      <Container>
        <h1>Title</h1>
        <p>Description</p>
        <button>Click me</button>
      </Container>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
