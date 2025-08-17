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
import { atualizarColetor } from "@/lib/supabase-collectors"
import type { ColetorCompleto, ColetorStatus } from "@/types/supabase"
import { toast } from "sonner"

interface EditCollectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collector: ColetorCompleto
  onSuccess: () => void
}

export function EditCollectorModal({ open, onOpenChange, collector, onSuccess }: EditCollectorModalProps) {
  const [numeroColetor, setNumeroColetor] = useState(collector.numero_coletor.toString())
  const [numeroItem, setNumeroItem] = useState(collector.numero_item)
  const [numeroSerie, setNumeroSerie] = useState(collector.numero_serie)
  const [codigo, setCodigo] = useState(collector.codigo)
  const [status, setStatus] = useState<ColetorStatus>(collector.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setNumeroColetor(collector.numero_coletor.toString())
    setNumeroItem(collector.numero_item)
    setNumeroSerie(collector.numero_serie)
    setCodigo(collector.codigo)
    setStatus(collector.status)
    setError("")
  }, [collector])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validações
    if (!numeroColetor.trim() || !numeroItem.trim() || !numeroSerie.trim() || !codigo.trim()) {
      setError("Todos os campos são obrigatórios")
      setLoading(false)
      return
    }

    const numeroColetorInt = parseInt(numeroColetor.trim(), 10)
    if (isNaN(numeroColetorInt)) {
      setError("Número do coletor deve ser um número válido")
      setLoading(false)
      return
    }

    try {
      const updateData: any = {
        numero_coletor: numeroColetorInt,
        numero_item: numeroItem.trim(),
        numero_serie: numeroSerie.trim(),
        codigo: codigo.trim(),
        status
      }

      // Se o status mudou para não operação, remover usuário
      if (status !== 'em-operacao' && collector.status === 'em-operacao') {
        updateData.matricula_usuario = null
      }

      const { data, error: updateError } = await atualizarColetor(collector.id, updateData)

      if (updateError) {
        setError(updateError)
      } else {
        setError("")
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao atualizar coletor:", error)
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
          <DialogTitle>Editar Coletor</DialogTitle>
          <DialogDescription>Modifique as informações do coletor #{collector.numero_coletor}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-numero-coletor">Número do Coletor</Label>
              <Input
                id="edit-numero-coletor"
                type="number"
                value={numeroColetor}
                onChange={(e) => setNumeroColetor(e.target.value)}
                disabled={loading}
                className={error ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-numero-item">Número do Item</Label>
              <Input
                id="edit-numero-item"
                value={numeroItem}
                onChange={(e) => setNumeroItem(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-numero-serie">Número de Série</Label>
              <Input
                id="edit-numero-serie"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-codigo">Código</Label>
              <Input
                id="edit-codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-collector-status">Status</Label>
              <Select value={status} onValueChange={(value: ColetorStatus) => setStatus(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="em-operacao">Em Operação</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status !== 'em-operacao' && collector.status === 'em-operacao' && collector.usuario && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Alterar o status removerá o vínculo com o usuário {collector.usuario.nome} (Mat. {collector.usuario.matricula})
                </p>
              </div>
            )}
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