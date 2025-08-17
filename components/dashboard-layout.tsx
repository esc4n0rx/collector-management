"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CollectorManagement } from "@/components/collector-management"
import { CollectorOperations } from "@/components/collector-operations"
import { Reports } from "@/components/reports"
import { Status } from "@/components/status"
import type { Usuario } from "@/types/auth"

type ActiveSection = "manage" | "operations" | "reports" | "status"

interface DashboardLayoutProps {
  currentUser: Usuario | null
}

export function DashboardLayout({ currentUser }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("status")

  const renderContent = () => {
    switch (activeSection) {
      case "manage":
        return <CollectorManagement />
      case "operations":
        return <CollectorOperations />
      case "reports":
        return <Reports />
      case "status":
        return <Status />
      default:
        return <Status />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}