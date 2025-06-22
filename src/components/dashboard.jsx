'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListFilter } from 'lucide-react'
import { Overview } from './tabs/overview'
import { Board } from './tabs/board'
import { ListView } from './tabs/list'
import { CalendarView } from './tabs/calendar'
import { useSearchParams } from 'next/navigation'
import { SquareKanban } from 'lucide-react'
import { List } from 'lucide-react'

export function Dashboard() {
  const params = useSearchParams()

  const page = params.get('page')

  return (
    <Tabs defaultValue="list" className="h-full w-full p-4">
      <TabsList className="w-full">
        <TabsTrigger value="list" className="gap-2">
          <List className="h-4 w-4" />
          List
        </TabsTrigger>

        {/* {page === 'my_tasks' ? (
          <></>
        ) : (
          <TabsTrigger value="overview" className="gap-2">
            Overview
          </TabsTrigger>
        )}

        {page === 'my_tasks' ? (
          <></>
        ) : (
          <TabsTrigger value="info" className="gap-2">
            General Info
          </TabsTrigger>
        )} */}

        <TabsTrigger value="board" className="gap-2">
          <SquareKanban />
          Board
        </TabsTrigger>

        {/* <TabsTrigger value="calendar" className="gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Calendar
          </TabsTrigger> */}
      </TabsList>

      <TabsContent value="overview">
        <Overview />
      </TabsContent>

      <TabsContent value="board" className="gap-2">
        <Board />
      </TabsContent>

      <TabsContent value="list">
        <ListView />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarView />
      </TabsContent>
    </Tabs>
  )
}
