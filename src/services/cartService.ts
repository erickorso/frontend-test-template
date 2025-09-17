import { Game } from '@/utils/endpoint'

export interface CartItem extends Game {
  quantity: number
}

export interface CartSummary {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

class CartService {
  private readonly CART_KEY = 'game-cart'

  /**
   * Gets all items from the cart
   */
  getCartItems(): CartItem[] {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const cartData = localStorage.getItem(this.CART_KEY)
      return cartData ? JSON.parse(cartData) : []
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
      return []
    }
  }

  /**
   * Adds a game to the cart
   */
  addToCart(game: Game): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const cartItems = this.getCartItems()
      const existingItem = cartItems.find(item => item.id === game.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cartItems.push({ ...game, quantity: 1 })
      }

      localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }
  }

  /**
   * Removes a game from the cart
   */
  removeFromCart(gameId: string): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const cartItems = this.getCartItems()
      const filteredItems = cartItems.filter(item => item.id !== gameId)
      localStorage.setItem(this.CART_KEY, JSON.stringify(filteredItems))
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  /**
   * Updates the quantity of a cart item
   */
  updateQuantity(gameId: string, quantity: number): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const cartItems = this.getCartItems()
      const itemIndex = cartItems.findIndex(item => item.id === gameId)

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          cartItems.splice(itemIndex, 1)
        } else {
          cartItems[itemIndex].quantity = quantity
        }
        localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems))
      }
    } catch (error) {
      console.error('Error updating item quantity:', error)
    }
  }

  /**
   * Checks if a game is in the cart
   */
  isInCart(gameId: string): boolean {
    const cartItems = this.getCartItems()
    return cartItems.some(item => item.id === gameId)
  }

  /**
   * Gets cart summary with totals
   */
  getCartSummary(): CartSummary {
    const cartItems = this.getCartItems()
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return {
      items: cartItems,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100 // Round to 2 decimal places
    }
  }

  /**
   * Clears the entire cart
   */
  clearCart(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(this.CART_KEY)
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  /**
   * Gets the number of items in the cart
   */
  getCartItemsCount(): number {
    return this.getCartSummary().totalItems
  }
}

export const cartService = new CartService()
