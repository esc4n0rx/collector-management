"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Shield } from "lucide-react"
import { authenticateUser } from "@/lib/auth"
import type { Usuario } from "@/types/auth"
import { toast } from "sonner"

interface LoginFormProps {
  onLogin: (usuario: Usuario) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!matricula.trim() || !senha.trim()) {
      setError("Todos os campos são obrigatórios")
      setIsLoading(false)
      return
    }

    // Validar se matrícula é um número
    if (!/^\d+$/.test(matricula.trim())) {
      setError("Matrícula deve conter apenas números")
      setIsLoading(false)
      return
    }

    try {
      const response = await authenticateUser(matricula.trim(), senha)

      if (response.success && response.usuario) {
        // Exibir toast de boas-vindas
        toast.success(`Bem-vindo(a), ${response.usuario.nome}!`, {
          description: `${response.usuario.funcao} - Turno ${response.usuario.turno}`,
          duration: 4000,
        })

        // Chamar callback com dados do usuário
        onLogin(response.usuario)
      } else {
        setError(response.error || "Erro desconhecido")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      setError("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-accent" />
            <CardTitle className="text-2xl font-montserrat font-black">Sistema de Coletores</CardTitle>
          </div>
          <CardDescription>
            Acesso restrito a líderes do centro de distribuição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                type="number"
                placeholder="Digite sua matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            {error && (
              <Alert className="border-destructive animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando acesso...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <Shield className="h-3 w-3 inline mr-1" />
              Apenas usuários com função de LÍDER podem acessar
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}