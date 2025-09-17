import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  setCartLoading, 
  setCartError, 
  setCartItems,
  setCartSummary 
} from '../store/slices/cartSlice'
import { addNotification } from '../store/slices/uiSlice'
import { cartService } from '../services/cartService'
import { Game } from '../utils/endpoint'

export const useCartActions = () => {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.cart)

  // Side effect: Cargar carrito
  const loadCart = useCallback(async () => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      const cartItems = await cartService.getCartItems()
      const cartSummary = await cartService.getCartSummary()
      
      dispatch(setCartItems(cartItems))
      dispatch(setCartSummary(cartSummary))
      
      dispatch(addNotification({
        type: 'success',
        message: 'Cart loaded successfully!',
        duration: 3000
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cart'
      dispatch(setCartError(errorMessage))
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }, [dispatch])

  // Side effect: Agregar al carrito
  const addToCart = useCallback(async (game: Game) => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      await cartService.addToCart(game)
      const cartItems = await cartService.getCartItems()
      const cartSummary = await cartService.getCartSummary()
      
      dispatch(setCartItems(cartItems))
      dispatch(setCartSummary(cartSummary))
      
      dispatch(addNotification({
        type: 'success',
        message: `${game.name} added to cart!`,
        duration: 3000
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart'
      dispatch(setCartError(errorMessage))
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }, [dispatch])

  // Side effect: Remover del carrito
  const removeFromCart = useCallback(async (gameId: string) => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      await cartService.removeFromCart(gameId)
      const cartItems = await cartService.getCartItems()
      const cartSummary = await cartService.getCartSummary()
      
      dispatch(setCartItems(cartItems))
      dispatch(setCartSummary(cartSummary))
      
      dispatch(addNotification({
        type: 'info',
        message: 'Item removed from cart',
        duration: 3000
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from cart'
      dispatch(setCartError(errorMessage))
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }, [dispatch])

  // Side effect: Actualizar cantidad
  const updateQuantity = useCallback(async (gameId: string, quantity: number) => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      await cartService.updateQuantity(gameId, quantity)
      const cartItems = await cartService.getCartItems()
      const cartSummary = await cartService.getCartSummary()
      
      dispatch(setCartItems(cartItems))
      dispatch(setCartSummary(cartSummary))
      
      dispatch(addNotification({
        type: 'info',
        message: 'Quantity updated',
        duration: 2000
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quantity'
      dispatch(setCartError(errorMessage))
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }, [dispatch])

  // Side effect: Limpiar carrito
  const clearCart = useCallback(async () => {
    try {
      dispatch(setCartLoading(true))
      dispatch(setCartError(null))
      
      await cartService.clearCart()
      dispatch(setCartItems([]))
      dispatch(setCartSummary({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }))
      
      dispatch(addNotification({
        type: 'info',
        message: 'Cart cleared',
        duration: 3000
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart'
      dispatch(setCartError(errorMessage))
      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      }))
    } finally {
      dispatch(setCartLoading(false))
    }
  }, [dispatch])

  return {
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
    error,
  }
}
