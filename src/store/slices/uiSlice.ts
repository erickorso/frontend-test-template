import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isCartOpen: boolean
  isMobileMenuOpen: boolean
  notifications: Notification[]
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

const initialState: UIState = {
  isCartOpen: false,
  isMobileMenuOpen: false,
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload
    },
    
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload
    },
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 5000,
      }
      state.notifications.push(notification)
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  toggleCart,
  setCartOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer
