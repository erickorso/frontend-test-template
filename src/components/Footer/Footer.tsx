'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '../Container'

const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gray-800 text-white" style={{ height: '172px' }}>
      <Container className="h-full">
        <div className="flex justify-center items-center h-full">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
            <Image 
              src="/logo_white.svg" 
              alt="A APPLY DIGITAL" 
              width={170}
              height={44}
              className="w-auto"
              style={{ height: '44px' }}
            />
          </Link>
        </div>
      </Container>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
