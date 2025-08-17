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
import type { Collector } from "@/lib/mock-data"

interface EditCollectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collector: Collector
  onEdit: (collector: Collector) => void
  existingIds: string[]
}

export function EditCollectorModal({ open, onOpenChange, collector, onEdit, existingIds }: EditCollectorModalProps) {
  const [id, setId] = useState(collector.id)
  const [status, setStatus] = useState<Collector["status"]>(collector.status)
  const [currentUser, setCurrentUser] = useState(collector.currentUser || "")
  const [error, setError] = useState("")

  useEffect(() => {
    setId(collector.id)
    setStatus(collector.status)
    setCurrentUser(collector.currentUser || "")
    setError("")
  }, [collector])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!id.trim()) {
      setError("ID do coletor é obrigatório")
      return
    }

    if (id.trim() !== collector.id && existingIds.includes(id.trim())) {
      setError("Este ID já existe")
      return
    }

    onEdit({
      ...collector,
      id: id.trim(),
      status,
      currentUser: status === "em-operacao" && currentUser ? currentUser : undefined,
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Coletor</DialogTitle>
          <DialogDescription>Modifique as informações do coletor #{collector.id}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-collector-id">ID do Coletor</Label>
              <Input
                id="edit-collector-id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-collector-status">Status</Label>
              <Select value={status} onValueChange={(value: Collector["status"]) => setStatus(value)}>
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
            {status === "em-operacao" && (
              <div className="space-y-2">
                <Label htmlFor="edit-current-user">Usuário Atual (Matrícula)</Label>
                <Input
                  id="edit-current-user"
                  placeholder="Digite a matrícula do usuário"
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
