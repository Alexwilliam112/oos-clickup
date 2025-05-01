'use client'

import { templateService } from '@/service/index.mjs'
import { useQuery } from '@tanstack/react-query'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  const dataQuery = useQuery({
    queryKey: ['data'],
    queryFn: templateService.getSomething,
  })

  return <Dashboard />
}
