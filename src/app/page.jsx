'use client'

import { ClickUpSidebar } from '@/components/clickup-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { templateService } from '@/service/index.mjs'
import { useQuery } from '@tanstack/react-query'
import { ClickUpSidebar } from '@/components/clickup-sidebar'
import { Dashboard } from '@/components/dashboard'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Home() {
  const dataQuery = useQuery({
    queryKey: ['data'],
    queryFn: templateService.getSomething,
  })

  return (
    <SidebarProvider>
      <ClickUpSidebar />
      <SidebarInset>
        <div className="my-4 space-y-2">
          {dataQuery.isLoading ? (
            <p>Loading...</p>
          ) : dataQuery.data ? (
            dataQuery.data.data.map((d) => <p>{JSON.stringify(d)}</p>)
          ) : (
            <p>No data retrieved</p>
          )}
        </div>

        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  )
}
