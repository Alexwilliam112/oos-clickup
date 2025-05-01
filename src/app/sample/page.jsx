"use client";

import { SidebarNav } from "@/components/sidebar";
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
    <div>
      {/* Main Content */}
      <div className="my-4 space-y-2">
        {dataQuery.isLoading ? (
          <p>Loading...</p>
        ) : dataQuery.data ? (
          dataQuery.data.data.map((d, index) => (
            <p key={index}>{JSON.stringify(d)}</p>
          ))
        ) : (
          <p>No data retrieved</p>
        )}
      </div>

      <Dashboard />
    </div>
  );
}
