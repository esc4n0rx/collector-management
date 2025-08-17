"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts"
import { mockHistory, type CollectorHistory } from "@/lib/mock-data"
import { ArrowRight, ArrowLeft, Calendar, TrendingUp } from "lucide-react"

const dailyUsageData = [
  { date: "15/01", liberacoes: 8, devolucoes: 6, total: 14 },
  { date: "16/01", liberacoes: 12, devolucoes: 10, total: 22 },
  { date: "17/01", liberacoes: 15, devolucoes: 13, total: 28 },
  { date: "18/01", liberacoes: 9, devolucoes: 11, total: 20 },
  { date: "19/01", liberacoes: 18, devolucoes: 16, total: 34 },
  { date: "20/01", liberacoes: 14, devolucoes: 12, total: 26 },
  { date: "21/01", liberacoes: 11, devolucoes: 9, total: 20 },
]

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

export function Reports() {
  const extendedHistory: CollectorHistory[] = [
    ...mockHistory,
    {
      id: "4",
      collectorId: "005",
      userId: "11111",
      action: "liberar",
      timestamp: "2024-01-15T09:45:00Z",
    },
    {
      id: "5",
      collectorId: "002",
      userId: "22222",
      action: "devolver",
      timestamp: "2024-01-15T08:30:00Z",
    },
    {
      id: "6",
      collectorId: "008",
      userId: "33333",
      action: "liberar",
      timestamp: "2024-01-15T07:15:00Z",
    },
    {
      id: "7",
      collectorId: "004",
      userId: "44444",
      action: "devolver",
      timestamp: "2024-01-14T18:20:00Z",
    },
    {
      id: "8",
      collectorId: "006",
      userId: "55555",
      action: "liberar",
      timestamp: "2024-01-14T16:10:00Z",
    },
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

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
              {extendedHistory.map((record) => {
                const ActionIcon = actionIcons[record.action]
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
                      <span className="font-mono">#{record.collectorId}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">Matrícula {record.userId}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[record.action]}>
                        <ActionIcon className="h-3 w-3 mr-1" />
                        {actionLabels[record.action]}
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
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liberações Hoje</CardTitle>
            <ArrowRight className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">Coletores liberados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoluções Hoje</CardTitle>
            <ArrowLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">Coletores devolvidos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
