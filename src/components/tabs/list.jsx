'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateModalTrigger } from '@/components/ui-modal/modal-trigger'
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
import { useQuery } from '@tanstack/react-query'
import { masterService, taskService, workspaceService } from '@/service/index.mjs'

export function ListView() {
  const params = useSearchParams()

  const workspace_id = params.get('workspace_id')
  const page = params.get('page')
  const param_id = params.get('param_id')

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

  const [isOpen, setIsOpen] = useState(false)

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isSuccess: tasksSuccess,
    refetch: fetchTasks,
  } = useQuery({
    queryFn: taskService.getTasks,
    queryKey: ['taskService.getTasks', { team, folder, lists, param_id, workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: inititalValuesLoading } = useQuery({
    queryFn: () =>
      taskService.getTaskInitialValues().then((data) => {
        setTeam(data.team_id || null)
        setFolder(data.folder_id || null)
        setLists(data.list_ids || [])

        return data
      }),
    queryKey: ['taskService.getTaskInitialValues', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: taskTypeLoading } = useQuery({
    queryFn: () =>
      masterService.getTaskTypes().then((data) => {
        setIndexTaskType(data || [])

        return DataTransferItemList
      }),
    queryKey: ['masterService.getTaskTypes', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: statusLoading } = useQuery({
    queryFn: () =>
      masterService.getStatuses().then((data) => {
        setIndexStatus(data)

        return data
      }),
    queryKey: ['masterService.getStatuses', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: priorityLoading } = useQuery({
    queryFn: () =>
      masterService.getPriorities().then((priority) => {
        setIndexPriority(priority)

        return data
      }),
    queryKey: ['masterService.getPriorities', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: productsLoading } = useQuery({
    queryFn: () =>
      masterService.getProducts().then((data) => {
        setIndexProduct(data)

        return data
      }),
    queryKey: ['masterService.getProducts', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: membersLoading } = useQuery({
    queryFn: () =>
      workspaceService.getWorkspaceMembers().then((data) => {
        setIndexMember(data)

        return data
      }),
    queryKey: ['workspaceService.getWorkspaceMembers', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: teamsLoading } = useQuery({
    queryFn: () =>
      masterService.getTeams().then((data) => {
        setIndexTeam(data)

        return data
      }),
    queryKey: ['masterService.getTeams', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: foldersLoading } = useQuery({
    queryFn: () =>
      masterService.getFolders().then((data) => {
        setIndexFolder(data)

        return data
      }),
    queryKey: ['masterService.getFolders', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: listsLoading } = useQuery({
    queryFn: () =>
      masterService.getList().then((data) => {
        setIndexList(data)

        return data
      }),
    queryKey: ['masterService.getList', { workspace_id }],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const filteredTasks = filterTasksByName(
    tasksData || [],
    search,
    statusFilter,
    assigneeFilter,
    priorityFilter,
    teamFilter
  )

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
