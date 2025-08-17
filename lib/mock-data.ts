// Mantendo apenas para referência de tipos - dados agora vêm do Supabase
export interface Collector {
  id: number
  numero_coletor: number
  numero_item: string
  numero_serie: string
  codigo: string
  status: "em-operacao" | "disponivel" | "manutencao"
  matricula_usuario?: number
  usuario?: {
    matricula: number
    nome: string
    turno: string
    funcao: string
  }
  created_at: string
  updated_at: string
}

export interface CollectorHistory {
  id: number
  numero_coletor: number
  matricula_usuario: number
  acao: "liberar" | "devolver"
  timestamp: string
  usuario?: {
    nome: string
  }
}

// Dados mockados removidos - agora usamos dados reais do Supabase
export const mockCollectors: Collector[] = []
export const mockHistory: CollectorHistory[] = []