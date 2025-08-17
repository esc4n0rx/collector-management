"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Loader2, Search, UserPlus } from "lucide-react"
import { AddUserModal } from "@/components/add-user-modal"
import { EditUserModal } from "@/components/edit-user-modal"
import { buscarUsuarios, removerUsuario, type Usuario } from "@/lib/supabase-users-management"
import { toast } from "sonner"

const funcaoColors = {
  OPERADOR: "bg-blue-500 text-white",
  LIDER: "bg-accent text-accent-foreground",
  SUPERVISOR: "bg-purple-500 text-white",
  TERCEIRIZADO: "bg-orange-500 text-white",
}

const turnoColors = {
  "1º TURNO": "bg-green-500 text-white",
  "2º TURNO": "bg-yellow-500 text-black",
  "3º TURNO": "bg-red-500 text-white",
  "MADRUGADA": "bg-indigo-500 text-white",
}

export function UserManagement() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const carregarUsuarios = async () => {
    setLoading(true)
    const { data, error } = await buscarUsuarios()
    
    if (error) {
      toast.error("Erro ao carregar usuários", {
        description: error
      })
    } else if (data) {
      setUsuarios(data)
      setUsuariosFiltrados(data)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  // Filtrar usuários baseado no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsuariosFiltrados(usuarios)
    } else {
      const termo = searchTerm.toLowerCase()
      const filtrados = usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.matricula.toString().includes(termo) ||
        usuario.funcao.toLowerCase().includes(termo) ||
        usuario.turno.toLowerCase().includes(termo)
      )
      setUsuariosFiltrados(filtrados)
    }
  }, [searchTerm, usuarios])

  const handleAddUser = () => {
    setShowAddModal(false)
    carregarUsuarios()
    toast.success("Usuário adicionado com sucesso!")
  }

  const handleEditUser = () => {
    setEditingUser(null)
    carregarUsuarios()
    toast.success("Usuário atualizado com sucesso!")
  }

  const handleDeleteUser = async (usuario: Usuario) => {
    if (!confirm(`Tem certeza que deseja remover o usuário ${usuario.nome}?`)) {
      return
    }

    const { success, error } = await removerUsuario(usuario.matricula)
    
    if (success) {
      toast.success("Usuário removido com sucesso!")
      carregarUsuarios()
    } else {
      toast.error("Erro ao remover usuário", {
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

  const estatisticas = {
    total: usuarios.length,
    lideres: usuarios.filter(u => u.funcao === 'LIDER').length,
    operadores: usuarios.filter(u => u.funcao === 'OPERADOR').length,
    terceirizados: usuarios.filter(u => u.funcao === 'TERCEIRIZADO').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-montserrat font-black text-foreground">Gerenciar Usuários</h1>
          <p className="text-muted-foreground mt-2">Adicione, edite e remova usuários do sistema</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Líderes</CardTitle>
            <Badge className="bg-accent text-accent-foreground text-xs">{estatisticas.lideres}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.lideres}</div>
            <p className="text-xs text-muted-foreground">Com acesso ao sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operadores</CardTitle>
            <Badge className="bg-blue-500 text-white text-xs">{estatisticas.operadores}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.operadores}</div>
            <p className="text-xs text-muted-foreground">Funcionários internos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terceirizados</CardTitle>
            <Badge className="bg-orange-500 text-white text-xs">{estatisticas.terceirizados}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.terceirizados}</div>
            <p className="text-xs text-muted-foreground">Funcionários externos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                {usuariosFiltrados.length} de {usuarios.length} usuários
                {searchTerm && ` (filtrados por "${searchTerm}")`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                 placeholder="Buscar usuários..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-8 w-64"
               />
             </div>
           </div>
         </div>
       </CardHeader>
       <CardContent>
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Matrícula</TableHead>
               <TableHead>Nome</TableHead>
               <TableHead>Função</TableHead>
               <TableHead>Turno</TableHead>
               <TableHead className="text-right">Ações</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {usuariosFiltrados.map((usuario) => (
               <TableRow key={usuario.matricula}>
                 <TableCell className="font-mono font-medium">{usuario.matricula}</TableCell>
                 <TableCell className="font-medium">{usuario.nome}</TableCell>
                 <TableCell>
                   <Badge className={funcaoColors[usuario.funcao as keyof typeof funcaoColors]}>
                     {usuario.funcao}
                   </Badge>
                 </TableCell>
                 <TableCell>
                   <Badge 
                     variant="outline" 
                     className={turnoColors[usuario.turno as keyof typeof turnoColors]}
                   >
                     {usuario.turno}
                   </Badge>
                 </TableCell>
                 <TableCell className="text-right">
                   <div className="flex items-center justify-end gap-2">
                     <Button variant="ghost" size="sm" onClick={() => setEditingUser(usuario)}>
                       <Edit className="h-4 w-4" />
                     </Button>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleDeleteUser(usuario)}
                       className="text-destructive hover:text-destructive"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))}
             {usuariosFiltrados.length === 0 && (
               <TableRow>
                 <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                   {searchTerm ? "Nenhum usuário encontrado com os critérios de busca" : "Nenhum usuário cadastrado"}
                 </TableCell>
               </TableRow>
             )}
           </TableBody>
         </Table>
       </CardContent>
     </Card>

     <AddUserModal
       open={showAddModal}
       onOpenChange={setShowAddModal}
       onSuccess={handleAddUser}
     />

     {editingUser && (
       <EditUserModal
         open={!!editingUser}
         onOpenChange={() => setEditingUser(null)}
         usuario={editingUser}
         onSuccess={handleEditUser}
       />
     )}
   </div>
 )
}