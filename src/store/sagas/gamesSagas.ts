// Simplified games sagas for Vercel compatibility

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

// Simplified saga watcher for Vercel compatibility
export function* watchGamesSagas() {
  // Simplified saga watcher - will be implemented when needed
  yield
}