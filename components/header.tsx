"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-montserrat font-semibold text-card-foreground">Centro de Distribuição</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Admin</span>
        </div>

        <Button variant="ghost" size="sm">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
