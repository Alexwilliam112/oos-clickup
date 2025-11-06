'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DetailModalTrigger, CreateModalTrigger } from '@/components/ui-modal/modal-trigger'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

function getContrastColor(hexColor) {
  // Remove the hash if it exists
  const color = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return black for light backgrounds, white for dark backgrounds
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

export function Board() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDetailTaskId, setOpenDetailTaskId] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')

  const [tasks, setTasks] = useState([])
  const [indexTaskType, setIndexTaskType] = useState([])
  const [indexStatus, setIndexStatus] = useState([])
  const [indexPriority, setIndexPriority] = useState([])
  const [indexProduct, setIndexProduct] = useState([])
  const [indexMember, setIndexMember] = useState([])
  const [indexTeam, setIndexTeam] = useState([])
  const [indexFolder, setIndexFolder] = useState([])
  const [indexList, setIndexList] = useState([])
  const [team, setTeam] = useState(null)
  const [folder, setFolder] = useState(null)
  const [lists, setLists] = useState([])
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)

  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const workspaceId = params.get('workspace_id')
  const page = params.get('page')
  const paramId = params.get('param_id')

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      (task.task_type_id?.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (task.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)

    const matchesStatus = statusFilter !== 'all' ? task.status_id?.id === statusFilter : true

    const matchesAssignee =
      assigneeFilter !== 'all' ? task.assignee_ids?.id === assigneeFilter : true

    const matchesPriority =
      priorityFilter !== 'all' ? task.priority_id?.id === priorityFilter : true

    const matchesTeam = teamFilter !== 'all' ? task.team_id?.id === teamFilter : true

    return matchesSearch && matchesStatus && matchesAssignee && matchesPriority && matchesTeam
  })

  const fetchTasks = () => {
    let taskDataInitial = []
    fetch(
      //GET TASKS
      `${baseUrl}/task/index?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch TASKS DATA.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to TASKS DATA.')
        }
        setTasks(data.data)
      })
      .catch((error) => {
        console.error('Error fetching TASKS DATA:', error)
      })
    console.log('SUCCESS FETCH TASKS DATA')
  }

  useEffect(() => {
    if (workspaceId && page && paramId) {
      fetchTasks()
    }
  }, [workspaceId, page, paramId])

  useEffect(() => {
    if (workspaceId) {
      //GET INITIAL VALUES
      fetch(
        `${baseUrl}/utils/task-initial-values?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch initial values.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to initial values.')
          }
          const initialValues = data.data
          setTeam(initialValues.team_id || null)
          setFolder(initialValues.folder_id || null)
          setLists(initialValues.list_ids || [])
        })
        .catch((error) => {
          console.error('Error fetching initial values:', error)
        })
      console.log('SUCCESS FETCH INITIAL VALUES')

      //GET TASK TYPES
      fetch(`${baseUrl}/task-type/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch task types.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to task types.')
          }
          setIndexTaskType(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching task types:', error)
        })
      console.log('Task types fetched successfully:', indexTaskType)

      //GET STATUS
      fetch(`${baseUrl}/status/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Status.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to fetch Status.')
          }

          // Sort the data by the "order" property
          const sortedData = (data.data || []).sort((a, b) => a.order - b.order)

          // Set the sorted data to state
          setIndexStatus(sortedData)
          console.log('Status fetched and sorted successfully:', sortedData)
        })
        .catch((error) => {
          console.error('Error fetching Status:', error)
        })

      //GET PRIORITY
      fetch(`${baseUrl}/priority/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Priority.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to Priority.')
          }
          setIndexPriority(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching Priority:', error)
        })
      console.log('Task Priority successfully:', indexPriority)

      //GET PRODUCTS
      fetch(`${baseUrl}/product/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Products.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to Products.')
          }
          setIndexProduct(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching Products:', error)
        })
      console.log('Task Products successfully:', indexProduct)

      //GET MEMBERS
      fetch(`${baseUrl}/workspace-member/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Members.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to Members.')
          }
          setIndexMember(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching Members:', error)
        })
      console.log('Members successfully:', indexMember)

      //GET TEAMS
      fetch(`${baseUrl}/team-select/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch teams.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to teams.')
          }
          setIndexTeam(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching teams:', error)
        })
      console.log('teams successfully:', indexTeam)

      //GET FOLDERS
      fetch(`${baseUrl}/folder-select/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch folders.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to folders.')
          }
          setIndexFolder(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching folders:', error)
        })
      console.log('folders successfully:', indexFolder)

      //GET LIST
      fetch(`${baseUrl}/list-select/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch teams.')
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || 'Failed to teams.')
          }
          setIndexList(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching teams:', error)
        })
      console.log('teams successfully:', indexList)
    }
  }, [workspaceId])

  const renderStatusIcon = (statusType) => {
    switch (statusType) {
      case 'BACKLOG':
        return (
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeDasharray="4" />
          </svg>
        )
      case 'PROGRESS':
        return (
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
        )
      case 'COMPLETE':
        return (
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
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-3 shrink">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="grow-1 h-10"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-42">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {indexStatus.map((status) => (
              <SelectItem key={status.id_record} value={status.id_record}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="max-w-42">
            <SelectValue placeholder="All Assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {indexMember.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="max-w-42">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {indexPriority.map((priority) => (
              <SelectItem key={priority.id_record} value={priority.id_record}>
                {priority.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="max-w-42">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {indexTeam.map((team) => (
              <SelectItem key={team.id_record} value={team.id_record}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full">
        <ScrollArea type="always" className="w-1 flex-1 border rounded h-[calc(100vh-11.5rem)]">
          <div className="relative flex h-fit w-full">
            {indexStatus.map((status) => (
              <div
                key={status._id}
                className="flex min-h-full w-[280px] flex-none flex-col border-r last:border-r-0"
              >
                {/* Column Header */}
                <div
                  className="sticky top-0 z-10 flex items-center justify-between p-2"
                  style={{
                    backgroundColor: status.color || '#f3f4f6',
                    color: '#fff',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      {renderStatusIcon(status.status_type)}
                    </div>
                    <span className="text-sm font-medium">{status.name}</span>
                    <Badge variant="secondary" className="bg-white/20 text-xs">
                      {tasks.filter((task) => task.status_id?.id === status.id_record).length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreateModalTrigger
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 border-radius-full hover:bg-white/20"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                      modalTitle="Create Task"
                      parentTaskId={'0'}
                      modalSubtitle={''}
                      sidebarContent={<p></p>}
                      fetchTasks={fetchTasks}
                      initialValues={{
                        team,
                        folder,
                        lists,
                      }}
                      selectData={{
                        indexTaskType,
                        indexStatus,
                        indexPriority,
                        indexProduct,
                        indexMember,
                        indexTeam,
                        indexFolder,
                        indexList,
                      }}
                      isOpen={isHeaderModalOpen}
                      setIsOpen={setIsHeaderModalOpen}
                      editorJsId={`editorjs-board-header-${status.id_record}`}
                    />
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex flex-1 flex-col gap-3 p-2">
                  {filteredTasks
                    .filter((task) => task.status_id?.id === status.id_record)
                    .map((task, idx) => (
                      <DetailModalTrigger
                        key={task.id_task}
                        trigger={
                          <Card key={task.id_task} className="p-3 gap-2 hover:bg-gray-50">
                            <div
                              className="mb-0 text-sm font-medium w-full p-0 pb-2"
                              style={{ wordBreak: 'break-word' }}
                            >
                              {task.name}
                            </div>

                            {/* TASK TYPE*/}
                            <div className="flex items-center gap-2 text-xs">
                              <svg
                                className={`h-4 w-4 text-[${task.task_type_id.color}]`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                              </svg>
                              <span
                                className="text-xs px-2 py-0.75 border border-muted-foreground/20 rounded-sm font-medium"
                                style={{
                                  color: task.task_type_id.color,
                                  borderColor: task.task_type_id.color,
                                }}
                              >
                                {task.task_type_id.name.toUpperCase()}
                              </span>
                            </div>

                            <div className="flex flex-col gap-2">
                              {/* PRODUCT*/}
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
                                <span
                                  className="text-xs px-2 py-0.75 border border-muted-foreground/20 rounded-sm"
                                  style={{
                                    backgroundColor: task.product_id.color,
                                    color: getContrastColor(task.product_id.color),
                                  }}
                                >
                                  {task.product_id.name}
                                </span>
                              </div>

                              {/* PRIORITY*/}
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
                                <span
                                  className="text-xs px-2 py-0.75 border border-muted-foreground/20 rounded-sm"
                                  style={{
                                    backgroundColor: task.priority_id.color,
                                    color: getContrastColor(task.priority_id.color),
                                  }}
                                >
                                  {task.priority_id.name}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                {/* DATE RANGE */}
                                <div className="flex items-center gap-2 min-w-[150px]">
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
                                  <span className="text-black font-medium">
                                    {new Date(task.date_start).toLocaleDateString()} -{' '}
                                    {new Date(task.date_end).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* ASSIGNEES */}
                                <div className="flex items-center gap-1 ml-auto">
                                  {(() => {
                                    // Extract the name and id from the object
                                    const { name = '', id = '' } = task?.assignee_ids

                                    // Generate initials from the name
                                    const initials = name
                                      .split(' ')
                                      .map((word) => word.charAt(0))
                                      .slice(0, 2)
                                      .join('')

                                    return (
                                      <Tooltip key={id}>
                                        <TooltipTrigger asChild>
                                          <div
                                            className="relative border rounded-full border-gray-700"
                                            style={{
                                              marginLeft: idx === 0 ? '0' : '-13%', // Overlap by 15%
                                            }}
                                          >
                                            <Avatar>
                                              <AvatarFallback
                                                style={{
                                                  backgroundColor: '#F5B1FF',
                                                  color: getContrastColor('#F5B1FF'),
                                                  cursor: 'pointer',
                                                }}
                                              >
                                                {initials}
                                              </AvatarFallback>
                                            </Avatar>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <span>{name}</span>
                                        </TooltipContent>
                                      </Tooltip>
                                    )
                                  })()}
                                </div>
                              </div>
                            </div>
                          </Card>
                        }
                        modalTitle="Task Details"
                        fetchTasks={fetchTasks}
                        showSidebar={true}
                        task={task}
                        setTasks={setTasks}
                        tasks={tasks}
                        selectData={{
                          indexTaskType,
                          indexStatus,
                          indexPriority,
                          indexProduct,
                          indexMember,
                          indexTeam,
                          indexFolder,
                          indexList,
                        }}
                        modalSubtitle={task.created_at}
                        sidebarContent={<p>Sidebar content here</p>}
                        isOpen={openDetailTaskId === task.id_task}
                        setIsOpen={(open) => setOpenDetailTaskId(open ? task.id_task : null)}
                      >
                        <p>Modal content here</p>
                      </DetailModalTrigger>
                    ))}
                  <div className="w-full">
                    <CreateModalTrigger
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer flex h-8 w-full border border-green-500 text-green-600 font-medium rounded-md hover:bg-green-100 hover:text-green-500 transition-colors"
                        >
                          ADD
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                      modalTitle="Create Task"
                      parentTaskId={'0'}
                      modalSubtitle={''}
                      sidebarContent={<p></p>}
                      fetchTasks={fetchTasks}
                      initialValues={{
                        team,
                        folder,
                        lists,
                      }}
                      selectData={{
                        indexTaskType,
                        indexStatus,
                        indexPriority,
                        indexProduct,
                        indexMember,
                        indexTeam,
                        indexFolder,
                        indexList,
                      }}
                      isOpen={isColumnModalOpen}
                      setIsOpen={setIsColumnModalOpen}
                      editorJsId={`editorjs-board-column-${status.id_record}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="w-full" />
        </ScrollArea>
      </div>
    </div>
  )
}
