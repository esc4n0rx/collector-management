"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { atualizarUsuario, type Usuario } from "@/lib/supabase-users-management"
import { toast } from "sonner"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario
  onSuccess: () => void
}

export function EditUserModal({ open, onOpenChange, usuario, onSuccess }: EditUserModalProps) {
  const [nome, setNome] = useState(usuario.nome)
  const [turno, setTurno] = useState(usuario.turno)
  const [funcao, setFuncao] = useState(usuario.funcao)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setNome(usuario.nome)
    setTurno(usuario.turno)
    setFuncao(usuario.funcao)
    setError("")
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validações
    if (!nome.trim() || !turno || !funcao) {
      setError("Nome, turno e função são obrigatórios")
      setLoading(false)
      return
    }

    try {
      const { data, error: updateError } = await atualizarUsuario(usuario.matricula, {
        nome: nome.trim(),
        turno,
        funcao
      })

      if (updateError) {
        setError(updateError)
      } else {
        setError("")
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      setError("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Modifique as informações do usuário {usuario.nome} (Mat. {usuario.matricula}).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome Completo</Label>
              <Input
                id="edit-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
                className={error ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-turno">Turno</Label>
              <Select value={turno} onValueChange={setTurno} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1º TURNO">1º Turno</SelectItem>
                  <SelectItem value="2º TURNO">2º Turno</SelectItem>
                  <SelectItem value="3º TURNO">3º Turno</SelectItem>
                  <SelectItem value="MADRUGADA">Madrugada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-funcao">Função</Label>
              <Select value={funcao} onValueChange={setFuncao} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERADOR">Operador</SelectItem>
                  <SelectItem value="LIDER">Líder</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="TERCEIRIZADO">Terceirizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Matrícula:</strong> {usuario.matricula} (não pode ser alterada)
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}