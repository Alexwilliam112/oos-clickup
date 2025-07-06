'use client'

import { templateService } from '@/service/index.mjs'
import { useQuery } from '@tanstack/react-query'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  const dataQuery = useQuery({
    queryKey: ['data'],
    queryFn: templateService.getSomething,
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">SyncBoard</h1>
      <h2 className="text-3xl font-bold py-5">"Sync your work. Streamline your world."</h2>
    </div>
  )
}
