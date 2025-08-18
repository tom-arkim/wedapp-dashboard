"use client"

import { Monitoring } from "@/components/monitoring"
import { BarChart3, Settings, User, Wrench, Database, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function MonitoringPage() {
  const router = useRouter()

  const handleNavigation = (itemId: string) => {
    if (itemId === "maintenance") {
      router.push("/maintenance")
    } else if (itemId === "overview") {
      router.push("/")
    } else if (itemId === "monitoring") {
      // Already on monitoring page
      return
    }
  }

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      id: "equipment",
      label: "Equipment",
      icon: Wrench,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Settings,
    },
    {
      id: "monitoring",
      label: "Monitoring",
      icon: Activity,
    },
    {
      id: "data-logs",
      label: "Data Logs",
      icon: Database,
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: BarChart3,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="font-semibold">Industrial Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.id)}
                    isActive={item.id === "monitoring"}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <h1 className="text-xl font-semibold">Equipment Monitoring</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Monitoring />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
