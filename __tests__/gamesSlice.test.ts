import gamesReducer, {
  setGames,
  setSelectedGenre,
  setSearchQuery,
  setGamesLoading,
  setGamesError,
  clearGamesError,
} from '../src/store/slices/gamesSlice'
import { Game } from '../src/utils/endpoint'

const mockGame: Game = {
  id: '1',
  genre: 'Action',
  image: '/game-images/test.jpg',
  name: 'Test Game',
  description: 'A test game',
  price: 59.99,
  isNew: true,
}

const mockGamesResponse = {
  games: [mockGame],
  availableFilters: ['Action', 'Adventure', 'RPG'],
  totalPages: 5,
  currentPage: 1,
}

describe('gamesSlice', () => {
  const initialState = {
    games: [],
    availableFilters: [],
    totalPages: 1,
    currentPage: 1,
    selectedGenre: null,
    searchQuery: '',
    isLoading: false,
    error: null,
  }

  it('should return the initial state', () => {
    expect(gamesReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('setGames', () => {
    it('should set games and related data', () => {
      const action = setGames(mockGamesResponse)
      const newState = gamesReducer(initialState, action)

      expect(newState.games).toEqual(mockGamesResponse.games)
      expect(newState.availableFilters).toEqual(mockGamesResponse.availableFilters)
      expect(newState.totalPages).toBe(mockGamesResponse.totalPages)
      expect(newState.currentPage).toBe(mockGamesResponse.currentPage)
    })

    it('should handle empty games response', () => {
      const emptyResponse = {
        games: [],
        availableFilters: [],
        totalPages: 0,
        currentPage: 1,
      }
      const action = setGames(emptyResponse)
      const newState = gamesReducer(initialState, action)

      expect(newState.games).toEqual([])
      expect(newState.availableFilters).toEqual([])
      expect(newState.totalPages).toBe(0)
    })
  })

  describe('setSelectedGenre', () => {
    it('should set selected genre', () => {
      const action = setSelectedGenre('Action')
      const newState = gamesReducer(initialState, action)

      expect(newState.selectedGenre).toBe('Action')
    })

    it('should clear selected genre when set to null', () => {
      const stateWithGenre = { ...initialState, selectedGenre: 'Action' }
      const action = setSelectedGenre(null)
      const newState = gamesReducer(stateWithGenre, action)

      expect(newState.selectedGenre).toBe(null)
    })
  })

  describe('setSearchQuery', () => {
    it('should set search query', () => {
      const action = setSearchQuery('Witcher')
      const newState = gamesReducer(initialState, action)

      expect(newState.searchQuery).toBe('Witcher')
    })

    it('should handle empty search query', () => {
      const action = setSearchQuery('')
      const newState = gamesReducer(initialState, action)

      expect(newState.searchQuery).toBe('')
    })
  })

  describe('setGamesLoading', () => {
    it('should set loading state to true', () => {
      const action = setGamesLoading(true)
      const newState = gamesReducer(initialState, action)

      expect(newState.isLoading).toBe(true)
    })

    it('should set loading state to false', () => {
      const action = setGamesLoading(false)
      const newState = gamesReducer(initialState, action)

      expect(newState.isLoading).toBe(false)
    })
  })

  describe('setGamesError', () => {
    it('should set error message', () => {
      const errorMessage = 'Failed to load games'
      const action = setGamesError(errorMessage)
      const newState = gamesReducer(initialState, action)

      expect(newState.error).toBe(errorMessage)
    })

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' }
      const action = setGamesError(null)
      const newState = gamesReducer(stateWithError, action)

      expect(newState.error).toBe(null)
    })
  })

  describe('clearGamesError', () => {
    it('should clear error message', () => {
      const stateWithError = { ...initialState, error: 'Some error' }
      const action = clearGamesError()
      const newState = gamesReducer(stateWithError, action)

      expect(newState.error).toBe(null)
    })
  })

  describe('multiple actions', () => {
    it('should handle multiple state changes', () => {
      let state = gamesReducer(initialState, setGamesLoading(true))
      expect(state.isLoading).toBe(true)

      state = gamesReducer(state, setGames(mockGamesResponse))
      expect(state.games).toEqual(mockGamesResponse.games)
      expect(state.isLoading).toBe(true)

      state = gamesReducer(state, setSelectedGenre('Action'))
      expect(state.selectedGenre).toBe('Action')

      state = gamesReducer(state, setSearchQuery('Test'))
      expect(state.searchQuery).toBe('Test')

      state = gamesReducer(state, setGamesLoading(false))
      expect(state.isLoading).toBe(false)
    })
  })
})
