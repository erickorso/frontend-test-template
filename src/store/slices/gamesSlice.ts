import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Game, GamesResponse } from '../../services/gamesService'

interface GamesState {
  games: Game[]
  availableFilters: string[]
  totalPages: number
  currentPage: number
  selectedGenre: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null
}

const initialState: GamesState = {
  games: [],
  availableFilters: [],
  totalPages: 1,
  currentPage: 1,
  selectedGenre: null,
  searchQuery: '',
  isLoading: false,
  error: null,
}

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    // Sync actions
    setGames: (state, action: PayloadAction<GamesResponse>) => {
      state.games = action.payload.games
      state.availableFilters = action.payload.availableFilters
      state.totalPages = action.payload.totalPages
      state.currentPage = action.payload.currentPage
    },
    
    setSelectedGenre: (state, action: PayloadAction<string | null>) => {
      state.selectedGenre = action.payload
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    
    setGamesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setGamesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    clearGamesError: (state) => {
      state.error = null
    },
  },
})

export const {
  setGames,
  setSelectedGenre,
  setSearchQuery,
  setGamesLoading,
  setGamesError,
  clearGamesError,
} = gamesSlice.actions

export default gamesSlice.reducer
