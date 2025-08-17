"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { buscarColetores, liberarColetor, devolverColetores } from "@/lib/supabase-collectors"
import { verificarMatriculaExiste, buscarUsuarioPorMatricula } from "@/lib/supabase-users"
import { SuccessModal } from "@/components/success-modal"
import type { ColetorCompleto } from "@/types/supabase"
import { toast } from "sonner"

export function CollectorOperations() {
  const [collectors, setCollectors] = useState<ColetorCompleto[]>([])
  const [loadingCollectors, setLoadingCollectors] = useState(true)

  // Release collector state
  const [releaseCollectorId, setReleaseCollectorId] = useState("")
  const [releaseUserId, setReleaseUserId] = useState("")
  const [releaseMessage, setReleaseMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isReleasing, setIsReleasing] = useState(false)

  // Return collector state
  const [returnUserId, setReturnUserId] = useState("")
  const [returnMessage, setReturnMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isReturning, setIsReturning] = useState(false)

  // Success modals
  const [showReleaseSuccess, setShowReleaseSuccess] = useState(false)
  const [showReturnSuccess, setShowReturnSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)

  const carregarColetores = async () => {
    setLoadingCollectors(true)
    const { data, error } = await buscarColetores()
    
    if (error) {
      toast.error("Erro ao carregar coletores", {
        description: error
      })
    } else if (data) {
      setCollectors(data)
    }
    
    setLoadingCollectors(false)
  }

  useEffect(() => {
    carregarColetores()
  }, [])

  const handleReleaseCollector = async (e: React.FormEvent) => {
    e.preventDefault()
    setReleaseMessage(null)
    setIsReleasing(true)

    if (!releaseCollectorId.trim() || !releaseUserId.trim()) {
      setReleaseMessage({ type: "error", text: "Todos os campos são obrigatórios" })
      setIsReleasing(false)
      return
    }

    const numeroColetorInt = parseInt(releaseCollectorId.trim(), 10)
    const matriculaInt = parseInt(releaseUserId.trim(), 10)

    if (isNaN(numeroColetorInt) || isNaN(matriculaInt)) {
      setReleaseMessage({ type: "error", text: "Número do coletor e matrícula devem ser números válidos" })
      setIsReleasing(false)
      return
    }

    try {
      // Verificar se a matrícula existe e buscar dados do usuário
      const { existe, error: matriculaError } = await verificarMatriculaExiste(matriculaInt)
      
      if (matriculaError) {
        setReleaseMessage({ type: "error", text: matriculaError })
        setIsReleasing(false)
        return
      }

      if (!existe) {
        setReleaseMessage({ type: "error", text: "Matrícula não encontrada no sistema" })
        setIsReleasing(false)
        return
      }

      // Buscar dados completos do usuário
      const { data: usuarioData } = await buscarUsuarioPorMatricula(matriculaInt)

      // Liberar coletor
      const { success, error } = await liberarColetor(numeroColetorInt, matriculaInt)

      if (success) {
        // Limpar formulário
        setReleaseCollectorId("")
        setReleaseUserId("")
        setReleaseMessage(null)
        
        // Recarregar dados
        carregarColetores()
        
        // Preparar dados para o modal de sucesso
        setSuccessData({
          coletor: numeroColetorInt,
          usuario: {
            matricula: matriculaInt,
            nome: usuarioData?.nome
          }
        })
        
        // Mostrar modal de sucesso
        setShowReleaseSuccess(true)
        
        // Toast como backup
        toast.success("Coletor liberado com sucesso!")
      } else {
        setReleaseMessage({ type: "error", text: error || "Erro ao liberar coletor" })
      }
    } catch (error) {
      console.error("Erro na liberação:", error)
      setReleaseMessage({ type: "error", text: "Erro interno do servidor" })
    } finally {
      setIsReleasing(false)
    }
  }

  const handleReturnCollector = async (e: React.FormEvent) => {
    e.preventDefault()
    setReturnMessage(null)
    setIsReturning(true)

    if (!returnUserId.trim()) {
      setReturnMessage({ type: "error", text: "Matrícula do usuário é obrigatória" })
      setIsReturning(false)
      return
    }

    const matriculaInt = parseInt(returnUserId.trim(), 10)

    if (isNaN(matriculaInt)) {
      setReturnMessage({ type: "error", text: "Matrícula deve ser um número válido" })
      setIsReturning(false)
      return
    }

    try {
      // Buscar dados do usuário antes de devolver
      const { data: usuarioData } = await buscarUsuarioPorMatricula(matriculaInt)

      const { success, error, coletoresDevolvidos } = await devolverColetores(matriculaInt)

      if (success) {
        // Limpar formulário
        setReturnUserId("")
        setReturnMessage(null)
        
        // Recarregar dados
        carregarColetores()
        
        // Preparar dados para o modal de sucesso
        setSuccessData({
          coletores: coletoresDevolvidos,
          usuario: {
            matricula: matriculaInt,
            nome: usuarioData?.nome
          }
        })
        
        // Mostrar modal de sucesso
        setShowReturnSuccess(true)
        
        // Toast como backup
        toast.success("Coletores devolvidos com sucesso!")
      } else {
        setReturnMessage({ type: "error", text: error || "Erro ao devolver coletores" })
      }
    } catch (error) {
      console.error("Erro na devolução:", error)
      setReturnMessage({ type: "error", text: "Erro interno do servidor" })
    } finally {
      setIsReturning(false)
    }
  }

  const availableCollectors = collectors.filter((c) => c.status === "disponivel")
  const collectorsInUse = collectors.filter((c) => c.status === "em-operacao")

  if (loadingCollectors) {
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
      <div>
        <h1 className="text-3xl font-montserrat font-black text-foreground">Liberar / Devolver Coletor</h1>
        <p className="text-muted-foreground mt-2">Gerencie a liberação e devolução de coletores</p>
      </div>

      <Tabs defaultValue="release" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="release" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Liberar Coletor
          </TabsTrigger>
          <TabsTrigger value="return" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Devolver Coletor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="release" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-accent" />
                  Liberar Coletor
                </CardTitle>
                <CardDescription>Associe um coletor disponível a um usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReleaseCollector} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="release-collector-id">Número do Coletor</Label>
                    <Input
                      id="release-collector-id"
                      type="number"
                      placeholder="Ex: 1, 2, 3..."
                      value={releaseCollectorId}
                      onChange={(e) => setReleaseCollectorId(e.target.value)}
                      disabled={isReleasing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="release-user-id">Matrícula do Usuário</Label>
                    <Input
                      id="release-user-id"
                      type="number"
                      placeholder="Digite a matrícula"
                      value={releaseUserId}
                      onChange={(e) => setReleaseUserId(e.target.value)}
                      disabled={isReleasing}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isReleasing}>
                    {isReleasing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Liberando...
                      </>
                    ) : (
                      "Liberar Coletor"
                    )}
                  </Button>
                </form>

                {releaseMessage && (
                  <Alert
                    className={`mt-4 animate-in slide-in-from-top-2 duration-300 ${
                      releaseMessage.type === "error" ? "border-destructive" : "border-green-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {releaseMessage.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <AlertDescription>{releaseMessage.text}</AlertDescription>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coletores Disponíveis</CardTitle>
                <CardDescription>{availableCollectors.length} coletores prontos para liberação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableCollectors.length > 0 ? (
                    availableCollectors.map((collector) => (
                      <div
                        key={collector.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setReleaseCollectorId(collector.numero_coletor.toString())}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">#{collector.numero_coletor}</span>
                          <span className="text-xs text-muted-foreground">{collector.numero_item}</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Disponível</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">Nenhum coletor disponível</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="return" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5 text-accent" />
                  Devolver Coletor
                </CardTitle>
                <CardDescription>Remova o vínculo de um coletor com o usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReturnCollector} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="return-user-id">Matrícula do Usuário</Label>
                    <Input
                      id="return-user-id"
                      type="number"
                      placeholder="Digite a matrícula"
                      value={returnUserId}
                      onChange={(e) => setReturnUserId(e.target.value)}
                      disabled={isReturning}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isReturning}>
                    {isReturning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Devolvendo...
                      </>
                    ) : (
                      "Devolver Coletor(es)"
                    )}
                  </Button>
                </form>

                {returnMessage && (
                  <Alert
                    className={`mt-4 animate-in slide-in-from-top-2 duration-300 ${
                      returnMessage.type === "error" ? "border-destructive" : "border-green-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {returnMessage.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <AlertDescription>{returnMessage.text}</AlertDescription>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coletores em Operação</CardTitle>
                <CardDescription>{collectorsInUse.length} coletores atualmente em uso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {collectorsInUse.length > 0 ? (
                    collectorsInUse.map((collector) => (
                      <div
                        key={collector.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setReturnUserId(collector.matricula_usuario?.toString() || "")}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">#{collector.numero_coletor}</span>
                          <span className="text-xs text-muted-foreground">
                            {collector.usuario?.nome} - Mat. {collector.usuario?.matricula}
                          </span>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">Em Operação</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">Nenhum coletor em operação</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modais de Sucesso */}
      <SuccessModal
        open={showReleaseSuccess}
        onOpenChange={setShowReleaseSuccess}
        type="liberar"
        data={successData || { usuario: { matricula: 0 } }}
      />

      <SuccessModal
        open={showReturnSuccess}
        onOpenChange={setShowReturnSuccess}
        type="devolver"
        data={successData || { usuario: { matricula: 0 } }}
      />
    </div>
  )
}