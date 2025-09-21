// Simplified sagas index for Vercel compatibility
import { watchGamesSagas } from './gamesSagas'
import { watchCartSagas } from './cartSagas'

// Root saga - simplified for compatibility
export function* rootSaga() {
  yield watchGamesSagas()
  yield watchCartSagas()
}