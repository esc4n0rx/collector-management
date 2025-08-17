"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Shuffle } from "lucide-react"
import { criarUsuario, gerarMatriculaUnica, type NovoUsuario } from "@/lib/supabase-users-management"
import { toast } from "sonner"

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddUserModal({ open, onOpenChange, onSuccess }: AddUserModalProps) {
  const [nome, setNome] = useState("")
  const [turno, setTurno] = useState("")
  const [funcao, setFuncao] = useState("")
  const [matricula, setMatricula] = useState("")
  const [gerarMatriculaAuto, setGerarMatriculaAuto] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingMatricula, setLoadingMatricula] = useState(false)
  const [error, setError] = useState("")

  const handleGerarMatricula = async () => {
    setLoadingMatricula(true)
    const { matricula: novaMatricula, error } = await gerarMatriculaUnica()
    
    if (error) {
      toast.error("Erro ao gerar matrícula", { description: error })
    } else if (novaMatricula) {
      setMatricula(novaMatricula.toString())
      toast.success("Nova matrícula gerada com sucesso!")
    }
    
    setLoadingMatricula(false)
  }

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

    if (!gerarMatriculaAuto && !matricula.trim()) {
      setError("Matrícula é obrigatória quando não gerada automaticamente")
      setLoading(false)
      return
    }

    if (!gerarMatriculaAuto && isNaN(parseInt(matricula.trim(), 10))) {
      setError("Matrícula deve ser um número válido")
      setLoading(false)
      return
    }

    try {
      const dadosUsuario: NovoUsuario = {
        nome: nome.trim(),
        turno,
        funcao
      }

      if (!gerarMatriculaAuto) {
        dadosUsuario.matricula = parseInt(matricula.trim(), 10)
      }

      const { data, error: createError } = await criarUsuario(dadosUsuario)

      if (createError) {
        setError(createError)
      } else {
        // Reset form
        setNome("")
        setTurno("")
        setFuncao("")
        setMatricula("")
        setGerarMatriculaAuto(true)
        setError("")
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      setError("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      setNome("")
      setTurno("")
      setFuncao("")
      setMatricula("")
      setGerarMatriculaAuto(true)
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário no sistema. Para terceirizados, a matrícula pode ser gerada automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
                className={error ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select value={turno} onValueChange={setTurno} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
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
              <Label htmlFor="funcao">Função</Label>
              <Select value={funcao} onValueChange={setFuncao} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERADOR">Operador</SelectItem>
                  <SelectItem value="LIDER">Líder</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="TERCEIRIZADO">Terceirizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gerar-matricula"
                  checked={gerarMatriculaAuto}
                  onCheckedChange={(checked) => {
                    setGerarMatriculaAuto(!!checked)
                    if (checked) setMatricula("")
                  }}
                  disabled={loading}
                />
                <Label htmlFor="gerar-matricula" className="text-sm">
                  Gerar matrícula automaticamente
                </Label>
              </div>

              {!gerarMatriculaAuto && (
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <div className="flex gap-2">
                    <Input
                      id="matricula"
                      type="number"
                      placeholder="Digite a matrícula"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGerarMatricula}
                      disabled={loading || loadingMatricula}
                      className="gap-2"
                    >
                      {loadingMatricula ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Shuffle className="h-4 w-4" />
                      )}
                      Gerar
                    </Button>
                  </div>
                </div>
              )}
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
                  Criando...
                </>
              ) : (
                "Adicionar Usuário"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}