"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter } from "lucide-react";
import { Overview } from "./tabs/overview";
import { Board } from "./tabs/board";
import { ListView } from "./tabs/list";

export function Dashboard() {
  const [title, setTitle] = useState("Team Space");
  const [subtitle, setSubtitle] = useState("Placeholder for subtitle");
  const [path, setPath] = useState([]);

  useEffect(() => {
    const fetchPageInfo = async () => {
      const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
      const params = new URLSearchParams(window.location.search);
      const workspaceId = params.get("workspace_id");
      const page = params.get("page");
      const paramId = params.get("param_id");

      if (workspaceId && page && paramId) {
        try {
          const response = await fetch(
            `${baseUrl}/page-info?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
          );
          const data = await response.json();

          if (data.code === 200 && !data.error) {
            setTitle(data.data.title || "Page Title");
            setSubtitle(data.data.subtitle || "Path to Page");
            setPath(data.data.path || "Placeholder for path");
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
              {path.map((item, index) => {
                const workspaceId = searchParams.get("workspace_id");
                const page = searchParams.get("page");
                const paramId = searchParams.get("param_id");
                if (index === path.length - 1) {
                  return (
                    <a
                      href={`/dashboard?workspace_id=${workspaceId}&page=${item.page}&param_id=${item.id}`}
                      className="text-muted-foreground hover:text-blue-500"
                      key={index}
                    >
                      {item.name}
                    </a>
                  );
                } else {
                  return (
                    <a
                      href={`/dashboard?workspace_id=${workspaceId}&page=${item.page}&param_id=${item.id}`}
                      className="text-muted-foreground hover:text-blue-500"
                      key={index}
                    >
                      {item.name} /
                    </a>
                  );
                }
              })}
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
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="6" height="18" rx="1" />
              <rect x="9" y="3" width="6" height="10" rx="1" />
              <rect x="16" y="3" width="6" height="14" rx="1" />
            </svg>
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
