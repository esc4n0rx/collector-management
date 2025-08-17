import { supabase } from './supabase'

/**
 * Busca usuário por matrícula
 */
export async function buscarUsuarioPorMatricula(matricula: number): Promise<{
  data: { matricula: number; nome: string; turno: string; funcao: string } | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('matriculas')
      .select('*')
      .eq('matricula', matricula)
      .single()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Erro na busca do usuário:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Verifica se uma matrícula existe
 */
export async function verificarMatriculaExiste(matricula: number): Promise<{ existe: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('matriculas')
      .select('matricula')
      .eq('matricula', matricula)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao verificar matrícula:', error)
      return { existe: false, error: error.message }
    }

    return { existe: !!data, error: null }
  } catch (error) {
    console.error('Erro na verificação da matrícula:', error)
    return { existe: false, error: 'Erro interno do servidor' }
  }
}