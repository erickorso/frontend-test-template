import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import gamesReducer from './slices/gamesSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    games: gamesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'cart/loadCart',
          'cart/addToCart',
          'cart/removeFromCart',
          'cart/updateQuantity',
          'cart/clearCart',
          'games/loadGames',
          'games/loadGamesWithFilters',
          'games/searchGames',
          'games/loadAvailableFilters',
          'games/setGenreFilter',
          'games/setSearchQuery',
          'games/loadMoreGames',
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
