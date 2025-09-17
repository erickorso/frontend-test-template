import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, CartSummary } from '../../services/cartService'

interface CartState {
  items: CartItem[]
  summary: CartSummary
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  summary: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  },
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Sync actions
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      state.summary = {
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    },
    
    setCartSummary: (state, action: PayloadAction<CartSummary>) => {
      state.summary = action.payload
    },
    
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    clearCartError: (state) => {
      state.error = null
    },
  },
})

export const {
  setCartItems,
  setCartSummary,
  setCartLoading,
  setCartError,
  clearCartError,
} = cartSlice.actions

export default cartSlice.reducer
