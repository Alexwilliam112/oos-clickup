'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import QueryClient from './query-client'
import { useUserStore } from '@/store/user/userStore'
import UnauthorizedPage from '@/components/unauthorized/UnauthorizedPage'
import { authService } from '@/service/auth/auth-me.mjs'
import Sidebar from '@/components/_revamp/sidebar/sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const token = searchParams.get('token')

  const userId = useUserStore((state) => state.user_id)
  const setUserId = useUserStore((state) => state.setUserId)

  const [isReady, setIsReady] = useState(false)
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  const removeSearchParam = (paramToRemove) => {
    const query = []

    searchParams.keys()?.forEach((key) => {
      const value = searchParams.get(key)

      if (key !== paramToRemove) {
        query.push(`${key}=${value}`)
      }
    })

    router.replace(`${pathname}?${query.join('&')}`)
  }

  useEffect(() => {
    if (userId) {
      removeSearchParam('token')
      setIsReady(true)
      return
    } else {
      const checkUser = async () => {
        try {
          if (!token && !userId) {
            setIsUnauthorized(true)
            return
          }
          const res = await authService.getUser({ token })
          if (!res || !res.user_id) {
            throw new Error('Invalid token')
          }
          setUserId(res.user_id)
          removeSearchParam('token')
          setIsReady(true)
        } catch (err) {
          console.error('Unauthorized:', err)
          setIsUnauthorized(true)
          setIsReady(true)
        }
      }

      checkUser()
    }
  }, [token, userId])

  return (
    <html lang="en">
      <head>
        <title>Mekari Task Management</title>
        <meta name="description" content={'Mekari Task Management'} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClient>
          {!isReady && !isUnauthorized ? (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-sm">Loading, please wait...</p>
            </div>
          ) : userId ? (
            <Sidebar>{children}</Sidebar>
          ) : (
            <UnauthorizedPage />
          )}
        </QueryClient>
      </body>
    </html>
  )
}
