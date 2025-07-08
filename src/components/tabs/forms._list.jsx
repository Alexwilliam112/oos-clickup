'use client'

import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormCreateModalTrigger } from '../ui-modal/Forms/formModalTrigger'
import Form from './forms'
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
import { masterService, formService } from '@/service/index.mjs'
import { Skeleton } from '../ui/skeleton'

export function FormsListView() {
  const params = useSearchParams()

  const workspace_id = params.get('workspace_id')
  const page = params.get('page')
  const param_id = params.get('param_id')

  const [forms, setForms] = useState([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')

  const [indexTaskType, setIndexTaskType] = useState([])
  const [indexTeam, setIndexTeam] = useState([])
  const [indexFolder, setIndexFolder] = useState([])
  const [indexList, setIndexList] = useState([])

  const [isOpen, setIsOpen] = useState(false)

  const {
    data: formsData,
    isLoading: formsLoading,
    isSuccess: formsSuccess,
    refetch: fetchForms,
  } = useQuery({
    queryFn: formService.getForms,
    queryKey: ['formService.getForms', workspace_id],
    enabled: !!workspace_id && !!page && !!param_id,
    onError: (error) => {
      console.error('Form fetch error:', error);
    }
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


  const { isLoading: teamsLoading } = useQuery({
    queryFn: () =>
      masterService.getTeams().then((data) => {
        setIndexTeam(data)

        return data
      }),
    queryKey: ['masterService.getTeams', workspace_id],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: foldersLoading } = useQuery({
    queryFn: () =>
      masterService.getFolders().then((data) => {
        setIndexFolder(data)

        return data
      }),
    queryKey: ['masterService.getFolders', workspace_id],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const { isLoading: listsLoading } = useQuery({
    queryFn: () =>
      masterService.getList().then((data) => {
        setIndexList(data)

        return data
      }),
    queryKey: ['masterService.getList', workspace_id],
    enabled: !!workspace_id && !!page && !!param_id,
  })

  const filteredForms = useMemo(() => {
    if (!formsData) return []
    return filterFormsByName(
      formsData,
      search,
      teamFilter
    )
  }, [formsData, search, teamFilter])

  function filterFormsByName(
    forms,
    search,
    teamFilter
  ) {
    const lowerSearch = search.toLowerCase()
    return forms
      .map((form) => {
        const matchesSearch =
          form.form_name?.toLowerCase().includes(lowerSearch)

        const matchesTeam = teamFilter !== 'all' ? form.team_id?.id === teamFilter : true

        const selfMatches =
          matchesSearch && matchesTeam

        if (selfMatches) {
          return {
            ...form
          }
        }

        return null
      })
      .flat()
      .filter(Boolean)
  }

  const isSelectDataReady = indexTaskType.length && indexTeam.length && indexFolder.length && indexList.length

  const renderForms = (formList, level = 0) => {
    if (!isSelectDataReady) {
      return (
        <TableRow>
          <td colSpan={6}>
            <Skeleton className="w-full h-10" />
          </td>
        </TableRow>
      )
    }

    return formList.map((form) => (
      <Form
        key={form.id_form}
        level={level}
        form={form}
        fetchForms={fetchForms}
        renderForms={renderForms}
        forms={forms}
        setForms={setForms}
        selectData={{
          indexTaskType,
          indexTeam,
          indexFolder,
          indexList,
        }}
      />
    ))
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {
        (indexTaskType.length && indexTeam.length && indexFolder.length && indexList.length) ? (
          <FormCreateModalTrigger
            trigger={
              <Button variant="outline" size="sm">
                <Plus />
                Add
              </Button>
            }
            modalTitle="Create Form"
            modalSubtitle={''}
            fetchForms={fetchForms}
            selectData={{
              indexTaskType,
              indexTeam,
              indexFolder,
              indexList,
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        ) : (
          <Button variant="outline" size="sm" disabled>
            <Plus />
            Add
          </Button>
        )
      }

      <div className="flex gap-2 ">
        <Input
          type="text"
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="grow-1 h-10"
        />
        
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

      <div className="flex flex-1 w-full h-full">
        {formsLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ScrollArea type="always" className="w-1 flex-1 border rounded-md">
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
                    Form Name
                  </TableHead>
                  <TableHead className="p-2 min-w-[120px] bg-muted">Created</TableHead>
                  <TableHead className="p-2 min-w-[160px] bg-muted">Lists</TableHead>
                  <TableHead className="p-2 min-w-[120px] bg-muted">Task Type</TableHead>
                  <TableHead className="p-2 min-w-[190px] bg-muted">Team</TableHead>
                  <TableHead className="p-2 min-w-[100px] text-right bg-muted">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(indexTaskType && indexTeam && indexFolder && indexList)
                  ? filteredForms.map((form, idx) => (
                      <Form
                        key={form.id_form}
                        level={idx}
                        form={form}
                        fetchForms={fetchForms}
                        renderForms={renderForms}
                        forms={forms}
                        setForms={setForms}
                        selectData={{
                          indexTaskType,
                          indexTeam,
                          indexFolder,
                          indexList,
                        }}
                      />
                    ))
                  : (
                    <TableRow>
                      <td colSpan={6} className="text-center py-4 text-muted-foreground">
                        Loading reference data...
                      </td>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="w-full" />
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
