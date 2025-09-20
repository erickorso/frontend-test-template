'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '../Container'

const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gray-800 text-white">
      <Container className="py-4">
        <div className="flex justify-center items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
            <Image 
              src="/logo_white.svg" 
              alt="A APPLY DIGITAL" 
              width={170}
              height={45}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </Container>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
