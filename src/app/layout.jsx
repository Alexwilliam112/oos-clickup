'use client'

import './globals.css'
import { Suspense } from 'react'
import { Poppins } from 'next/font/google'
import QueryClient from './query-client'
import Sidebar from '@/components/_revamp/sidebar/sidebar'
import AuthWrapper from './auth-wrapper'

const pjs = Poppins({
  subsets: ['latin'],
  weight: '400',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Mekari Task Management</title>
        <meta name="description" content={'Mekari Task Management'} />
      </head>
      <body className={`antialiased`} style={pjs.style}>
        <QueryClient>
          <Suspense>
            <AuthWrapper>
              <Sidebar>{children}</Sidebar>
            </AuthWrapper>
          </Suspense>
        </QueryClient>
      </body>
    </html>
  )
}
