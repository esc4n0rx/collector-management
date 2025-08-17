"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts"
import { ArrowRight, ArrowLeft, Calendar, TrendingUp, Loader2 } from "lucide-react"
import { buscarHistoricoOperacoes } from "@/lib/supabase-collectors"
import type { HistoricoOperacao } from "@/types/supabase"
import { toast } from "sonner"

const actionLabels = {
  liberar: "Liberação",
  devolver: "Devolução",
}

const actionIcons = {
  liberar: ArrowRight,
  devolver: ArrowLeft,
}

const actionColors = {
  liberar: "bg-accent text-accent-foreground",
  devolver: "bg-green-500 text-white",
}

const chartConfig = {
  liberacoes: {
    label: "Liberações",
    color: "#3b82f6", // Blue
  },
  devolucoes: {
    label: "Devoluções",
    color: "#10b981", // Green
  },
  total: {
    label: "Total",
    color: "#8b5cf6", // Purple
  },
}

export function Reports() {
  const [historico, setHistorico] = useState<HistoricoOperacao[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyUsageData, setDailyUsageData] = useState<any[]>([])

  const carregarDados = async () => {
    setLoading(true)
    
    const { data, error } = await buscarHistoricoOperacoes(100) // Buscar mais dados para os gráficos
    
    if (error) {
      toast.error("Erro ao carregar relatórios", {
        description: error
      })
    } else if (data) {
      setHistorico(data)
      processarDadosGraficos(data)
    }
    
    setLoading(false)
  }

  const processarDadosGraficos = (data: HistoricoOperacao[]) => {
    // Agrupar por data
    const dadosPorData = new Map<string, { liberacoes: number; devolucoes: number }>()
    
    // Últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const data = new Date()
      data.setDate(data.getDate() - i)
      const dataStr = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      dadosPorData.set(dataStr, { liberacoes: 0, devolucoes: 0 })
    }

    // Contar operações por data
    data.forEach(item => {
      const dataItem = new Date(item.timestamp)
      const dataStr = dataItem.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      
      if (dadosPorData.has(dataStr)) {
        const dados = dadosPorData.get(dataStr)!
        if (item.acao === 'liberar') {
          dados.liberacoes++
        } else {
          dados.devolucoes++
        }
      }
    })

    // Converter para array para o gráfico
    const dadosGrafico = Array.from(dadosPorData.entries()).map(([date, dados]) => ({
      date,
      liberacoes: dados.liberacoes,
      devolucoes: dados.devolucoes,
      total: dados.liberacoes + dados.devolucoes
    }))

    setDailyUsageData(dadosGrafico)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  // Calcular estatísticas de hoje
  const hoje = new Date()
  const operacoesHoje = historico.filter(item => {
    const dataItem = new Date(item.timestamp)
    return dataItem.toDateString() === hoje.toDateString()
  })

  const liberacoesHoje = operacoesHoje.filter(item => item.acao === 'liberar').length
  const devolucoesHoje = operacoesHoje.filter(item => item.acao === 'devolver').length
  const totalHoje = operacoesHoje.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-montserrat font-black text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-2">Visualize gráficos e histórico de uso dos coletores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Uso Diário dos Coletores
            </CardTitle>
            <CardDescription>Liberações e devoluções nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyUsageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
                  />
                  <Bar
                    dataKey="liberacoes"
                    fill={chartConfig.liberacoes.color}
                    radius={[4, 4, 0, 0]}
                    name="Liberações"
                    animationDuration={1000}
                    animationBegin={0}
                  />
                  <Bar
                    dataKey="devolucoes"
                    fill={chartConfig.devolucoes.color}
                    radius={[4, 4, 0, 0]}
                    name="Devoluções"
                    animationDuration={1000}
                    animationBegin={200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Tendência de Operações
            </CardTitle>
            <CardDescription>Total de operações por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.total.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartConfig.total.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: chartConfig.total.color, strokeWidth: 1, strokeDasharray: "5 5" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={chartConfig.total.color}
                    strokeWidth={3}
                    dot={{
                      fill: chartConfig.total.color,
                      strokeWidth: 2,
                      r: 5,
                      stroke: "hsl(var(--background))",
                    }}
                    activeDot={{
                      r: 7,
                      stroke: chartConfig.total.color,
                      strokeWidth: 2,
                      fill: "hsl(var(--background))",
                    }}
                    name="Total de Operações"
                    animationDuration={1500}
                    animationBegin={0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Operações</CardTitle>
          <CardDescription>Registro completo de todas as liberações e devoluções realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Coletor</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.slice(0, 20).map((record) => {
                const ActionIcon = actionIcons[record.acao]
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {new Date(record.timestamp).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">#{record.numero_coletor}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{record.usuario?.nome || 'Usuário'}</span>
                        <span className="text-xs text-muted-foreground">Mat. {record.matricula_usuario}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[record.acao]}>
                        <ActionIcon className="h-3 w-3 mr-1" />
                        {actionLabels[record.acao]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Operações Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoje}</div>
            <p className="text-xs text-muted-foreground">Liberações e devoluções</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liberações Hoje</CardTitle>
            <ArrowRight className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liberacoesHoje}</div>
            <p className="text-xs text-muted-foreground">Coletores liberados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoluções Hoje</CardTitle>
            <ArrowLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devolucoesHoje}</div>
            <p className="text-xs text-muted-foreground">Coletores devolvidos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}