import { Game } from '../src/utils/endpoint'
import {
  watchGamesSagas,
  GAMES_ACTIONS,
  loadGames,
  loadGamesWithFilters,
  searchGames,
  loadAvailableFilters,
  setGenreFilter,
  setSearchQuery,
  loadMoreGames,
} from '../src/store/sagas/gamesSagas'
const mockGame: Game = {
  id: '1',
  genre: 'Action',
  image: '/game-images/test.jpg',
  name: 'Test Game',
  description: 'A test game',
  price: 59.99,
  isNew: true,
}

describe('gamesSagas', () => {
  describe('Action Creators', () => {
    it('should create loadGames action', () => {
      const action = loadGames()
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_GAMES })
    })

    it('should create loadGamesWithFilters action', () => {
      const filters = { genre: 'Action', page: 2 }
      const action = loadGamesWithFilters(filters)
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS, payload: filters })
    })

    it('should create searchGames action', () => {
      const action = searchGames('Witcher')
      expect(action).toEqual({ type: GAMES_ACTIONS.SEARCH_GAMES, payload: 'Witcher' })
    })

    it('should create loadAvailableFilters action', () => {
      const action = loadAvailableFilters()
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_AVAILABLE_FILTERS })
    })

    it('should create setGenreFilter action', () => {
      const action = setGenreFilter('Action')
      expect(action).toEqual({ type: GAMES_ACTIONS.SET_GENRE_FILTER, payload: 'Action' })
    })

    it('should create setSearchQuery action', () => {
      const action = setSearchQuery('Test')
      expect(action).toEqual({ type: GAMES_ACTIONS.SET_SEARCH_QUERY, payload: 'Test' })
    })

    it('should create loadMoreGames action', () => {
      const action = loadMoreGames()
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_MORE_GAMES })
    })
  })

  describe('Action Types', () => {
    it('should have correct action types', () => {
      expect(GAMES_ACTIONS.LOAD_GAMES).toBe('games/loadGames')
      expect(GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS).toBe('games/loadGamesWithFilters')
      expect(GAMES_ACTIONS.SEARCH_GAMES).toBe('games/searchGames')
      expect(GAMES_ACTIONS.LOAD_AVAILABLE_FILTERS).toBe('games/loadAvailableFilters')
      expect(GAMES_ACTIONS.SET_GENRE_FILTER).toBe('games/setGenreFilter')
      expect(GAMES_ACTIONS.SET_SEARCH_QUERY).toBe('games/setSearchQuery')
      expect(GAMES_ACTIONS.LOAD_MORE_GAMES).toBe('games/loadMoreGames')
    })
  })

  describe('watchGamesSagas', () => {
    it('should export watchGamesSagas function', () => {
      expect(typeof watchGamesSagas).toBe('function')
    })

    it('should be a generator function', () => {
      const saga = watchGamesSagas()
      expect(saga.next).toBeDefined()
      expect(typeof saga.next).toBe('function')
    })
  })
})
