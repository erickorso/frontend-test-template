'use client'

import React, { memo, useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '../../components/Container'
import { CartItem } from '../../services/cartService'
import { cartService } from '../../services/cartService'

const CartPage: React.FC = memo(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const items = cartService.getCartItems()
        setCartItems(items)
      } catch (error) {
        console.error('Error loading cart items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCartItems()
  }, [])

  const handleRemoveItem = (gameId: string) => {
    try {
      cartService.removeFromCart(gameId)
      const updatedItems = cartService.getCartItems()
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  const cartSummary = cartService.getCartSummary()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-12">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some games to get started!</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200"
              >
                Back to Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart Items</h2>
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                          {/* Game Image */}
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Game Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Genre: {item.genre}</span>
                                  <span>Qty: {item.quantity}</span>
                                  {item.isNew && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Price and Remove Button */}
                              <div className="flex flex-col items-end space-y-2">
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900">
                                    ${item.price.toFixed(2)}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-sm text-gray-500">
                                      ${(item.price * item.quantity).toFixed(2)} total
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                                  aria-label={`Remove ${item.name} from cart`}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartSummary.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-900">{cartSummary.totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                      <span>Total:</span>
                      <span>${cartSummary.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200">
                      Proceed to Checkout
                    </button>
                    <Link
                      href="/"
                      className="block w-full text-center bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                    >
                      Back to Catalog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
})

CartPage.displayName = 'CartPage'

export default CartPage
