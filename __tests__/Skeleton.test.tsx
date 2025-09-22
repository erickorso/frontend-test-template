import React from 'react'
import { render, screen } from '@testing-library/react'
import GameCardSkeleton from '../src/components/Skeleton/GameCardSkeleton'
import CartItemSkeleton from '../src/components/Skeleton/CartItemSkeleton'
import OrderSummarySkeleton from '../src/components/Skeleton/OrderSummarySkeleton'

describe('Skeleton Components', () => {
  describe('GameCardSkeleton', () => {
    it('renders skeleton elements correctly', () => {
      const { container } = render(<GameCardSkeleton />)

      // Check main container
      expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm', 'animate-pulse')

      // Check for skeleton elements (they don't have specific testids, so we check by class)
      const skeletonElements = container.querySelectorAll('.bg-gray-300')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('has correct structure for game card skeleton', () => {
      const { container } = render(<GameCardSkeleton />)

      // Check that the skeleton has the expected structure
      expect(container.firstChild).toBeInTheDocument()
      
      // Check for image skeleton (h-60 class)
      const imageSkeleton = container.querySelector('.h-60')
      expect(imageSkeleton).toBeInTheDocument()
    })
  })

  describe('CartItemSkeleton', () => {
    it('renders skeleton elements correctly', () => {
      const { container } = render(<CartItemSkeleton />)

      // Check main container
      expect(container.firstChild).toHaveClass('p-6', 'animate-pulse')

      // Check for skeleton elements
      const skeletonElements = container.querySelectorAll('.bg-gray-300')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('has correct structure for cart item skeleton', () => {
      const { container } = render(<CartItemSkeleton />)

      expect(container.firstChild).toBeInTheDocument()
      
      // Check for image skeleton (w-24 h-24)
      const imageSkeleton = container.querySelector('.w-24.h-24')
      expect(imageSkeleton).toBeInTheDocument()
    })
  })

  describe('OrderSummarySkeleton', () => {
    it('renders skeleton elements correctly', () => {
      const { container } = render(<OrderSummarySkeleton />)

      // Check main container
      expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm', 'animate-pulse')

      // Check for skeleton elements
      const skeletonElements = container.querySelectorAll('.bg-gray-300')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('has correct structure for order summary skeleton', () => {
      const { container } = render(<OrderSummarySkeleton />)

      expect(container.firstChild).toBeInTheDocument()
      
      // Check for header skeleton
      const headerSkeleton = container.querySelector('.px-6.py-4')
      expect(headerSkeleton).toBeInTheDocument()
    })

    it('renders multiple item skeletons', () => {
      const { container } = render(<OrderSummarySkeleton />)

      // Check that it renders 3 item skeletons (as defined in the component)
      const itemSkeletons = container.querySelectorAll('.space-y-4 .flex.justify-between')
      expect(itemSkeletons).toHaveLength(3)
    })
  })
})
