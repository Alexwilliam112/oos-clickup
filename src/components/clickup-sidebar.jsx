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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

        <div className="flex gap-1">
          {["Space", "Unread", "DMs"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "Space" && (
                <Avatar className="mr-1 h-4 w-4 bg-blue-500 text-white">
                  <AvatarFallback className="text-[10px]">T</AvatarFallback>
                </Avatar>
              )}
              {filter}
            </Button>
          ))}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Inbox className="h-4 w-4" />
                <span>Inbox</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Reply className="h-4 w-4" />
                <span>Replies</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Megaphone className="h-4 w-4" />
                <span>Posts</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <MessageSquareMore className="h-4 w-4" />
                <span>FollowUps</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Favorites Section */}
        <Collapsible className="w-full">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label">
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <span className="text-xs font-medium">Favorites</span>
                <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/label:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>{/* Favorites content would go here */}</SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Recents Section */}
        <Collapsible className="w-full" defaultOpen>
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label">
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <span className="text-xs font-medium">Recents</span>
                <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/label:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-sm border border-muted-foreground"></div>
                        <span>TESSS</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-sm border border-muted-foreground"></div>
                        <span>Task 2</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-sm border border-muted-foreground"></div>
                        <span>Project 1</span>
                        <span className="ml-auto text-xs text-muted-foreground">3</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}