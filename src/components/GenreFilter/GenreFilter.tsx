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
    
    if (selectedGenre) {
      params.set('genre', selectedGenre)
    } else {
      params.delete('genre')
    }
    
    // Reset to page 1 when changing genre
    params.delete('page')
    
    router.push(`/catalog?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="genre-filter" className="text-sm font-medium text-gray-700">
        Genre:
      </label>
      <select
        id="genre-filter"
        value={currentGenre}
        onChange={handleGenreChange}
        className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">All Genres</option>
        {availableFilters.map((filter) => (
          <option key={filter} value={filter}>
            {filter}
          </option>
        ))}
      </select>
    </div>
  )
})

GenreFilter.displayName = 'GenreFilter'

export default GenreFilter
