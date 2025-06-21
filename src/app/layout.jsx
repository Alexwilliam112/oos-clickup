"use client"
import './globals.css';
import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { useSearchParams } from 'next/navigation'
import QueryClient from './query-client';
import { SidebarNav } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUserStore } from '@/store/user/userStore'
import UnauthorizedPage from '@/components/unauthorized/UnauthorizedPage';
import { authService } from '@/service/auth/auth-me.mjs';
import { useQuery } from '@tanstack/react-query';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const userId = useUserStore((state) => state.user_id)
  console.log(userId, "::::");
  const setUserId = useUserStore((state) => state.setUserId)
  console.log(setUserId, "MMM");
  const [isReady, setIsReady] = useState(false)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  useEffect(() => {
    const checkUser = async () => {
      if (userId) {
        // Hapus token dari URL
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, '', url.toString())
        setIsReady(true)
        return
      }
      try {
        const res = await authService.getUser({ token })
      console.log(res, "USERID");
        if (!res || !res.user_id) {
          throw new Error('Invalid token')
        }
        setUserId(res.user_id);
        if (!token) {
          setIsUnauthorized(true)
          return
        }
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, '', url.toString())
        setIsReady(true)
      } catch (err) {
        console.error('Unauthorized:', err)
        setIsUnauthorized(true)
      }
    }

    checkUser()
  }, [token, userId])

  return (
    <html lang="en">
      <head>
        <title>Mekari Task Management</title>
        <meta name="description" content={'Mekari Task Management'} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClient>
          {!isReady ? 
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-sm">Loading, please wait...</p>
            </div>
            :
            userId ?
            <SidebarProvider>
              <SidebarNav />
              <div className="w-full h-full">{children}</div>
            </SidebarProvider> 
            : 
            <UnauthorizedPage />
          }
        </QueryClient>
      </body>
    </html>
  );
}