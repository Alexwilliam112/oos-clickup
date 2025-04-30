import { ClickUpSidebar } from "@/components/clickup-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <ClickUpSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-xl font-semibold">ClickUp Clone</h1>
        </header>
        <main className="p-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Welcome to your ClickUp Clone</h2>
            <p className="mt-2 text-muted-foreground">
              This is a simplified clone of the ClickUp sidebar using shadcn/ui components.
            </p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
