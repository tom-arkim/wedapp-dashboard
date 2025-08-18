"use client"

import { UserManagement } from "@/components/user-management"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  )
}
