"use client";

import * as React from "react";
import {
  ChevronDown,
  Hash,
  Inbox,
  Megaphone,
  MessageSquareMore,
  Plus,
  Reply,
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

export function ClickUpSidebar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("Space");

  return (
    <Sidebar>
      <SidebarHeader className="gap-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium">Home</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="primary" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sidebar..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Inbox className="h-4 w-4" />
                <span>My Tasks</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Megaphone className="h-4 w-4" />
                <span>Notifications</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Team Space Section */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="#" className="flex items-center">
              <Avatar className="mr-2 h-5 w-5 bg-blue-500 text-white">
                <AvatarFallback className="text-[10px]">T</AvatarFallback>
              </Avatar>
              <span>Team Space</span>
              <div className="ml-auto flex items-center gap-1">
                {/* Replace Button with a div to avoid nested <button> */}
                <div className="h-5 w-5 flex items-center justify-center rounded hover:bg-gray-200">
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            </a>
          </SidebarMenuButton>

          {/* Expandable Projects Folder */}
          <div className="ml-4 mt-1 border-l pl-3">
            <Collapsible className="w-full" defaultOpen>
              <CollapsibleTrigger asChild>
                <div className="flex items-center py-1 cursor-pointer">
                  <ChevronDown className="mr-1 h-3 w-3" />
                  <span className="text-sm">Projects</span>
                  <div className="ml-auto flex items-center gap-1">
                    {/* Replace Button with a div to avoid nested <button> */}
                    <div className="h-5 w-5 flex items-center justify-center rounded hover:bg-gray-200">
                      <Plus className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Project 1 */}
                <div className="ml-4 py-1">
                  <a href="#" className="flex items-center text-sm">
                    <div className="mr-2 h-3 w-3 rounded-sm border border-muted-foreground"></div>
                    <span>Project 1</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      3
                    </span>
                  </a>
                </div>

                {/* Project 2 */}
                <div className="ml-4 py-1">
                  <a href="#" className="flex items-center text-sm">
                    <div className="mr-2 h-3 w-3 rounded-sm border border-muted-foreground"></div>
                    <span>Project 2</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      3
                    </span>
                  </a>
                </div>

                {/* Project Notes */}
                <div className="ml-4 py-1">
                  <a href="#" className="flex items-center text-sm">
                    <div className="mr-2 h-3 w-3 rounded-sm border border-muted-foreground"></div>
                    <span>Project Notes</span>
                  </a>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="#" className="flex items-center text-muted-foreground">
              <Plus className="mr-2 h-4 w-4" />
              <span>New Space</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
