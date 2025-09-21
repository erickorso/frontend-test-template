import React from 'react'

const OrderSummarySkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8 animate-pulse">
      {/* Header skeleton */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
      </div>
      
      <div className="p-6">
        {/* Items list skeleton */}
        <div className="space-y-4 mb-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </div>
          ))}
        </div>
        
        {/* Totals skeleton */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-8"></div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <div className="h-5 bg-gray-300 rounded w-12"></div>
            <div className="h-5 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
        
        {/* Button skeleton */}
        <div className="mt-6">
          <div className="h-14 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummarySkeleton
