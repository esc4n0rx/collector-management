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

/**
 * Gera uma nova matrícula única para terceirizados
 */
export async function gerarMatriculaUnica(): Promise<{ matricula: number | null; error: string | null }> {
  try {
    // Buscar a maior matrícula existente
    const { data, error } = await supabase
      .from('matriculas')
      .select('matricula')
      .order('matricula', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Erro ao buscar maior matrícula:', error)
      return { matricula: null, error: error.message }
    }

    // Se não há registros, começar com 90000 (faixa para terceirizados)
    const proximaMatricula = data && data.length > 0 ? data[0].matricula + 1 : 90000

    return { matricula: proximaMatricula, error: null }
  } catch (error) {
    console.error('Erro na geração de matrícula:', error)
    return { matricula: null, error: 'Erro interno do servidor' }
  }
}