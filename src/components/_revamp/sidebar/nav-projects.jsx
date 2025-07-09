'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Bell, ClipboardPenLine } from 'lucide-react'
import { ListTodo } from 'lucide-react'
import { useUserStore } from '@/store/user/userStore'
import { useRouter, useSearchParams } from 'next/navigation'
import NotificationModal from '@/components/notifications/NotificationModal'

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
          <SidebarMenuButton
            asChild
            tooltip="My Tasks"
            onClick={() => navigateTo('my_tasks', userId)}
          >
            <span>
              <ListTodo />
              <span className="hover:text-blue-500 hover:cursor-pointer">My Tasks</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Notifications" 
            // onClick={() => navigateToNotif('notification', userId)}
          >
            <span>
              <Bell />
              {/* <span className="hover:text-blue-500 hover:cursor-pointer">Notifications</span> */}
            <NotificationModal/>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild tooltip="Custom-Forms"
            onClick={() => navigateTo('form', 'form')}
          >
            <span>
              <ClipboardPenLine />
              <span className="hover:text-blue-500 hover:cursor-pointer">Custom Forms</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
