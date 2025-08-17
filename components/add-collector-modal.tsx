"use client"

import type React from "react"

import { useState } from "react"
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
import { criarColetor } from "@/lib/supabase-collectors"
import type { ColetorStatus } from "@/types/supabase"
import { toast } from "sonner"

interface AddCollectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddCollectorModal({ open, onOpenChange, onSuccess }: AddCollectorModalProps) {
  const [numeroColetor, setNumeroColetor] = useState("")
  const [numeroItem, setNumeroItem] = useState("")
  const [numeroSerie, setNumeroSerie] = useState("")
  const [codigo, setCodigo] = useState("")
  const [status, setStatus] = useState<ColetorStatus>("disponivel")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
      const { data, error: createError } = await criarColetor({
        numero_coletor: numeroColetorInt,
        numero_item: numeroItem.trim(),
        numero_serie: numeroSerie.trim(),
        codigo: codigo.trim(),
        status
      })

      if (createError) {
        setError(createError)
      } else {
        // Reset form
        setNumeroColetor("")
        setNumeroItem("")
        setNumeroSerie("")
        setCodigo("")
        setStatus("disponivel")
        setError("")
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao criar coletor:", error)
      setError("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      setNumeroColetor("")
      setNumeroItem("")
      setNumeroSerie("")
      setCodigo("")
      setStatus("disponivel")
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Coletor</DialogTitle>
          <DialogDescription>Preencha as informações do novo coletor para adicioná-lo ao sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numero-coletor">Número do Coletor</Label>
              <Input
                id="numero-coletor"
                type="number"
                placeholder="Ex: 1, 2, 3..."
                value={numeroColetor}
                onChange={(e) => setNumeroColetor(e.target.value)}
                disabled={loading}
                className={error ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero-item">Número do Item</Label>
              <Input
                id="numero-item"
                placeholder="Ex: DSSA-AWP5-BR"
                value={numeroItem}
                onChange={(e) => setNumeroItem(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
            <Label htmlFor="numero-serie">Número de Série</Label>
              <Input
                id="numero-serie"
                placeholder="Ex: 9NW9XXWMK5095"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                placeholder="Ex: 28155"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collector-status">Status Inicial</Label>
              <Select value={status} onValueChange={(value: ColetorStatus) => setStatus(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
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
                "Adicionar Coletor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}