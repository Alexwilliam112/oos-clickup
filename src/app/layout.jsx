import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import QueryClient from './query-client'
import { SidebarNav } from '@/components/sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Mekari Task Management</title>
        <meta name="description" content={'Mekari Task Management'} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClient>
          <SidebarProvider>
            <SidebarNav />
            <SidebarInset className="h-screen w-screen overflow-hidden">
              <header className="flex h-20 items-center border-b px-4 sm:px-6 shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8 bg-blue-500 text-white">
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h1 className="text-base sm:text-lg font-medium">Team Space</h1>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Marketing Division</span>
                    </div>
                  </div>
                </div>
              </header>

              <div className="flex flex-col w-full h-full">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </QueryClient>
      </body>
    </html>
  )
}
