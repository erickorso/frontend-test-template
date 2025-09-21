import { call, put, takeEvery, select } from 'redux-saga/effects'
import { gamesService } from '../../services/gamesService'
import { setGames, setGamesLoading, setGamesError, clearGamesError } from '../slices/gamesSlice'

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
export const loadGamesWithFilters = (filters: { genre?: string; page?: number; search?: string }) => ({ 
  type: GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS, 
  payload: filters 
})
export const searchGames = (query: string) => ({ type: GAMES_ACTIONS.SEARCH_GAMES, payload: query })
export const loadAvailableFilters = () => ({ type: GAMES_ACTIONS.LOAD_AVAILABLE_FILTERS })
export const setGenreFilter = (genre: string) => ({ type: GAMES_ACTIONS.SET_GENRE_FILTER, payload: genre })
export const setSearchQuery = (query: string) => ({ type: GAMES_ACTIONS.SET_SEARCH_QUERY, payload: query })
export const loadMoreGames = () => ({ type: GAMES_ACTIONS.LOAD_MORE_GAMES })

// Sagas
function* loadGamesSaga() {
  try {
    yield put(setGamesLoading(true))
    yield put(clearGamesError())
    
    const response = yield call(gamesService.getGames, 1)
    yield put(setGames(response))
  } catch (error) {
    yield put(setGamesError('Failed to load games'))
    console.error('Error loading games:', error)
  } finally {
    yield put(setGamesLoading(false))
  }
}

function* loadGamesWithFiltersSaga(action: { payload: { genre?: string; page?: number; search?: string } }) {
  try {
    yield put(setGamesLoading(true))
    yield put(clearGamesError())
    
    const { genre, page = 1, search } = action.payload
    let response
    
    if (search && search.trim()) {
      response = yield call(gamesService.searchGames, search, { page, genre })
    } else {
      response = yield call(gamesService.getGames, page, genre)
    }
    
    yield put(setGames(response))
  } catch (error) {
    yield put(setGamesError('Failed to load games'))
    console.error('Error loading games with filters:', error)
  } finally {
    yield put(setGamesLoading(false))
  }
}

function* searchGamesSaga(action: { payload: string }) {
  try {
    yield put(setGamesLoading(true))
    yield put(clearGamesError())
    
    const query = action.payload
    const response = yield call(gamesService.searchGames, query)
    yield put(setGames(response))
  } catch (error) {
    yield put(setGamesError('Failed to search games'))
    console.error('Error searching games:', error)
  } finally {
    yield put(setGamesLoading(false))
  }
}

function* loadMoreGamesSaga() {
  try {
    const state = yield select()
    const { currentPage, totalPages, selectedGenre, searchQuery } = state.games
    
    if (currentPage >= totalPages) return
    
    yield put(setGamesLoading(true))
    yield put(clearGamesError())
    
    const nextPage = currentPage + 1
    let response
    
    if (searchQuery && searchQuery.trim()) {
      response = yield call(gamesService.searchGames, searchQuery, { page: nextPage, genre: selectedGenre })
    } else {
      response = yield call(gamesService.getGames, nextPage, selectedGenre)
    }
    
    // Append new games to existing ones
    const currentGames = state.games.games
    const updatedGames = [...currentGames, ...response.games]
    
    yield put(setGames({
      ...response,
      games: updatedGames
    }))
  } catch (error) {
    yield put(setGamesError('Failed to load more games'))
    console.error('Error loading more games:', error)
  } finally {
    yield put(setGamesLoading(false))
  }
}

// Watcher sagas
export function* watchGamesSagas() {
  yield takeEvery(GAMES_ACTIONS.LOAD_GAMES, loadGamesSaga)
  yield takeEvery(GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS, loadGamesWithFiltersSaga)
  yield takeEvery(GAMES_ACTIONS.SEARCH_GAMES, searchGamesSaga)
  yield takeEvery(GAMES_ACTIONS.LOAD_MORE_GAMES, loadMoreGamesSaga)
}