// Simplified cart sagas for Vercel compatibility
import { Game } from '../../utils/endpoint'

// Action types
export const CART_ACTIONS = {
  LOAD_CART: 'cart/loadCart',
  ADD_TO_CART: 'cart/addToCart',
  REMOVE_FROM_CART: 'cart/removeFromCart',
  UPDATE_QUANTITY: 'cart/updateQuantity',
  CLEAR_CART: 'cart/clearCart',
  CHECK_ITEM_IN_CART: 'cart/checkItemInCart',
} as const

// Action creators
export const loadCart = () => ({ type: CART_ACTIONS.LOAD_CART })
export const addToCart = (game: Game) => ({ type: CART_ACTIONS.ADD_TO_CART, payload: game })
export const removeFromCart = (gameId: string) => ({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: gameId })
export const updateQuantity = (gameId: string, quantity: number) => ({ 
  type: CART_ACTIONS.UPDATE_QUANTITY, 
  payload: { gameId, quantity } 
})
export const clearCart = () => ({ type: CART_ACTIONS.CLEAR_CART })
export const checkItemInCart = (gameId: string) => ({ type: CART_ACTIONS.CHECK_ITEM_IN_CART, payload: gameId })

// Simplified saga watcher for Vercel compatibility
export function* watchCartSagas() {
  // Simplified saga watcher - will be implemented when needed
  yield
}