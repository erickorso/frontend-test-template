import { allGames, availableFilters, delay, type Game } from '../src/utils/endpoint'

describe('Game Data Utils', () => {
  it('has correct Game interface structure', () => {
    const sampleGame: Game = {
      id: '1',
      genre: 'Action',
      image: '/game-images/test.jpg',
      name: 'Test Game',
      description: 'A test game description',
      price: 99.99,
      isNew: true,
    }

    expect(sampleGame).toHaveProperty('id')
    expect(sampleGame).toHaveProperty('genre')
    expect(sampleGame).toHaveProperty('image')
    expect(sampleGame).toHaveProperty('name')
    expect(sampleGame).toHaveProperty('description')
    expect(sampleGame).toHaveProperty('price')
    expect(sampleGame).toHaveProperty('isNew')

    expect(typeof sampleGame.id).toBe('string')
    expect(typeof sampleGame.genre).toBe('string')
    expect(typeof sampleGame.image).toBe('string')
    expect(typeof sampleGame.name).toBe('string')
    expect(typeof sampleGame.description).toBe('string')
    expect(typeof sampleGame.price).toBe('number')
    expect(typeof sampleGame.isNew).toBe('boolean')
  })

  it('has valid games data', () => {
    expect(Array.isArray(allGames)).toBe(true)
    expect(allGames.length).toBeGreaterThan(0)

    allGames.forEach((game) => {
      expect(game).toHaveProperty('id')
      expect(game).toHaveProperty('genre')
      expect(game).toHaveProperty('image')
      expect(game).toHaveProperty('name')
      expect(game).toHaveProperty('description')
      expect(game).toHaveProperty('price')
      expect(game).toHaveProperty('isNew')

      expect(typeof game.id).toBe('string')
      expect(typeof game.genre).toBe('string')
      expect(typeof game.image).toBe('string')
      expect(typeof game.name).toBe('string')
      expect(typeof game.description).toBe('string')
      expect(typeof game.price).toBe('number')
      expect(typeof game.isNew).toBe('boolean')
    })
  })

  it('has valid available filters', () => {
    expect(Array.isArray(availableFilters)).toBe(true)
    expect(availableFilters.length).toBeGreaterThan(0)

    availableFilters.forEach((filter) => {
      expect(typeof filter).toBe('string')
      expect(filter.length).toBeGreaterThan(0)
    })
  })

  it('has unique game IDs', () => {
    const ids = allGames.map(game => game.id)
    const uniqueIds = new Set(ids)
    
    expect(ids.length).toBe(uniqueIds.size)
  })

  it('has valid price values', () => {
    allGames.forEach((game) => {
      expect(game.price).toBeGreaterThan(0)
      expect(typeof game.price).toBe('number')
    })
  })

  it('delay function works correctly', async () => {
    // Use real timers for this test
    jest.useRealTimers()
    
    const startTime = Date.now()
    await delay(100)
    const endTime = Date.now()
    
    // Should wait at least 100ms
    expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    
    // Restore fake timers
    jest.useFakeTimers()
  }, 60000)

  it('delay function returns a promise', () => {
    const delayPromise = delay(100)
    expect(delayPromise).toBeInstanceOf(Promise)
  })
})
