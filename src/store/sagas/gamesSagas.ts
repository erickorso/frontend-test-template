import { call, put, takeEvery, select } from 'redux-saga/effects'
import { gamesService } from '../../services/gamesService'
import {
  setGames,
  setSelectedGenre,
  setGamesLoading,
  setGamesError,
} from '../slices/gamesSlice'
import { addNotification } from '../slices/uiSlice'

// Action types
export const GAMES_ACTIONS = {
  LOAD_GAMES: 'games/loadGames',
  LOAD_GAMES_WITH_FILTERS: 'games/loadGamesWithFilters',
  SEARCH_GAMES: 'games/searchGames',
  LOAD_AVAILABLE_FILTERS: 'games/loadAvailableFilters',
  SET_GENRE_FILTER: 'games/setGenreFilter',
  SET_SEARCH_QUERY: 'games/setSearchQuery',
  LOAD_MORE_GAMES: 'games/loadMoreGames',
} as const

// Action creators
export const loadGames = () => ({ type: GAMES_ACTIONS.LOAD_GAMES })
export const loadGamesWithFilters = (filters: { genre?: string; page?: number }) => ({ 
  type: GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS, 
  payload: filters 
})
export const searchGames = (query: string) => ({ type: GAMES_ACTIONS.SEARCH_GAMES, payload: query })
export const loadAvailableFilters = () => ({ type: GAMES_ACTIONS.LOAD_AVAILABLE_FILTERS })
export const setGenreFilter = (genre: string | null) => ({ type: GAMES_ACTIONS.SET_GENRE_FILTER, payload: genre })
export const setSearchQuery = (query: string) => ({ type: GAMES_ACTIONS.SET_SEARCH_QUERY, payload: query })
export const loadMoreGames = () => ({ type: GAMES_ACTIONS.LOAD_MORE_GAMES })

// Sagas
function* loadGamesSaga() {
  try {
    yield put(setGamesLoading(true))
    yield put(setGamesError(null))
    
    const gamesResponse = yield call(gamesService.getGames)
    
    yield put(setGames(gamesResponse))
  } catch (error) {
    yield put(setGamesError(error instanceof Error ? error.message : 'Failed to load games'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to load games',
    }))
  } finally {
    yield put(setGamesLoading(false))
  }
}

function* loadGamesWithFiltersSaga(action: { type: string; payload: { genre?: string; page?: number } }) {
  try {
    yield put(setGamesLoading(true))
    yield put(setGamesError(null))
    
    const gamesResponse = yield call(gamesService.getGames, action.payload)
    
    yield put(setGames(gamesResponse))
    
    if (action.payload.genre) {
      yield put(setSelectedGenre(action.payload.genre))
    }
  } catch (error) {
    yield put(setGamesError(error instanceof Error ? error.message : 'Failed to load games with filters'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to load games with filters',
    }))
  } finally {
    yield put(setGamesLoading(false))
  }
}

function* searchGamesSaga(action: { type: string; payload: string }) {
  try {
    yield put(setGamesLoading(true))
    yield put(setGamesError(null))
    
    const state = yield select()
    const filters = {
      genre: state.games.selectedGenre,
      page: state.games.currentPage,
    }
    
    const gamesResponse = yield call(gamesService.searchGames, action.payload, filters)
    
    yield put(setGames(gamesResponse))
    // Search query is handled by the saga, no need to dispatch
  } catch (error) {
    yield put(setGamesError(error instanceof Error ? error.message : 'Failed to search games'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to search games',
    }))
  } finally {
    yield put(setGamesLoading(false))
  }
}

function* loadAvailableFiltersSaga() {
  try {
    const filters = yield call(gamesService.getAvailableFilters)
    
    // This would typically update a filters state
    // For now, we'll just log it
    console.log('Available filters:', filters)
  } catch (error) {
    yield put(setGamesError(error instanceof Error ? error.message : 'Failed to load filters'))
  }
}

function* setGenreFilterSaga(action: { type: string; payload: string | null }) {
  try {
    yield put(setSelectedGenre(action.payload))
    
    // Reload games with new filter
    const state = yield select()
    const filters = {
      genre: action.payload,
      page: 1, // Reset to first page when changing genre
    }
    
    yield put(loadGamesWithFilters(filters))
  } catch (error) {
    yield put(setGamesError(error instanceof Error ? error.message : 'Failed to set genre filter'))
  }
}

function* loadMoreGamesSaga() {
  try {
    const state = yield select()
    
    if (state.games.currentPage >= state.games.totalPages) {
      return // No more pages to load
    }
    
    yield put(setGamesLoading(true))
    yield put(setGamesError(null))
    
    const nextPage = state.games.currentPage + 1
    const filters = {
      genre: state.games.selectedGenre,
      page: nextPage,
    }
    
    const gamesResponse = yield call(gamesService.getGames, filters)
    
    // Append new games to existing ones
    const updatedGames = [...state.games.games, ...gamesResponse.games]
    const updatedResponse = {
      ...gamesResponse,
      games: updatedGames,
    }
    
    yield put(setGames(updatedResponse))
  } catch (error) {
    yield put(setGamesError(error instanceof Error ? error.message : 'Failed to load more games'))
    yield put(addNotification({
      type: 'error',
      message: 'Failed to load more games',
    }))
  } finally {
    yield put(setGamesLoading(false))
  }
}

// Watcher saga
export function* watchGamesSagas() {
  yield takeEvery(GAMES_ACTIONS.LOAD_GAMES, loadGamesSaga)
  yield takeEvery(GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS, loadGamesWithFiltersSaga)
  yield takeEvery(GAMES_ACTIONS.SEARCH_GAMES, searchGamesSaga)
  yield takeEvery(GAMES_ACTIONS.LOAD_AVAILABLE_FILTERS, loadAvailableFiltersSaga)
  yield takeEvery(GAMES_ACTIONS.SET_GENRE_FILTER, setGenreFilterSaga)
  yield takeEvery(GAMES_ACTIONS.LOAD_MORE_GAMES, loadMoreGamesSaga)
}
