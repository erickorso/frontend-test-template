import React from 'react'

// Mock setTimeout to run immediately in tests
jest.useFakeTimers()

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    input: ({ children, ...props }: any) => React.createElement('input', props, children),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
}))

// Mock PageTransition component
jest.mock('../src/components/PageTransition', () => ({
  PageTransition: ({ children }: any) => React.createElement(React.Fragment, null, children),
}))

// Mock Skeleton components
jest.mock('../src/components/Skeleton', () => ({
  GameCardSkeleton: () => React.createElement('div', { 'data-testid': 'game-card-skeleton' }, 'Loading...'),
  CartItemSkeleton: () => React.createElement('div', { 'data-testid': 'cart-item-skeleton' }, 'Loading...'),
  OrderSummarySkeleton: () => React.createElement('div', { 'data-testid': 'order-summary-skeleton' }, 'Loading...'),
}))

// Add a dummy test to prevent "no tests" error
describe('Setup', () => {
  it('should run setup without errors', () => {
    expect(true).toBe(true)
  })
})
