"use client";
import {
  ArrowUpRight,
  ChevronDown,
  Clock,
  Cog,
  Expand,
  ExternalLink,
  Filter,
  Folder,
  GripVertical,
  Link,
  ListFilter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Dashboard() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-20 items-center border-b px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="mr-2" />
          <Avatar className="h-8 w-8 bg-blue-500 text-white">
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium">Team Space</h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Public</span>
              <span>•</span>
              <span>Space</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center border-b px-6 py-2">
        <Tabs defaultValue="overview" className="w-full">
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
            <TabsTrigger value="gantt" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="16"
                  x="2"
                  y="4"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="6"
                  y1="8"
                  x2="14"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="10"
                  y1="12"
                  x2="18"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="8"
                  y1="16"
                  x2="16"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Gantt
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="16"
                  x="2"
                  y="4"
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
                  x1="8"
                  y1="4"
                  x2="8"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Table
            </TabsTrigger>
            <Button variant="ghost" size="sm" className="ml-auto gap-1">
              <Plus className="h-3 w-3" />
              View
            </Button>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between border-b px-6 py-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add card
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Card */}
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Recent</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Projects</span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        • in Team Space
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Link className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Project 1</span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        • in Projects
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Link className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Project 2</span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        • in Projects
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Link className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Docs Card */}
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Docs</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="No docs"
                className="mb-4 h-24 w-24 opacity-50"
              />
              <p className="text-sm text-muted-foreground">
                You haven't added any Docs to this location.
              </p>
            </CardContent>
          </Card>

          {/* Bookmarks Card */}
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Bookmarks</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="No bookmarks"
                className="mb-4 h-24 w-24 opacity-50"
              />
              <p className="text-sm text-muted-foreground">
                Bookmarks are the easiest way to save ClickUp items or URLs from
                anywhere on the web
              </p>
              <Button variant="primary" size="sm" className="mt-4">
                Add Bookmark
              </Button>
            </CardContent>
          </Card>

          {/* Folders Card */}
          <Card className="col-span-12">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Folders</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <Button variant="ghost" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Folder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lists Card */}
          <Card className="col-span-12">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Lists</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <Button variant="ghost" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Card */}
          <Card className="col-span-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Resources</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <Button variant="ghost" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workload by Status Card */}
          <Card className="col-span-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Workload by Status</h3>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Refreshed May 1, 2025 at 12:27 am
                </Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Expand className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Cog className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center">
                <div className="h-32 w-32 rounded-full border-8 border-gray-200">
                  <div className="relative h-full w-full">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-blue-500"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-green-500"
                      style={{
                        clipPath: "polygon(100% 0, 100% 100%, 50% 100%, 50% 0)",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-yellow-500"
                      style={{
                        clipPath:
                          "polygon(50% 100%, 100% 100%, 0 100%, 0 50%, 50% 50%)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className }) {
  return (
    <Button variant="ghost" size="icon" className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
    </Button>
  );
}
