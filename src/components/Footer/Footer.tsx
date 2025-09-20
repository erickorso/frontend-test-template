'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { Container } from '../Container'

const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gray-800 text-white">
      <Container className="py-4">
        <div className="flex justify-center items-center">
          <Image 
            src="/logo_white.svg" 
            alt="A APPLY DIGITAL" 
            width={170}
            height={45}
            className="h-8 w-auto"
          />
        </div>
      </Container>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
