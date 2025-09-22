'use client'

import React, { memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '../../components/Container'
import { CartItemSkeleton, OrderSummarySkeleton } from '../../components/Skeleton'
import { PageTransition } from '../../components/PageTransition'
import { useCart } from '../../hooks'

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = memo(() => {
  const { cartItems, totalItems, totalPrice, isLoading, error, removeFromCart, updateCartItemQuantity } = useCart()

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'game-cart') {
        // Refresh cart when storage changes
        window.location.reload()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleRemoveItem = (gameId: string) => {
    try {
      removeFromCart(gameId)
    } catch (err) {
      console.error('Error removing item from cart:', err)
    }
  }

  const handleQuantityChange = (gameId: string, quantity: number) => {
    try {
      updateCartItemQuantity(gameId, quantity)
    } catch (err) {
      console.error('Error updating item quantity:', err)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12">
              {/* Cart Items Skeleton - Left Column */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <CartItemSkeleton key={item} />
                  ))}
                </div>
              </div>

              {/* Order Summary Skeleton - Right Column */}
              <div className="lg:col-span-1">
                <OrderSummarySkeleton />
              </div>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
              <p className="text-gray-500 text-lg mb-8">Your cart is empty.</p>
              <Link
                href="/catalog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12">
              {/* Cart Items - Left Column */}
              <div className="lg:col-span-2">
                <div className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 relative"
                      >
                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>

                        <div className="flex items-start space-x-4 pr-8">
                          {/* Game Image */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              {item.isNew && (
                                <span className="absolute top-1 left-1 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded border border-gray-200">
                                  New
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Game Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{item.name}</h3>
                              <span className="text-xl font-bold text-gray-900 flex-shrink-0">${item.price.toFixed(2)}</span>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-2">Genre: {item.genre}</p>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-700">
                                Quantity:
                              </label>
                              <motion.input
                                whileFocus={{ scale: 1.05 }}
                                type="number"
                                id={`quantity-${item.id}`}
                                min="1"
                                max="99"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                aria-label={`Quantity for ${item.name}`}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Summary - Right Column */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                  </div>
                  
                  <div className="p-6">
                    {/* Items List */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Items ({totalItems})</span>
                        <span className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Checkout
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageTransition>
  )
})

CartPage.displayName = 'CartPage'

export default CartPage