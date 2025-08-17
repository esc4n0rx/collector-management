"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { AddCollectorModal } from "@/components/add-collector-modal"
import { EditCollectorModal } from "@/components/edit-collector-modal"
import { mockCollectors, type Collector } from "@/lib/mock-data"

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
  const [collectors, setCollectors] = useState<Collector[]>(mockCollectors)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCollector, setEditingCollector] = useState<Collector | null>(null)

  const handleAddCollector = (newCollector: Omit<Collector, "lastUpdated">) => {
    const collector: Collector = {
      ...newCollector,
      lastUpdated: new Date().toISOString(),
    }
    setCollectors([...collectors, collector])
    setShowAddModal(false)
  }

  const handleEditCollector = (updatedCollector: Collector) => {
    setCollectors(
      collectors.map((c) =>
        c.id === updatedCollector.id ? { ...updatedCollector, lastUpdated: new Date().toISOString() } : c,
      ),
    )
    setEditingCollector(null)
  }

  const handleDeleteCollector = (id: string) => {
    if (confirm("Tem certeza que deseja remover este coletor?")) {
      setCollectors(collectors.filter((c) => c.id !== id))
    }
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
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuário Atual</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectors.map((collector) => (
                <TableRow key={collector.id}>
                  <TableCell className="font-medium">#{collector.id}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[collector.status]}>{statusLabels[collector.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {collector.currentUser ? (
                      <span className="text-sm">Matrícula {collector.currentUser}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(collector.lastUpdated).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingCollector(collector)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCollector(collector.id)}
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
        onAdd={handleAddCollector}
        existingIds={collectors.map((c) => c.id)}
      />

      {editingCollector && (
        <EditCollectorModal
          open={!!editingCollector}
          onOpenChange={() => setEditingCollector(null)}
          collector={editingCollector}
          onEdit={handleEditCollector}
          existingIds={collectors.map((c) => c.id).filter((id) => id !== editingCollector.id)}
        />
      )}
    </div>
  )
}
