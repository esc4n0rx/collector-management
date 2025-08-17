export interface Usuario {
    matricula: string
    nome: string
    turno: string
    funcao: string
  }
  
  export interface AuthResponse {
    success: boolean
    usuario?: Usuario
    error?: string
  }