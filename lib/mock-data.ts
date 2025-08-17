export interface Collector {
  id: string
  status: "em-operacao" | "disponivel" | "manutencao"
  currentUser?: string
  lastUpdated: string
}

export interface CollectorHistory {
  id: string
  collectorId: string
  userId: string
  action: "liberar" | "devolver"
  timestamp: string
}

export const mockCollectors: Collector[] = [
  {
    id: "001",
    status: "em-operacao",
    currentUser: "12345",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "002",
    status: "disponivel",
    lastUpdated: "2024-01-15T09:15:00Z",
  },
  {
    id: "003",
    status: "em-operacao",
    currentUser: "67890",
    lastUpdated: "2024-01-15T11:00:00Z",
  },
  {
    id: "004",
    status: "manutencao",
    lastUpdated: "2024-01-14T16:45:00Z",
  },
  {
    id: "005",
    status: "disponivel",
    lastUpdated: "2024-01-15T08:20:00Z",
  },
  {
    id: "006",
    status: "disponivel",
    lastUpdated: "2024-01-15T07:45:00Z",
  },
  {
    id: "007",
    status: "manutencao",
    lastUpdated: "2024-01-14T14:20:00Z",
  },
  {
    id: "008",
    status: "disponivel",
    lastUpdated: "2024-01-15T06:30:00Z",
  },
]

export const mockHistory: CollectorHistory[] = [
  {
    id: "1",
    collectorId: "001",
    userId: "12345",
    action: "liberar",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    collectorId: "007",
    userId: "67890",
    action: "devolver",
    timestamp: "2024-01-15T10:18:00Z",
  },
  {
    id: "3",
    collectorId: "003",
    userId: "67890",
    action: "liberar",
    timestamp: "2024-01-15T11:00:00Z",
  },
]
