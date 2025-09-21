'use client'

import React, { memo, useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '../../components/Container'
import { CartItemSkeleton, OrderSummarySkeleton } from '../../components/Skeleton'
import { CartItem } from '../../services/cartService'
import { cartService } from '../../services/cartService'
import { Game } from '../../utils/endpoint'

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = memo(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true)
        
        // Add minimum delay to show skeleton
        const [items, summary] = await Promise.all([
          new Promise<CartItem[]>(resolve => {
            setTimeout(() => {
              resolve(cartService.getCartItems())
            }, 1000)
          }),
          new Promise<{totalItems: number, totalPrice: number}>(resolve => {
            setTimeout(() => {
              resolve(cartService.getCartSummary())
            }, 1000)
          })
        ])
        
        setCartItems(items)
        setTotalItems(summary.totalItems)
        setTotalPrice(summary.totalPrice)
      } catch (err) {
        setError('Error loading cart items.')
        console.error('Error loading cart items:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'game-cart') {
        loadCart()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleRemoveItem = (gameId: string) => {
    try {
      cartService.removeFromCart(gameId)
      const updatedItems = cartService.getCartItems()
      const updatedSummary = cartService.getCartSummary()
      setCartItems(updatedItems)
      setTotalItems(updatedSummary.totalItems)
      setTotalPrice(updatedSummary.totalPrice)
    } catch (err) {
      setError('Error removing item from cart.')
      console.error('Error removing item from cart:', err)
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
                <div className="divide-y divide-gray-200">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CartItemSkeleton key={index} />
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
        <Container className="py-8 text-center">
          <p className="text-lg text-red-600">{error}</p>
          <Link href="/catalog" className="mt-4 inline-flex items-center bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 uppercase" style={{ height: '56px', padding: '0 24px' }}>
            Back to Catalog
          </Link>
        </Container>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some games to get started!</p>
            <Link
              href="/catalog"
              className="inline-flex items-center bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 uppercase"
              style={{ height: '56px', padding: '0 24px' }}
            >
              Back to Catalog
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
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
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="p-6 relative animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Remove Button - Top Right Corner */}
                    <button
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <div className="flex items-start space-x-4 pr-8">
                      {/* Game Image */}
                      <div className="flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        {(item as Game).isNew && (
                          <span className="absolute top-1 left-1 bg-white text-gray-800 text-xs font-bold px-1 py-0.5 rounded border border-gray-200">
                            New
                          </span>
                        )}
                      </div>

                      {/* Game Details */}
                      <div className="flex-1 min-w-0">
                        {/* Product Name and Price on same line */}
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">{item.name}</h3>
                          <p className="text-xl font-bold text-gray-900 flex-shrink-0">${item.price.toFixed(2)}</p>
                        </div>
                        
                        {/* Genre */}
                        <p className="text-sm text-gray-500 uppercase mb-2">Genre: {item.genre}</p>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8 animate-slideIn">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="font-medium text-gray-900 text-sm leading-tight">{item.name}</p>
                          <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-900">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="w-full bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200 uppercase" style={{ height: '56px', padding: '0 16px' }}>
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
})

CartPage.displayName = 'CartPage'

export default CartPage