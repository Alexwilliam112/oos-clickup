'use client'

import { AppSidebar } from './app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { workspaceService } from '@/service/index.mjs'

export default function Sidebar({ children }) {
  const {
    data: teamsData,
    isSuccess: teamsSuccess,
    isLoading: teamsLoading,
  } = useQuery({
    queryFn: workspaceService.getTeams,
    queryKey: ['workspaceService.getTeams'],
  })

  const {
    data: foldersData,
    isSuccess: foldersSuccess,
    isLoading: foldersLoading,
  } = useQuery({
    queryFn: workspaceService.getFolders,
    queryKey: ['workspaceService.getFolders'],
  })

  const {
    data: listData,
    isSuccess: listSuccess,
    isLoading: listLoading,
  } = useQuery({
    queryFn: workspaceService.getList,
    queryKey: ['workspaceService.getList'],
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
