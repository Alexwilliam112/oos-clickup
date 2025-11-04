'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import QueryClient from './query-client'
import Sidebar from '@/components/_revamp/sidebar/sidebar'
import AuthWrapper from './auth-wrapper'

function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isFormPage = pathname.startsWith('/forms')

  if (isFormPage) {
    return <>{children}</>
  }

  return (
    <Suspense>
      <AuthWrapper>
        <Sidebar>{children}</Sidebar>
      </AuthWrapper>
    </Suspense>
  )
}

export default function ClientLayoutWrapper({ children }) {
  return (
    <QueryClient>
      <ConditionalLayout>{children}</ConditionalLayout>
    </QueryClient>
  )
}
