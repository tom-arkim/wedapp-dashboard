"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings, Wrench, Database, Plus, LogOut, Activity, Users, Grid3X3 } from "lucide-react"
import { NotificationsDropdown } from "./notifications-dropdown"
import { ThemeToggle } from "./theme-toggle"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EquipmentOnboarding } from "./equipment-onboarding"
import { UserProfileModal } from "./user-profile-modal"
import { useRouter, usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddEquipment?: () => void
}

export function DashboardLayout({ children, onAddEquipment }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "overview":
        router.push("/")
        break
      case "equipment":
        router.push("/?tab=equipment")
        break
      case "maintenance":
        router.push("/maintenance")
        break
      case "monitoring":
        router.push("/monitoring")
        break
      case "users":
        router.push("/users")
        break
      case "data-logs":
        router.push("/?tab=data-logs")
        break
      case "generate-report":
        router.push("/?tab=generate-report")
        break
      default:
        break
    }
  }

  const handleAddEquipment = () => {
    if (onAddEquipment) {
      onAddEquipment()
    } else {
      setShowOnboarding(true)
    }
  }

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      path: "/",
    },
    {
      id: "equipment",
      label: "Equipment",
      icon: Wrench,
      path: "/?tab=equipment",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Settings,
      path: "/maintenance",
    },
    {
      id: "monitoring",
      label: "Monitoring",
      icon: Activity,
      path: "/monitoring",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/users",
    },
    {
      id: "data-logs",
      label: "Data Logs",
      icon: Database,
      path: "/?tab=data-logs",
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: BarChart3,
      path: "/?tab=generate-report",
    },
  ]

  const getActiveItem = () => {
    if (pathname === "/maintenance") return "maintenance"
    if (pathname === "/monitoring") return "monitoring"
    if (pathname === "/users") return "users"
    if (pathname === "/") {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search)
        const tab = urlParams.get("tab")
        return tab || "overview"
      }
      return "overview"
    }
    return "overview"
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full w-full">
          <Sidebar className="shrink-0">
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
                      isActive={getActiveItem() === item.id}
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

          <SidebarInset className="flex-1 min-w-0 overflow-hidden">
            <div className="flex h-full flex-col">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h1 className="text-lg font-semibold truncate">Industrial Equipment Dashboard</h1>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={handleAddEquipment}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                  <Button onClick={handleAddEquipment} variant="outline" size="sm" className="sm:hidden bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <NotificationsDropdown />
                  <ThemeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">John Doe</p>
                          <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("#")}>
                        <Grid3X3 className="mr-2 h-4 w-4" />
                        <span>Apps</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => console.log("Logging out...")}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-4">{children}</div>
              </main>
            </div>
          </SidebarInset>
        </div>

        {showOnboarding && (
          <EquipmentOnboarding
            onClose={() => setShowOnboarding(false)}
            onEquipmentAdded={() => {
              setShowOnboarding(false)
            }}
          />
        )}
        {showUserProfile && <UserProfileModal open={showUserProfile} onOpenChange={setShowUserProfile} />}
      </SidebarProvider>
    </div>
  )
}
