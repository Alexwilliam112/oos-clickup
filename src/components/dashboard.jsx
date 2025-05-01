"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter } from "lucide-react";
import { Overview } from "./tabs/overview";
import { Board } from "./tabs/board";
import { ListView } from "./tabs/list";
import { useSearchParams } from "next/navigation";

export function Dashboard() {
  const [title, setTitle] = useState("Team Space");
  const [subtitle, setSubtitle] = useState("Marketing Division");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPageInfo = async () => {
      const workspaceId = searchParams.get("workspace_id");
      const page = searchParams.get("page");
      const paramId = searchParams.get("param_id");

      if (workspaceId && page && paramId) {
        try {
          const response = await fetch(
            `https://api-oos.jojonomic.com/27414/clickup/v2/page-info?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
          );
          const data = await response.json();

          if (data.code === 200 && !data.error) {
            setTitle(data.data.title || "Page Title");
            setSubtitle(data.data.subtitle || "Path to Page");
          } else {
            console.error("Failed to fetch page info:", data.message);
          }
        } catch (error) {
          console.error("Error fetching page info:", error);
        }
      }
    };

    fetchPageInfo();
  }, [searchParams]);

  return (
    <SidebarInset className="h-screen w-screen overflow-hidden">
      <header className="flex h-20 items-center border-b px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 bg-blue-500 text-white">
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-medium">{title}</h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{subtitle}</span>
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
            General Info
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <ListFilter className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="board" className="gap-2">
            Board
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
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
  );
}
