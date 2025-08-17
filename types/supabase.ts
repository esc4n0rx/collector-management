export interface Database {
    public: {
      Tables: {
        matriculas: {
          Row: {
            matricula: number
            nome: string
            turno: string
            funcao: string
          }
          Insert: {
            matricula: number
            nome: string
            turno: string
            funcao: string
          }
          Update: {
            matricula?: number
            nome?: string
            turno?: string
            funcao?: string
          }
        }
        coletores: {
          Row: {
            id: number
            numero_coletor: number
            numero_item: string
            numero_serie: string
            codigo: string
            status: 'disponivel' | 'em-operacao' | 'manutencao'
            matricula_usuario?: number
            created_at: string
            updated_at: string
          }
          Insert: {
            numero_coletor: number
            numero_item: string
            numero_serie: string
            codigo: string
            status?: 'disponivel' | 'em-operacao' | 'manutencao'
            matricula_usuario?: number
          }
          Update: {
            numero_coletor?: number
            numero_item?: string
            numero_serie?: string
            codigo?: string
            status?: 'disponivel' | 'em-operacao' | 'manutencao'
            matricula_usuario?: number
            updated_at?: string
          }
        }
        historico_coletores: {
          Row: {
            id: number
            numero_coletor: number
            matricula_usuario: number
            acao: 'liberar' | 'devolver'
            timestamp: string
          }
          Insert: {
            numero_coletor: number
            matricula_usuario: number
            acao: 'liberar' | 'devolver'
          }
          Update: {
            numero_coletor?: number
            matricula_usuario?: number
            acao?: 'liberar' | 'devolver'
            timestamp?: string
          }
        }
      }
    }
  }
  
  export type ColetorStatus = 'disponivel' | 'em-operacao' | 'manutencao'
  
  export interface ColetorCompleto {
    id: number
    numero_coletor: number
    numero_item: string
    numero_serie: string
    codigo: string
    status: ColetorStatus
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
  
  export interface HistoricoOperacao {
    id: number
    numero_coletor: number
    matricula_usuario: number
    acao: 'liberar' | 'devolver'
    timestamp: string
    usuario?: {
      nome: string
    }
  }