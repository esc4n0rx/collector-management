"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { mockCollectors, type Collector } from "@/lib/mock-data"

export function CollectorOperations() {
  const [collectors, setCollectors] = useState<Collector[]>(mockCollectors)

  // Release collector state
  const [releaseCollectorId, setReleaseCollectorId] = useState("")
  const [releaseUserId, setReleaseUserId] = useState("")
  const [releaseMessage, setReleaseMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isReleasing, setIsReleasing] = useState(false)

  // Return collector state
  const [returnUserId, setReturnUserId] = useState("")
  const [returnMessage, setReturnMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isReturning, setIsReturning] = useState(false)

  const handleReleaseCollector = async (e: React.FormEvent) => {
    e.preventDefault()
    setReleaseMessage(null)
    setIsReleasing(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!releaseCollectorId.trim() || !releaseUserId.trim()) {
      setReleaseMessage({ type: "error", text: "Todos os campos são obrigatórios" })
      setIsReleasing(false)
      return
    }

    const collector = collectors.find((c) => c.id === releaseCollectorId.trim())

    if (!collector) {
      setReleaseMessage({ type: "error", text: "Coletor não encontrado" })
      setIsReleasing(false)
      return
    }

    if (collector.status !== "disponivel") {
      setReleaseMessage({ type: "error", text: "Coletor não está disponível para liberação" })
      setIsReleasing(false)
      return
    }

    // Update collector status
    setCollectors((prev) =>
      prev.map((c) =>
        c.id === releaseCollectorId.trim()
          ? {
              ...c,
              status: "em-operacao" as const,
              currentUser: releaseUserId.trim(),
              lastUpdated: new Date().toISOString(),
            }
          : c,
      ),
    )

    setReleaseMessage({
      type: "success",
      text: `Coletor #${releaseCollectorId} liberado para matrícula ${releaseUserId}`,
    })
    setReleaseCollectorId("")
    setReleaseUserId("")
    setIsReleasing(false)
  }

  const handleReturnCollector = async (e: React.FormEvent) => {
    e.preventDefault()
    setReturnMessage(null)
    setIsReturning(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!returnUserId.trim()) {
      setReturnMessage({ type: "error", text: "Matrícula do usuário é obrigatória" })
      setIsReturning(false)
      return
    }

    const userCollectors = collectors.filter((c) => c.currentUser === returnUserId.trim() && c.status === "em-operacao")

    if (userCollectors.length === 0) {
      setReturnMessage({ type: "error", text: "Nenhum coletor encontrado para esta matrícula" })
      setIsReturning(false)
      return
    }

    // Return all collectors for this user
    setCollectors((prev) =>
      prev.map((c) =>
        c.currentUser === returnUserId.trim() && c.status === "em-operacao"
          ? { ...c, status: "disponivel" as const, currentUser: undefined, lastUpdated: new Date().toISOString() }
          : c,
      ),
    )

    const collectorIds = userCollectors.map((c) => `#${c.id}`).join(", ")
    setReturnMessage({ type: "success", text: `Coletores ${collectorIds} devolvidos com sucesso` })
    setReturnUserId("")
    setIsReturning(false)
  }

  const availableCollectors = collectors.filter((c) => c.status === "disponivel")
  const collectorsInUse = collectors.filter((c) => c.status === "em-operacao")

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
                      placeholder="Ex: 001, 002, 003..."
                      value={releaseCollectorId}
                      onChange={(e) => setReleaseCollectorId(e.target.value)}
                      disabled={isReleasing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="release-user-id">Matrícula do Usuário</Label>
                    <Input
                      id="release-user-id"
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
                        onClick={() => setReleaseCollectorId(collector.id)}
                      >
                        <span className="font-medium">#{collector.id}</span>
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
                        onClick={() => setReturnUserId(collector.currentUser || "")}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">#{collector.id}</span>
                          <span className="text-xs text-muted-foreground">Matrícula {collector.currentUser}</span>
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
    </div>
  )
}
