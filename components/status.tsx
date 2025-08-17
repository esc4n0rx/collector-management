"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, CheckCircle, Wrench, Clock, Users, Activity } from "lucide-react"
import { mockCollectors, mockHistory } from "@/lib/mock-data"

export function Status() {
  const [collectors] = useState(mockCollectors)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const collectorsInOperation = collectors.filter((c) => c.status === "em-operacao")
  const collectorsAvailable = collectors.filter((c) => c.status === "disponivel")
  const collectorsInMaintenance = collectors.filter((c) => c.status === "manutencao")

  const totalCollectors = collectors.length
  const operationPercentage = (collectorsInOperation.length / totalCollectors) * 100
  const availablePercentage = (collectorsAvailable.length / totalCollectors) * 100
  const maintenancePercentage = (collectorsInMaintenance.length / totalCollectors) * 100

  const activeUsers = new Set(collectorsInOperation.map((c) => c.currentUser).filter(Boolean))

  const statusData = [
    {
      title: "Coletores em Operação",
      value: collectorsInOperation.length.toString(),
      description: "Atualmente em uso",
      icon: Package,
      color: "text-accent",
      percentage: operationPercentage,
      progressColor: "bg-accent",
    },
    {
      title: "Coletores Disponíveis",
      value: collectorsAvailable.length.toString(),
      description: "Prontos para uso",
      icon: CheckCircle,
      color: "text-green-500",
      percentage: availablePercentage,
      progressColor: "bg-green-500",
    },
    {
      title: "Coletores em Manutenção",
      value: collectorsInMaintenance.length.toString(),
      description: "Necessitam reparo",
      icon: Wrench,
      color: "text-yellow-500",
      percentage: maintenancePercentage,
      progressColor: "bg-yellow-500",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      message: `Coletor #${collectorsInOperation[0]?.id || "001"} liberado`,
      detail: `Matrícula ${collectorsInOperation[0]?.currentUser || "12345"} - há 5 minutos`,
      color: "bg-accent",
      time: "5 min",
    },
    {
      id: "2",
      message: "Coletor #007 devolvido",
      detail: "Matrícula 67890 - há 12 minutos",
      color: "bg-green-500",
      time: "12 min",
    },
    {
      id: "3",
      message: `Coletor #${collectorsInMaintenance[0]?.id || "015"} em manutenção`,
      detail: "Reportado há 1 hora",
      color: "bg-yellow-500",
      time: "1h",
    },
    {
      id: "4",
      message: "Sistema atualizado",
      detail: "Backup automático realizado",
      color: "bg-blue-500",
      time: "2h",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-montserrat font-black text-foreground">Status do Sistema</h1>
          <p className="text-muted-foreground mt-2">Visão geral dos coletores no centro de distribuição</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Atualizado em tempo real</div>
          <div className="text-lg font-mono font-semibold">{currentTime.toLocaleTimeString("pt-BR")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusData.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Utilização</span>
                    <span>{item.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Coletores</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollectors}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.size}</div>
            <p className="text-xs text-muted-foreground">Usando coletores agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Utilização</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationPercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Coletores em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações Hoje</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHistory.length + 5}</div>
            <p className="text-xs text-muted-foreground">Liberações e devoluções</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas operações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className={`w-2 h-2 ${activity.color} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Status</CardTitle>
            <CardDescription>Distribuição atual dos coletores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-accent" />
                  <span className="font-medium">Em Operação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent text-accent-foreground">{collectorsInOperation.length}</Badge>
                  <span className="text-sm text-muted-foreground">{operationPercentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Disponíveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">{collectorsAvailable.length}</Badge>
                  <span className="text-sm text-muted-foreground">{availablePercentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Wrench className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Em Manutenção</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-black">{collectorsInMaintenance.length}</Badge>
                  <span className="text-sm text-muted-foreground">{maintenancePercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
