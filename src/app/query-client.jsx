'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryClientWrapper({ children }) {
  // Create a new QueryClient instance for each component render
  // This prevents sharing client state between different users and requests
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
