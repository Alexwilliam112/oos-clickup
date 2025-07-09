'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useState } from 'react'
import { Bell, ClipboardPenLine } from 'lucide-react'
import { ListTodo } from 'lucide-react'
import { useUserStore } from '@/store/user/userStore'
import { useRouter, useSearchParams } from 'next/navigation'
import NotificationModal from '@/components/notifications/NotificationModal'
import { notificationService } from '@/service/index.mjs'
import { useQuery } from '@tanstack/react-query'
import { useDashboardStore } from '@/store/task/task'

export function NavProjects() {
  
  const userId = useUserStore((state) => state.user_id)
  const params = useSearchParams()
  const router = useRouter()

  const workspace_id = params.get('workspace_id')
  const page = params.get('page')
  const param_id = params.get('param_id')
  const { setOpenMobile } = useSidebar()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const setTabValue = useDashboardStore((state) => state.setTabValue)
  
  const { isLoading } = useQuery({
    queryFn: () =>
      notificationService.getAll().then((data) => {
        setNotifications(data?.data || [])
        return data
      }),
    queryKey: ['notificationService.getAll', { isOpen }],
  })


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
            onClick={() => {
              setTabValue('list')
              setIsOpen(true)
            }}
          >
            <span className='hover:cursor-pointer'>
              <Bell />
              <span
                className="flex items-center hover:text-blue-500 hover:cursor-pointer"
              >
                <span className="text-sm">
                  Notifications
                  {notifications.filter((n) => !n.is_read).length > 0 && (
                    <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {notifications.filter((n) => !n.is_read).length}
                    </span>
                  )}
                </span>
              </span>
            </span>
          </SidebarMenuButton>
          <NotificationModal isOpen={isOpen} setIsOpen={setIsOpen} notifications={notifications} setNotifications={setNotifications} />
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
