import React, { memo } from 'react'
import Link from 'next/link'

const Logo: React.FC = memo(() => {
  return (
    <Link 
      href="/" 
      className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
      aria-label="Game Store - Go to homepage"
    >
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">G</span>
      </div>
      <span className="hidden sm:block">Game Store</span>
    </Link>
  )
})

Logo.displayName = 'Logo'

export default Logo
