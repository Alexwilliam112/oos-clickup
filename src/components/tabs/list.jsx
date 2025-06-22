'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateModalTrigger } from '@/components/ui-modal/modal-trigger'
import { generateChildren } from '@/lib/utils'
import Task from './task'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'

export function ListView() {
  const [tasks, setTasks] = useState([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')

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

  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  const params = useSearchParams()
  const workspaceId = params.get('workspace_id')
  const page = params.get('page')
  const paramId = params.get('param_id')

  function filterTasksByName(
    tasks,
    search,
    statusFilter,
    assigneeFilter,
    priorityFilter,
    teamFilter
  ) {
    const lowerSearch = search.toLowerCase()
    return tasks
      .map((task) => {
        const matchesSearch =
          task.name?.toLowerCase().includes(lowerSearch) ||
          (task.task_type_id?.name?.toLowerCase().includes(lowerSearch) ?? false) ||
          (task.product_id?.name?.toLowerCase().includes(lowerSearch) ?? false)

        const matchesStatus = statusFilter !== 'all' ? task.status_id?.id === statusFilter : true

        const matchesAssignee =
          assigneeFilter !== 'all'
            ? Array.isArray(task.assignee_ids)
              ? task.assignee_ids.some((a) => a.id === assigneeFilter)
              : task.assignee_ids?.id === assigneeFilter
            : true

        const matchesPriority =
          priorityFilter !== 'all' ? task.priority_id?.id === priorityFilter : true

        const matchesTeam = teamFilter !== 'all' ? task.team_id?.id === teamFilter : true

        const filteredChildren = task.children
          ? filterTasksByName(
              task.children,
              search,
              statusFilter,
              assigneeFilter,
              priorityFilter,
              teamFilter
            )
          : []

        const selfMatches =
          matchesSearch && matchesStatus && matchesAssignee && matchesPriority && matchesTeam

        if (selfMatches) {
          return {
            ...task,
            children: filteredChildren,
          }
        } else if (filteredChildren.length > 0) {
          return filteredChildren
        }

        return null
      })
      .flat()
      .filter(Boolean)
  }
  const filteredTasks = filterTasksByName(
    tasks,
    search,
    statusFilter,
    assigneeFilter,
    priorityFilter,
    teamFilter
  )

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
        taskDataInitial = data.data
        setTasks(generateChildren(taskDataInitial))
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
    if (workspaceId && !team && !folder && !lists[0]) {
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
            throw new Error(data.message || 'Failed to Status.')
          }
          setIndexStatus(data.data || [])
        })
        .catch((error) => {
          console.error('Error fetching Status:', error)
        })
      console.log('Status fetched successfully:', indexStatus)

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

  const [isOpen, setIsOpen] = useState(false)

  const renderTasks = (taskList, level = 0) =>
    taskList.map((task) => (
      <React.Fragment key={task.id_task}>
        <Task
          level={level}
          task={task}
          fetchTasks={fetchTasks}
          renderTasks={renderTasks}
          tasks={tasks}
          setTasks={setTasks}
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
        />
      </React.Fragment>
    ))

  console.log(tasks)
  return (
    <>
      <div className="min-w-[50px] p-2 flex justify-left">
        <CreateModalTrigger
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer h-8 w-18 border border-green-500 text-green-600 font-medium rounded-md hover:bg-green-500 hover:text-white transition-colors"
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
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>

      <div className="flex gap-2 py-4">
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

      <div className="flex">
        <ScrollArea type="always" className="w-1 flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead
                  className="p-2 min-w-[50px] bg-muted"
                  style={{ position: "sticky", left: 0, zIndex: 30 }}
                ></TableHead> */}
                <TableHead
                  className="p-2 min-w-[255px] bg-muted "
                  // style={{ position: "sticky", left: 50, zIndex: 30 }}
                >
                  Task Name
                </TableHead>
                <TableHead className="p-2 min-w-[120px] bg-muted">Created</TableHead>
                <TableHead className="p-2 min-w-[120px] bg-muted">Task Type</TableHead>
                <TableHead className="p-2 min-w-[150px] bg-muted">Assignee</TableHead>
                <TableHead className="p-2 min-w-[120px] bg-muted">Start Date</TableHead>
                <TableHead className="p-2 min-w-[120px] bg-muted">Due Date</TableHead>
                <TableHead className="p-2 min-w-[100px] bg-muted">Priority</TableHead>
                <TableHead className="p-2 min-w-[130px] bg-muted">Status</TableHead>
                <TableHead className="p-2 min-w-[160px] bg-muted">Lists</TableHead>
                <TableHead className="p-2 min-w-[120px] bg-muted">Product</TableHead>
                <TableHead className="p-2 min-w-[190px] bg-muted">Team</TableHead>
                <TableHead className="p-2 min-w-[100px] text-right bg-muted">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task, idx) => (
                <React.Fragment key={task.id_task}>
                  <Task
                    level={idx}
                    task={task}
                    fetchTasks={fetchTasks}
                    renderTasks={renderTasks}
                    tasks={tasks}
                    setTasks={setTasks}
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
                  />
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" className="w-full" />
        </ScrollArea>
      </div>
    </>
  )
}
