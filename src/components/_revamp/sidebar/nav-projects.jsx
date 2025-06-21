'use client'

import { MoreHorizontal } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Bell } from 'lucide-react'
import Link from 'next/link'

export function NavProjects() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:block">
      <SidebarGroupLabel>My Workspace</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="My Tasks">
            <Link href="/notifications">
              <Bell />
              <span>My Tasks</span>
            </Link>
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
