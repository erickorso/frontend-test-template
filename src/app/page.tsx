import Link from 'next/link'
import { Container } from '../components/Container'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20'>
        <Container className="text-center">
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>
            Welcome to Game Store
          </h1>
          <p className='text-xl md:text-2xl mb-8 text-blue-100'>
            Discover amazing games and build your collection
          </p>
          <Link href="/catalog" className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-block'>
            Browse Games
          </Link>
        </Container>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <Container>
          <h2 className='text-3xl font-bold text-center mb-12 text-gray-900'>
            Why Choose Our Store?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Fast Delivery</h3>
              <p className='text-gray-600'>Get your games instantly with our digital delivery system</p>
            </div>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Quality Guaranteed</h3>
              <p className='text-gray-600'>All games are verified and come with full support</p>
            </div>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Best Prices</h3>
              <p className='text-gray-600'>Competitive pricing with regular discounts and deals</p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
