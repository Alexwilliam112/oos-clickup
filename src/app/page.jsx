"use client";

import { ClickUpSidebar } from "@/components/clickup-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { templateService } from "@/service/index.mjs";
import { useQuery } from "@tanstack/react-query";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  const dataQuery = useQuery({
    queryKey: ["data"],
    queryFn: templateService.getSomething,
  });

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <ClickUpSidebar />

      {/* Main Content */}
      <SidebarInset>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
