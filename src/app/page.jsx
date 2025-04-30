'use client'

import { ClickUpSidebar } from '@/components/clickup-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { templateService } from '@/service/index.mjs'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const dataQuery = useQuery({
    queryKey: ['data'],
    queryFn: templateService.getSomething,
  })

  return (
    <SidebarProvider>
      <ClickUpSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-xl font-semibold">ClickUp Clone</h1>
        </header>
        <main className="p-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Welcome to your ClickUp Clone</h2>
            <p className="mt-2 text-muted-foreground">
              This is a simplified clone of the ClickUp sidebar using shadcn/ui components.
            </p>
          </div>
        </main>

        <div className="my-4 space-y-2">
          {dataQuery.isLoading ? (
            <p>Loading...</p>
          ) : dataQuery.data ? (
            dataQuery.data.data.map((d) => <p>{JSON.stringify(d)}</p>)
          ) : (
            <p>No data retrieved</p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
