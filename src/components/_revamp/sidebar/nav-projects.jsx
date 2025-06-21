"use client";

import { MoreHorizontal } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import Link from "next/link";
import { ListTodo } from "lucide-react";
import { useUserStore } from "@/store/user/userStore";
import { useEffect } from "react";

export function NavProjects() {
  const userId = useUserStore((state) => state.user_id);

  const navigateTo = (page, paramId) => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      const url = `/dashboard?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`;
      window.location.href = url; // Navigate to the constructed URL
    } else {
      console.error("workspace_id is missing in the query parameters.");
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:block">
      <SidebarGroupLabel>My Workspace</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="My Tasks">
            <a
              href="#"
              title={"My Tasks"}
              onClick={() => navigateTo("my_tasks", userId)} // Navigate to team
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
  );
}
