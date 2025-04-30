import { ClickUpSidebar } from "@/components/clickup-sidebar"
import { Dashboard } from "@/components/dashboard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <ClickUpSidebar />
      <SidebarInset>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  )
}
