"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, ArrowRightLeft, BarChart3, Activity, Users } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: "manage" | "operations" | "reports" | "status" | "users") => void
}

const menuItems = [
  {
    id: "status" as const,
    label: "Status",
    icon: Activity,
  },
  {
    id: "manage" as const,
    label: "Gerenciar Coletores",
    icon: Package,
  },
  {
    id: "operations" as const,
    label: "Liberar / Devolver",
    icon: ArrowRightLeft,
  },
  {
    id: "users" as const,
    label: "Usuários",
    icon: Users,
  },
  {
    id: "reports" as const,
    label: "Relatórios",
    icon: BarChart3,
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-montserrat font-black text-sidebar-foreground">Sistema de Coletores</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeSection === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}