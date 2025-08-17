"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { Usuario } from "@/types/auth"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)

  const handleLogin = (usuario: Usuario) => {
    setCurrentUser(usuario)
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <DashboardLayout currentUser={currentUser} />
}