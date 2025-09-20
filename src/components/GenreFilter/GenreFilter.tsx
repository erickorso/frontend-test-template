'use client'

import React, { memo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { availableFilters } from '../../utils/endpoint'

const GenreFilter: React.FC = memo(() => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGenre = searchParams.get('genre') || ''

  const handleGenreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedGenre === '') {
      // Remove genre parameter for "All" option
      params.delete('genre')
    } else {
      // Set the selected genre
      params.set('genre', selectedGenre)
    }
    
    // Reset to page 1 when changing genre
    params.delete('page')
    
    // Navigate to catalog with new parameters
    const queryString = params.toString()
    const newUrl = queryString ? `/catalog?${queryString}` : '/catalog'
    router.push(newUrl)
  }, [router, searchParams])

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="genre-filter" className="text-sm text-gray-600">
        Genre:
      </label>
      <span className="text-gray-300">|</span>
      <select
        id="genre-filter"
        value={currentGenre}
        onChange={handleGenreChange}
        className="block px-3 py-2 bg-transparent focus:outline-none sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200"
        aria-label="Filter games by genre"
      >
        <option value="">All</option>
        {availableFilters.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  )
})

GenreFilter.displayName = 'GenreFilter'

export default GenreFilter
