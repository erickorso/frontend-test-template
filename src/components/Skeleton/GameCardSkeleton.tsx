import React from 'react'

const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 animate-pulse">
      <div className="relative p-3">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-300 rounded-t"></div>
        
        {/* Content skeleton */}
        <div className="p-3">
          {/* Genre skeleton */}
          <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
          
          {/* Title and price skeleton */}
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-14 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default GameCardSkeleton
