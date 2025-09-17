import { GET } from '../src/app/api/games/route'

// Mock the endpoint data
jest.mock('../src/utils/endpoint', () => ({
  allGames: [
    {
      id: '1',
      genre: 'Action',
      image: '/game-images/test.jpg',
      name: 'Test Game',
      description: 'A test game',
      price: 99,
      isNew: true,
    },
  ],
  availableFilters: ['Action', 'Adventure', 'RPG'],
  delay: jest.fn().mockResolvedValue(undefined),
}))

describe('Games API', () => {
  it('returns games data successfully', async () => {
    const request = new Request('http://localhost:3000/api/games')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('games')
    expect(data).toHaveProperty('totalPages')
    expect(data).toHaveProperty('currentPage')
    expect(data).toHaveProperty('availableFilters')
    
    expect(Array.isArray(data.games)).toBe(true)
    expect(data.games.length).toBeGreaterThan(0)
  })

  it('handles genre filtering', async () => {
    const request = new Request('http://localhost:3000/api/games?genre=Action')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.games.every((game: any) => game.genre === 'Action')).toBe(true)
  })

  it('handles pagination', async () => {
    const request = new Request('http://localhost:3000/api/games?page=1')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.currentPage).toBe(1)
    expect(data.totalPages).toBeGreaterThan(0)
  })

  it('returns available filters', async () => {
    const request = new Request('http://localhost:3000/api/games')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data.availableFilters)).toBe(true)
    expect(data.availableFilters.length).toBeGreaterThan(0)
  })
})
