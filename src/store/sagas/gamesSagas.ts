// Simplified games sagas for Vercel compatibility
import { Game } from '../../utils/endpoint'

// Action types
export const GAMES_ACTIONS = {
  LOAD_GAMES: 'LOAD_GAMES',
  LOAD_GAMES_WITH_FILTERS: 'LOAD_GAMES_WITH_FILTERS',
  SEARCH_GAMES: 'SEARCH_GAMES',
  LOAD_MORE_GAMES: 'LOAD_MORE_GAMES'
}

// Action creators
export const loadGames = (page: number = 1) => ({
  type: GAMES_ACTIONS.LOAD_GAMES,
  payload: { page }
})

export const loadGamesWithFilters = (page: number = 1, genre: string = '') => ({
  type: GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS,
  payload: { page, genre }
})

export const searchGames = (query: string, page: number = 1, genre: string = '') => ({
  type: GAMES_ACTIONS.SEARCH_GAMES,
  payload: { query, page, genre }
})

export const loadMoreGames = (page: number) => ({
  type: GAMES_ACTIONS.LOAD_MORE_GAMES,
  payload: { page }
})

// Simplified sagas - just export empty functions for compatibility
export function* watchGamesSagas() {
  // Empty for now - games logic is handled in components
  return
}