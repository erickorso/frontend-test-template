import { call, put, takeEvery, select } from 'redux-saga/effects'
import { cartService } from '../../services/cartService'
import { Game } from '../../utils/endpoint'
import {
  setCartItems,
  setCartSummary,
  setCartLoading,
  setCartError,
} from '../slices/cartSlice'
import { addNotification } from '../slices/uiSlice'

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

// Sagas
function* loadCartSaga() {
  try {
    yield put(setCartLoading(true))
    yield put(setCartError(null))
    
    const cartItems = yield call(cartService.getCartItems)
    const cartSummary = yield call(cartService.getCartSummary)
    
    yield put(setCartItems(cartItems))
    yield put(setCartSummary(cartSummary))
  } catch (error) {
    yield put(setCartError(error instanceof Error ? error.message : 'Failed to load cart'))
  } finally {
    yield put(setCartLoading(false))
  }
}

function* addToCartSaga(action: { type: string; payload: Game }) {
  try {
    yield put(setCartLoading(true))
    yield put(setCartError(null))
    
    yield call(cartService.addToCart, action.payload)
    
    const cartItems = yield call(cartService.getCartItems)
    const cartSummary = yield call(cartService.getCartSummary)
    
    yield put(setCartItems(cartItems))
    yield put(setCartSummary(cartSummary))
    
    yield put(addNotification({
      type: 'success',
      message: `${action.payload.name} added to cart`,
    }))
  } catch (error) {
    yield put(setCartError(error instanceof Error ? error.message : 'Failed to add item to cart'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to add item to cart',
    }))
  } finally {
    yield put(setCartLoading(false))
  }
}

function* removeFromCartSaga(action: { type: string; payload: string }) {
  try {
    yield put(setCartLoading(true))
    yield put(setCartError(null))
    
    yield call(cartService.removeFromCart, action.payload)
    
    const cartItems = yield call(cartService.getCartItems)
    const cartSummary = yield call(cartService.getCartSummary)
    
    yield put(setCartItems(cartItems))
    yield put(setCartSummary(cartSummary))
    
    yield put(addNotification({
      type: 'info',
      message: 'Item removed from cart',
    }))
  } catch (error) {
    yield put(setCartError(error instanceof Error ? error.message : 'Failed to remove item from cart'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to remove item from cart',
    }))
  } finally {
    yield put(setCartLoading(false))
  }
}

function* updateQuantitySaga(action: { type: string; payload: { gameId: string; quantity: number } }) {
  try {
    yield put(setCartLoading(true))
    yield put(setCartError(null))
    
    yield call(cartService.updateQuantity, action.payload.gameId, action.payload.quantity)
    
    const cartItems = yield call(cartService.getCartItems)
    const cartSummary = yield call(cartService.getCartSummary)
    
    yield put(setCartItems(cartItems))
    yield put(setCartSummary(cartSummary))
  } catch (error) {
    yield put(setCartError(error instanceof Error ? error.message : 'Failed to update quantity'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to update quantity',
    }))
  } finally {
    yield put(setCartLoading(false))
  }
}

function* clearCartSaga() {
  try {
    yield put(setCartLoading(true))
    yield put(setCartError(null))
    
    yield call(cartService.clearCart)
    
    yield put(setCartItems([]))
    yield put(setCartSummary({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    }))
    
    yield put(addNotification({
      type: 'info',
      message: 'Cart cleared',
    }))
  } catch (error) {
    yield put(setCartError(error instanceof Error ? error.message : 'Failed to clear cart'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to clear cart',
    }))
  } finally {
    yield put(setCartLoading(false))
  }
}

// Watcher saga
export function* watchCartSagas() {
  yield takeEvery(CART_ACTIONS.LOAD_CART, loadCartSaga)
  yield takeEvery(CART_ACTIONS.ADD_TO_CART, addToCartSaga)
  yield takeEvery(CART_ACTIONS.REMOVE_FROM_CART, removeFromCartSaga)
  yield takeEvery(CART_ACTIONS.UPDATE_QUANTITY, updateQuantitySaga)
  yield takeEvery(CART_ACTIONS.CLEAR_CART, clearCartSaga)
}
