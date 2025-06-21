'use client'

import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { workspaceService } from '@/service'
import { useEffect } from 'react'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { Folder } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

export function NavMain() {
  const router = useRouter()
  const { setOpen, setOpenMobile } = useSidebar()

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

  const navigateTo = (page, param_id) => {
    const params = new URLSearchParams(window.location.search)
    const workspace_id = params.get('workspace_id')

    if (workspace_id) {
      const url = `/dashboard?workspace_id=${workspace_id}&page=${page}&param_id=${param_id}`
      router.push(url)
      setOpen(false)
      setOpenMobile(false)
    } else {
      console.error('workspace_id is missing in the query parameters.')
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarMenu>
        {teamsData?.map((team) => (
          <Collapsible
            key={team.name}
            asChild
            defaultOpen={team.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={team.name}>
                  <Users />
                  <span onClick={() => navigateTo('team', team.id_team)}>{team.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {foldersData
                    ?.filter((f) => f.team_id === team.id_team)
                    .map((subItem) => (
                      <Collapsible className="group/subcollapsible" key={subItem.name}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton>
                            <span>{subItem.name}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/subcollapsible:rotate-180" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {listData
                              ?.filter((list) => list.folder_id === subItem.id_folder)
                              .map((grandChild) => (
                                <SidebarMenuSubItem key={grandChild.name}>
                                  <SidebarMenuSubButton asChild>
                                    <span>{grandChild.name}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}

        {teamsLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
