'use client'

import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { masterService } from '@/service/index.mjs'
import { useEffect } from 'react'

export function NavMain() {
  const {
    data: teamsData,
    isSuccess: teamsSuccess,
    isLoading: teamsLoading,
  } = useQuery({
    queryFn: masterService.getTeams,
    queryKey: ['masterService.getTeams'],
  })

  const {
    data: foldersData,
    isSuccess: foldersSuccess,
    isLoading: foldersLoading,
  } = useQuery({
    queryFn: masterService.getFolders,
    queryKey: ['masterService.getFolders'],
  })

  const {
    data: listData,
    isSuccess: listSuccess,
    isLoading: listLoading,
  } = useQuery({
    queryFn: masterService.getList,
    queryKey: ['masterService.getList'],
  })

  useEffect(() => {
    console.log(teamsData)
  }, [teamsData])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarMenu>
        {teamsData?.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.name}>
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {foldersData?.filter(f => f.).map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
