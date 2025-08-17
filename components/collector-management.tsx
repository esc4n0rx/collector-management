"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { AddCollectorModal } from "@/components/add-collector-modal"
import { EditCollectorModal } from "@/components/edit-collector-modal"
import { buscarColetores, removerColetor } from "@/lib/supabase-collectors"
import type { ColetorCompleto } from "@/types/supabase"
import { toast } from "sonner"

const statusLabels = {
  "em-operacao": "Em Operação",
  disponivel: "Disponível",
  manutencao: "Manutenção",
}

const statusColors = {
  "em-operacao": "bg-accent text-accent-foreground",
  disponivel: "bg-green-500 text-white",
  manutencao: "bg-yellow-500 text-black",
}

export function CollectorManagement() {
  const [collectors, setCollectors] = useState<ColetorCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCollector, setEditingCollector] = useState<ColetorCompleto | null>(null)

  const carregarColetores = async () => {
    setLoading(true)
    const { data, error } = await buscarColetores()
    
    if (error) {
      toast.error("Erro ao carregar coletores", {
        description: error
      })
    } else if (data) {
      setCollectors(data)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    carregarColetores()
  }, [])

  const handleAddCollector = () => {
    setShowAddModal(false)
    carregarColetores()
    toast.success("Coletor adicionado com sucesso!")
  }

  const handleEditCollector = () => {
    setEditingCollector(null)
    carregarColetores()
    toast.success("Coletor atualizado com sucesso!")
  }

  const handleDeleteCollector = async (coletor: ColetorCompleto) => {
    if (!confirm(`Tem certeza que deseja remover o coletor #${coletor.numero_coletor}?`)) {
      return
    }

    const { success, error } = await removerColetor(coletor.id)
    
    if (success) {
      toast.success("Coletor removido com sucesso!")
      carregarColetores()
    } else {
      toast.error("Erro ao remover coletor", {
        description: error || "Erro desconhecido"
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-montserrat font-black text-foreground">Gerenciar Coletores</h1>
          <p className="text-muted-foreground mt-2">Adicione, edite e remova coletores do sistema</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Coletor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Coletores</CardTitle>
          <CardDescription>Total de {collectors.length} coletores cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuário Atual</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectors.map((collector) => (
                <TableRow key={collector.id}>
                  <TableCell className="font-medium">#{collector.numero_coletor}</TableCell>
                  <TableCell className="font-mono text-sm">{collector.numero_item}</TableCell>
                  <TableCell className="font-mono text-sm">{collector.numero_serie}</TableCell>
                  <TableCell className="font-mono text-sm">{collector.codigo}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[collector.status]}>{statusLabels[collector.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {collector.usuario ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{collector.usuario.nome}</span>
                        <span className="text-xs text-muted-foreground">Mat. {collector.usuario.matricula}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(collector.updated_at).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingCollector(collector)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCollector(collector)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCollectorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleAddCollector}
      />

      {editingCollector && (
        <EditCollectorModal
          open={!!editingCollector}
          onOpenChange={() => setEditingCollector(null)}
          collector={editingCollector}
          onSuccess={handleEditCollector}
        />
      )}
    </div>
  )
}