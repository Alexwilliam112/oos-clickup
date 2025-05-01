"use client";

import {
  ArrowUpRight,
  ChevronDown,
  Clock,
  Cog,
  Expand,
  Filter,
  GripVertical,
  ListFilter,
  MoreHorizontal,
  Plus,
  RefreshCw,
} from "lucide-react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./tabs/overview";
import { Board } from "./tabs/board";
import { ListView } from "./tabs/list";

export function Dashboard() {
  return (
    <>
      <SidebarInset className="h-screen w-screen overflow-hidden">
        <header className="flex h-20 items-center border-b px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8 bg-blue-500 text-white">
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-medium">Team Space</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Marketing Division</span>
              </div>
            </div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="h-full w-full p-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="4"
                  y="4"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="4"
                  y="12"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="12"
                  y="4"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="12"
                  y="12"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Overview
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="4"
                  y="4"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="4"
                  y="12"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="12"
                  y="4"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  width="8"
                  height="8"
                  x="12"
                  y="12"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              General Info
            </TabsTrigger>
            <TabsTrigger value="board" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="2"
                  y1="10"
                  x2="22"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Board
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <ListFilter className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="18"
                  x="2"
                  y="3"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="2"
                  y1="9"
                  x2="22"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="7"
                  y1="3"
                  x2="7"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="17"
                  y1="3"
                  x2="17"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="board" className="overflow-x-auto h-full">
            <Board />
          </TabsContent>

          <TabsContent value="list">
            <ListView />
          </TabsContent>
        </Tabs>
      </SidebarInset>
    </>
  );
}
