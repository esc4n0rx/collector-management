"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import type { Usuario } from "@/types/auth"

interface HeaderProps {
  currentUser: Usuario | null
}

export function Header({ currentUser }: HeaderProps) {
  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    window.location.reload()
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-montserrat font-semibold text-card-foreground">Centro de Distribuição</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              {currentUser ? getInitials(currentUser.nome) : "US"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {currentUser?.nome || "Usuário"}
            </span>
            {currentUser && (
              <span className="text-xs text-muted-foreground">
                {currentUser.funcao} - {currentUser.turno}
              </span>
            )}
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}