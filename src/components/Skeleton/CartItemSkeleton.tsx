import React from 'react'

const CartItemSkeleton: React.FC = () => {
  return (
    <div className="p-6 relative animate-pulse">
      {/* Remove button skeleton */}
      <div className="absolute top-4 right-4 w-6 h-6 bg-gray-300 rounded-full"></div>

      <div className="flex items-start space-x-4 pr-8">
        {/* Image skeleton */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          {/* Title and price skeleton */}
          <div className="flex justify-between items-center mb-2">
            <div className="h-5 bg-gray-300 rounded w-2/3"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
          
          {/* Genre skeleton */}
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItemSkeleton
