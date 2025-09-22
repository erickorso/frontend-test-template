import { useState, useEffect } from 'react'
import { cartService } from '../services/cartService'
import { CartItem } from '../services/cartService'

interface CartSummary {
  totalItems: number
  totalPrice: number
}

interface UseCartReturn {
  cartItems: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  error: string | null
  addToCart: (game: any) => void
  removeFromCart: (gameId: string) => void
  updateCartItemQuantity: (gameId: string, quantity: number) => void
  refreshCart: () => Promise<void>
}

export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCart = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // In test environment, load immediately
      if (process.env.NODE_ENV === 'test') {
        const items = cartService.getCartItems()
        const summary = cartService.getCartSummary()
        setCartItems(items)
        setTotalItems(summary.totalItems)
        setTotalPrice(summary.totalPrice)
        setIsLoading(false)
        return
      }
      
      // In production, add delay for skeleton loading
      const [items, summary] = await Promise.all([
        new Promise<CartItem[]>(resolve => {
          setTimeout(() => {
            resolve(cartService.getCartItems())
          }, 1000)
        }),
        new Promise<CartSummary>(resolve => {
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

  const addToCart = (game: any) => {
    try {
      cartService.addToCart(game)
      refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = (gameId: string) => {
    try {
      cartService.removeFromCart(gameId)
      refreshCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateCartItemQuantity = (gameId: string, quantity: number) => {
    try {
      cartService.updateCartItemQuantity(gameId, quantity)
      refreshCart()
    } catch (error) {
      console.error('Error updating cart item quantity:', error)
    }
  }

  const refreshCart = async () => {
    try {
      const items = cartService.getCartItems()
      const summary = cartService.getCartSummary()
      
      setCartItems(items)
      setTotalItems(summary.totalItems)
      setTotalPrice(summary.totalPrice)
    } catch (error) {
      console.error('Error refreshing cart:', error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  return {
    cartItems,
    totalItems,
    totalPrice,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    refreshCart
  }
}