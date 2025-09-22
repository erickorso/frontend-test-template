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
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_GAMES, payload: { page: 1 } })
    })

    it('should create loadGamesWithFilters action', () => {
      const action = loadGamesWithFilters(2, 'Action')
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS, payload: { page: 2, genre: 'Action' } })
    })

    it('should create searchGames action', () => {
      const action = searchGames('Witcher')
      expect(action).toEqual({ type: GAMES_ACTIONS.SEARCH_GAMES, payload: { query: 'Witcher', page: 1, genre: '' } })
    })

    it('should create loadMoreGames action', () => {
      const action = loadMoreGames(2)
      expect(action).toEqual({ type: GAMES_ACTIONS.LOAD_MORE_GAMES, payload: { page: 2 } })
    })
  })

  describe('Action Types', () => {
    it('should have correct action types', () => {
      expect(GAMES_ACTIONS.LOAD_GAMES).toBe('LOAD_GAMES')
      expect(GAMES_ACTIONS.LOAD_GAMES_WITH_FILTERS).toBe('LOAD_GAMES_WITH_FILTERS')
      expect(GAMES_ACTIONS.SEARCH_GAMES).toBe('SEARCH_GAMES')
      expect(GAMES_ACTIONS.LOAD_MORE_GAMES).toBe('LOAD_MORE_GAMES')
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
