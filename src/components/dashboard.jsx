'use client'

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListFilter } from 'lucide-react'
import { Overview } from './tabs/overview'
import { Board } from './tabs/board'
import { ListView } from './tabs/list'
import { FormsListView } from './tabs/forms._list'
import { CalendarView } from './tabs/calendar'
import { useSearchParams } from 'next/navigation'
import { SquareKanban, ChartAreaIcon } from 'lucide-react'
import { List } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { ChartPage } from './tabs/chart'

export function Dashboard() {
  const params = useSearchParams()

  const [page, setPage] = useState(null)
  const [tabValue, setTabValue] = useState('chart')

  useEffect(() => {
    const currentPage = params.get('page')
    setPage(currentPage)

    // Reset tab when page changes
    if (currentPage === 'form') {
      setTabValue('list')
    } else {
      setTabValue('chart')
    }
  }, [params])

  const isFormPage = page === 'form'

  // Show loading state until params are available
  if (page === null) return <Skeleton/>


  return (
    <Tabs value={tabValue} onValueChange={setTabValue} className="h-full w-full p-4">
      <TabsList className="w-full">
        <TabsTrigger value="list" className="gap-2">
          <List className="h-4 w-4" />
          List
        </TabsTrigger>

        {!isFormPage && (
          <>
            <TabsTrigger value="chart" className="gap-2">
              <ChartAreaIcon />
              Chart
            </TabsTrigger>
            <TabsTrigger value="board" className="gap-2">
              <SquareKanban />
              Board
            </TabsTrigger>
          </>
        )}

      </TabsList>

      {/* List tab content */}
      <TabsContent value="list">
        {isFormPage ? <FormsListView /> : <ListView />}
      </TabsContent>

      {/* Only show these tabs if not in "form" mode */}
      {!isFormPage && (
        <>
          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="chart">
            <ChartPage />
          </TabsContent>

          <TabsContent value="board" className="gap-2">
            <Board />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </>
      )}
    </Tabs>
  )
}
