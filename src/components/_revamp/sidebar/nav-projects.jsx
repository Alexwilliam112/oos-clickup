'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { ListTodo } from 'lucide-react'
import { useUserStore } from '@/store/user/userStore'
import { useRouter, useSearchParams } from 'next/navigation'

export function NavProjects() {
  const userId = useUserStore((state) => state.user_id)
  const params = useSearchParams()
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  const navigateTo = (page, param_id) => {
    const workspace_id = params.get('workspace_id')

    if (workspace_id) {
      const url = `/dashboard?workspace_id=${workspace_id}&page=${page}&param_id=${param_id}`
      router.push(url)
      setOpenMobile(false)
    } else {
      console.error('workspace_id is missing in the query parameters.')
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:block">
      <SidebarGroupLabel>My Workspace</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="My Tasks">
            <a
              href="#"
              title={'My Tasks'}
              onClick={() => navigateTo('my_tasks', userId)} // Navigate to team
            >
              <ListTodo />
              <span>My Tasks</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Notifications">
            <Link href="/notifications">
              <Bell />
              <span>Notifications</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
