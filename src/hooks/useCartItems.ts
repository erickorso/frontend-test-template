import { useState, useEffect } from 'react'
import { cartService } from '../services/cartService'

interface UseCartItemsReturn {
  cartItems: string[]
  isInCart: (gameId: string) => boolean
  addToCart: (game: any) => void
  removeFromCart: (gameId: string) => void
}

export const useCartItems = (): UseCartItemsReturn => {
  const [cartItems, setCartItems] = useState<string[]>([])

  // Load cart items on component mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const items = cartService.getCartItems()
        setCartItems(items.map(item => item.id))
      } catch (error) {
        console.error('Error loading cart items:', error)
      }
    }
    loadCartItems()
  }, [])

  const isInCart = (gameId: string) => cartItems.includes(gameId)

  const addToCart = (game: any) => {
    try {
      cartService.addToCart(game)
      setCartItems(prev => [...prev, game.id])
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = (gameId: string) => {
    try {
      cartService.removeFromCart(gameId)
      setCartItems(prev => prev.filter(id => id !== gameId))
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  return {
    cartItems,
    isInCart,
    addToCart,
    removeFromCart
  }
}
