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
import { useDashboardStore } from '@/store/task/task'

export function Dashboard() {
  const params = useSearchParams()
  const [page, setPage] = useState(null)

  const tabValue = useDashboardStore((state) => state.tabValue)
  const setTabValue = useDashboardStore((state) => state.setTabValue)
  const open_task_from_notification = localStorage.getItem('open_task_from_notification')

  useEffect(() => {
    const currentPage = params.get('page')
    setPage(currentPage)

    if (currentPage === 'form' || open_task_from_notification) {
      setTabValue('list')
    } else {
      setTabValue('list')
    }
  }, [params])

  const isFormPage = page === 'form'

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

      {tabValue === 'list' && (
        <TabsContent value="list" key="list-tab">
          {isFormPage ? <FormsListView /> : <ListView />}
        </TabsContent>
      )}

      {!isFormPage && tabValue === 'chart' && (
        <TabsContent value="chart" key="chart-tab">
          <ChartPage />
        </TabsContent>
      )}

      {!isFormPage && tabValue === 'board' && (
        <TabsContent value="board" key="board-tab" className="gap-2">
          <Board />
        </TabsContent>
      )}

      {!isFormPage && tabValue === 'overview' && (
        <TabsContent value="overview" key="overview-tab">
          <Overview />
        </TabsContent>
      )}

      {!isFormPage && tabValue === 'calendar' && (
        <TabsContent value="calendar" key="calendar-tab">
          <CalendarView />
        </TabsContent>
      )}
    </Tabs>
  )
}