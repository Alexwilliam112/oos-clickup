'use client'

import { ChevronLeft, Edit, EllipsisVertical, Plus, UserCircle } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Status colors
const statusColors = {
  backlog: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: 'text-gray-500',
    border: 'border-gray-300',
  },
  'in progress': {
    bg: 'bg-yellow-400',
    text: 'text-yellow-950',
    icon: 'text-yellow-600',
    border: 'border-yellow-500',
  },
  'ready for review': {
    bg: 'bg-violet-500',
    text: 'text-white',
    icon: 'text-violet-200',
    border: 'border-violet-600',
  },
  rejected: {
    bg: 'bg-red-500',
    text: 'text-white',
    icon: 'text-red-200',
    border: 'border-red-600',
  },
  'on hold': {
    bg: 'bg-amber-800',
    text: 'text-white',
    icon: 'text-amber-200',
    border: 'border-amber-900',
  },
  done: {
    bg: 'bg-green-500',
    text: 'text-white',
    icon: 'text-green-200',
    border: 'border-green-600',
  },
  closed: {
    bg: 'bg-green-500',
    text: 'text-white',
    icon: 'text-green-200',
    border: 'border-green-600',
  },
  published: {
    bg: 'bg-green-500',
    text: 'text-white',
    icon: 'text-green-200',
    border: 'border-green-600',
  },
  default: {
    bg: 'bg-gray-200',
    text: 'text-gray-800',
    icon: 'text-gray-600',
    border: 'border-gray-400',
  },
}

// Sample data
const columns = [
  {
    id: 'backlog',
    name: 'backlog',
    count: 18,
    tasks: [
      {
        id: 'task1',
        title: 'Whitepaper Promotion - KV1',
        location: 'Brand / Brand - Tasklist',
        assignee: 'AM',
        dueDate: '7/16/24',
        priority: 'Normal',
      },
      {
        id: 'task2',
        title: 'Mekaricon | Socmed post - All logo sponsor, partner, community, etc',
        location: 'Activation - Request list',
        assignee: null,
        dueDate: null,
        priority: null,
      },
      {
        id: 'task3',
        title: 'Whitepaper Promotion - KV1',
        location: 'Brand / Brand - Tasklist',
        assignee: 'AM',
        dueDate: '7/16/24',
        priority: 'Normal',
      },
      {
        id: 'task4',
        title: 'Mekaricon | Socmed post - All logo sponsor, partner, community, etc',
        location: 'Activation - Request list',
        assignee: null,
        dueDate: null,
        priority: null,
      },
    ],
  },
  {
    id: 'in-progress',
    name: 'in progress',
    count: 0,
    tasks: [],
  },
  {
    id: 'ready-for-review',
    name: 'ready for review',
    count: 0,
    tasks: [],
  },
  {
    id: 'rejected',
    name: 'rejected',
    count: 0,
    tasks: [],
  },
  {
    id: 'on-hold',
    name: 'on hold',
    count: 0,
    tasks: [],
  },
  {
    id: 'done',
    name: 'done',
    count: 87,
    tasks: [],
  },
  {
    id: 'closed',
    name: 'closed',
    count: 2,
    tasks: [],
  },
  {
    id: 'published',
    name: 'published',
    count: 5,
    tasks: [],
  },
]

export function Board() {
  return (
    <div className="relative flex h-fit w-full">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex min-h-full w-[280px] flex-none flex-col border-r last:border-r-0"
        >
          {/* Column Header */}
          <div
            className={`sticky top-0 z-10 flex items-center justify-between p-2 ${
              statusColors[column.name]?.bg || statusColors.default.bg
            } ${statusColors[column.name]?.text || statusColors.default.text}`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                {column.name === 'backlog' ? (
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="4" />
                  </svg>
                ) : column.name === 'in progress' ? (
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ) : (
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium">{column.name}</span>
              <Badge variant="secondary" className="bg-white/20 text-xs">
                {column.count}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${
                  statusColors[column.name]?.text || statusColors.default.text
                } hover:bg-white/20`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${
                  statusColors[column.name]?.text || statusColors.default.text
                } hover:bg-white/20`}
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${
                  statusColors[column.name]?.text || statusColors.default.text
                } hover:bg-white/20`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Column Content */}
          <div className="flex flex-1 flex-col gap-2 p-2">
            {column.tasks.map((task) => (
              <Card key={task.id} className="p-3">
                <div className="mb-2 text-sm font-medium">{task.title}</div>
                <div className="mb-2 text-xs text-muted-foreground">In {task.location}</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    {task.assignee ? (
                      <Avatar className="h-5 w-5 bg-purple-500 text-white">
                        <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
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
                    {task.dueDate ? (
                      <span className="text-red-500">{task.dueDate}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 12H2M16 6l6 6-6 6M8 6l-6 6 6 6" />
                    </svg>
                    {task.priority ? (
                      <span>{task.priority}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="ghost" className="mt-2 justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
