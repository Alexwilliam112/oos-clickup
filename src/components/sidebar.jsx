"use client";

import * as React from "react";
import {
  ChevronDown,
  Inbox,
  Megaphone,
  Plus,
  Search,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function SidebarNav() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("Space");

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="gap-4 p-4 border-b border-muted-foreground">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Home</span>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sidebar..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="gap-0 p-4">
        <SidebarMenu>
          {/* My Tasks */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-3">
                <Inbox className="h-5 w-5" />
                <span className="text-sm font-medium">My Tasks</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Notifications */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-3">
                <Megaphone className="h-5 w-5" />
                <span className="text-sm font-medium">Notifications</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Team Space Section */}
        <SidebarMenuItem className="mt-6">
          <SidebarMenuButton asChild>
            <a href="#" className="flex items-center gap-3">
              <Avatar className="h-6 w-6 bg-blue-500 text-white">
                <AvatarFallback className="text-xs">T</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Team Space</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </a>
          </SidebarMenuButton>

          {/* Expandable Projects Folder */}
          <div className="ml-6 mt-2 border-l pl-4">
            <Collapsible className="w-full" defaultOpen>
              <CollapsibleTrigger asChild>
                <div className="flex items-center py-2 cursor-pointer">
                  <ChevronDown className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Projects</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200">
                      <Plus className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Project 1 */}
                <div className="py-2">
                  <a href="#" className="flex items-center gap-3 text-sm">
                    <div className="h-4 w-4 rounded-sm border border-muted-foreground"></div>
                    <span>Project 1</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      3
                    </span>
                  </a>
                </div>

                {/* Project 2 */}
                <div className="py-2">
                  <a href="#" className="flex items-center gap-3 text-sm">
                    <div className="h-4 w-4 rounded-sm border border-muted-foreground"></div>
                    <span>Project 2</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      3
                    </span>
                  </a>
                </div>

                {/* Project Notes */}
                <div className="py-2">
                  <a href="#" className="flex items-center gap-3 text-sm">
                    <div className="h-4 w-4 rounded-sm border border-muted-foreground"></div>
                    <span>Project Notes</span>
                  </a>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SidebarMenuItem>

        {/* Add New Space */}
        <SidebarMenuItem className="mt-6">
          <SidebarMenuButton asChild>
            <a
              href="#"
              className="flex items-center gap-3 text-muted-foreground"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">New Space</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
