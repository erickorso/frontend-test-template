'use client'

import React, { memo } from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  fluid?: boolean
}

const Container: React.FC<ContainerProps> = memo(({ 
  children, 
  className = '', 
  fluid = false 
}) => {
  const baseClasses = 'w-full mx-auto px-4 sm:px-6 lg:px-8'
  const maxWidthClass = fluid ? '' : 'max-w-[1280px]'
  const combinedClasses = `${baseClasses} ${maxWidthClass} ${className}`.trim()

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  )
})

Container.displayName = 'Container'

export default Container
