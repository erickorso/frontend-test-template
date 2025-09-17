import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import cartReducer from './slices/cartSlice'
import gamesReducer from './slices/gamesSlice'
import uiReducer from './slices/uiSlice'
import { watchCartSagas } from './sagas/cartSagas'
import { watchGamesSagas } from './sagas/gamesSagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    games: gamesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
})

// Root saga
function* rootSaga() {
  yield all([
    watchCartSagas(),
    watchGamesSagas(),
  ])
}

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
