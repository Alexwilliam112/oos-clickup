'use client'

import * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'

import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
// import { NavUser } from '@/components/nav-user'
// import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }) {
  const { open, openMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex w-full justify-center border bg-white rounded-md py-1 shadow">
          <img
            src={open || openMobile ? '/officeless_brand.png' : '/officeless_logo.png'}
            alt="officeless-logo"
            className="w-[80%] h-full object-contain"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects />
        <NavMain />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
