import { all, fork } from 'redux-saga/effects'
import { watchGamesSagas } from './gamesSagas'
import { watchCartSagas } from './cartSagas'

export function* rootSaga() {
  yield all([
    fork(watchGamesSagas),
    fork(watchCartSagas),
  ])
}
