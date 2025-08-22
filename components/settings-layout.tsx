"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Settings, Building2, MapPin, Users, Key, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
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

interface SettingsLayoutProps {
  children: React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      id: "general",
      label: "General",
      icon: Settings,
      path: "/settings",
    },
    {
      id: "company",
      label: "Company Details",
      icon: Building2,
      path: "/settings/company",
    },
    {
      id: "locations",
      label: "Location Management",
      icon: MapPin,
      path: "/settings/locations",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/settings/users",
    },
    {
      id: "api-keys",
      label: "API Keys",
      icon: Key,
      path: "/settings/api-keys",
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const getActiveItem = () => {
    if (pathname === "/settings") return "general"
    if (pathname === "/settings/company") return "company"
    if (pathname === "/settings/locations") return "locations"
    if (pathname === "/settings/users") return "users"
    if (pathname === "/settings/api-keys") return "api-keys"
    return "general"
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full w-full">
          <Sidebar className="shrink-0">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-semibold">Settings</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
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
                <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div className="flex-1" />
              </header>

              <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scroll-smooth">
                  <div className="min-h-full">
                    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-12">{children}</div>
                  </div>
                </div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
