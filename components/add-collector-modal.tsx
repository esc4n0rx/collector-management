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
import type { Collector } from "@/lib/mock-data"

interface AddCollectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (collector: Omit<Collector, "lastUpdated">) => void
  existingIds: string[]
}

export function AddCollectorModal({ open, onOpenChange, onAdd, existingIds }: AddCollectorModalProps) {
  const [id, setId] = useState("")
  const [status, setStatus] = useState<Collector["status"]>("disponivel")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!id.trim()) {
      setError("ID do coletor é obrigatório")
      return
    }

    if (existingIds.includes(id.trim())) {
      setError("Este ID já existe")
      return
    }

    onAdd({
      id: id.trim(),
      status,
      ...(status === "em-operacao" ? {} : {}),
    })

    // Reset form
    setId("")
    setStatus("disponivel")
    setError("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setId("")
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
              <Label htmlFor="collector-id">ID do Coletor</Label>
              <Input
                id="collector-id"
                placeholder="Ex: 001, 002, 003..."
                value={id}
                onChange={(e) => setId(e.target.value)}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="collector-status">Status Inicial</Label>
              <Select value={status} onValueChange={(value: Collector["status"]) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Coletor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
