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
import { useSearchParams } from 'next/navigation'
import { Fragment } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

export default function Sidebar({ children }) {
  const params = useSearchParams()

  const workspace_id = params.get('workspace_id')
  const page = params.get('page')
  const param_id = params.get('param_id')

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['workspaceService.getPageInfo', { workspace_id, page, param_id }],
    queryFn: workspaceService.getPageInfo,
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 sticky top-0 bg-white items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-6" />
            <div className="flex items-center gap-2 min-w-36">
              {isLoading ? (
                <>
                  <Skeleton className="w-9 h-9 rounded-full shrink-0 aspect-square" />
                  <Skeleton className="w-full h-6" />
                </>
              ) : (
                <>
                  <Avatar className="h-9 w-9 bg-white-500 text-white">
                    <AvatarFallback className="bg-purple-700 text-sm">
                      {data?.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-base sm:text-lg font-medium">{data?.title}</h1>
                </>
              )}
            </div>

            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />

            {isLoading ? (
              <Skeleton className="w-[20ch] h-4" />
            ) : (
              <Breadcrumb>
                <BreadcrumbList>
                  {data?.path?.map((path, index) => (
                    <Fragment key={index}>
                      <BreadcrumbItem className="hidden md:block">
                        {index + 1 === data?.path.length ? (
                          <BreadcrumbPage
                            href={`/dashboard?workspace_id=${workspace_id}&page=${path.page}&param_id=${path.id}`}
                          >
                            {path.name}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={`/dashboard?workspace_id=${workspace_id}&page=${path.page}&param_id=${path.id}`}
                          >
                            {path.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index + 1 < data.path.length && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
