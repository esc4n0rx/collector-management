import { supabase } from './supabase'
import type { ColetorCompleto, ColetorStatus, HistoricoOperacao } from '@/types/supabase'

/**
 * Busca todos os coletores com informações do usuário
 */
export async function buscarColetores(): Promise<{ data: ColetorCompleto[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('coletores')
      .select(`
        *,
        usuario:matriculas(matricula, nome, turno, funcao)
      `)
      .order('numero_coletor', { ascending: true })

    if (error) {
      console.error('Erro ao buscar coletores:', error)
      return { data: null, error: error.message }
    }

    return { data: data as ColetorCompleto[], error: null }
  } catch (error) {
    console.error('Erro na busca de coletores:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Busca coletor por número
 */
export async function buscarColetorPorNumero(numeroColetor: number): Promise<{ data: ColetorCompleto | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('coletores')
      .select(`
        *,
        usuario:matriculas(matricula, nome, turno, funcao)
      `)
      .eq('numero_coletor', numeroColetor)
      .single()

    if (error) {
      console.error('Erro ao buscar coletor:', error)
      return { data: null, error: error.message }
    }

    return { data: data as ColetorCompleto, error: null }
  } catch (error) {
    console.error('Erro na busca do coletor:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Cria um novo coletor
 */
export async function criarColetor(dados: {
  numero_coletor: number
  numero_item: string
  numero_serie: string
  codigo: string
  status?: ColetorStatus
}): Promise<{ data: ColetorCompleto | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('coletores')
      .insert([{
        ...dados,
        status: dados.status || 'disponivel'
      }])
      .select(`
        *,
        usuario:matriculas(matricula, nome, turno, funcao)
      `)
      .single()

    if (error) {
      console.error('Erro ao criar coletor:', error)
      return { data: null, error: error.message }
    }

    return { data: data as ColetorCompleto, error: null }
  } catch (error) {
    console.error('Erro na criação do coletor:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Atualiza um coletor
 */
export async function atualizarColetor(
  id: number,
  dados: Partial<{
    numero_coletor: number
    numero_item: string
    numero_serie: string
    codigo: string
    status: ColetorStatus
    matricula_usuario: number | null
  }>
): Promise<{ data: ColetorCompleto | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('coletores')
      .update({
        ...dados,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        usuario:matriculas(matricula, nome, turno, funcao)
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar coletor:', error)
      return { data: null, error: error.message }
    }

    return { data: data as ColetorCompleto, error: null }
  } catch (error) {
    console.error('Erro na atualização do coletor:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Remove um coletor
 */
export async function removerColetor(id: number): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('coletores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao remover coletor:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Erro na remoção do coletor:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

/**
 * Libera um coletor para um usuário
 */
export async function liberarColetor(numeroColetor: number, matriculaUsuario: number): Promise<{ success: boolean; error: string | null }> {
  try {
    // Verificar se o coletor existe e está disponível
    const { data: coletor, error: coletorError } = await buscarColetorPorNumero(numeroColetor)
    
    if (coletorError || !coletor) {
      return { success: false, error: 'Coletor não encontrado' }
    }

    if (coletor.status !== 'disponivel') {
      return { success: false, error: 'Coletor não está disponível para liberação' }
    }

    // Atualizar status do coletor
    const { error: updateError } = await supabase
      .from('coletores')
      .update({
        status: 'em-operacao',
        matricula_usuario: matriculaUsuario,
        updated_at: new Date().toISOString()
      })
      .eq('numero_coletor', numeroColetor)

    if (updateError) {
      console.error('Erro ao atualizar coletor:', updateError)
      return { success: false, error: updateError.message }
    }

    // Registrar no histórico
    const { error: historicoError } = await supabase
      .from('historico_coletores')
      .insert([{
        numero_coletor: numeroColetor,
        matricula_usuario: matriculaUsuario,
        acao: 'liberar'
      }])

    if (historicoError) {
      console.error('Erro ao registrar histórico:', historicoError)
      // Não falha a operação por causa do histórico
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Erro na liberação do coletor:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

/**
 * Devolve todos os coletores de um usuário
 */
export async function devolverColetores(matriculaUsuario: number): Promise<{ success: boolean; error: string | null; coletoresDevolvidos: number[] }> {
  try {
    // Buscar coletores do usuário
    const { data: coletores, error: buscaError } = await supabase
      .from('coletores')
      .select('numero_coletor')
      .eq('matricula_usuario', matriculaUsuario)
      .eq('status', 'em-operacao')

    if (buscaError) {
      console.error('Erro ao buscar coletores do usuário:', buscaError)
      return { success: false, error: buscaError.message, coletoresDevolvidos: [] }
    }

    if (!coletores || coletores.length === 0) {
      return { success: false, error: 'Nenhum coletor encontrado para esta matrícula', coletoresDevolvidos: [] }
    }

    const numerosColetores = coletores.map(c => c.numero_coletor)

    // Atualizar status dos coletores
    const { error: updateError } = await supabase
      .from('coletores')
      .update({
        status: 'disponivel',
        matricula_usuario: null,
        updated_at: new Date().toISOString()
      })
      .eq('matricula_usuario', matriculaUsuario)
      .eq('status', 'em-operacao')

    if (updateError) {
      console.error('Erro ao atualizar coletores:', updateError)
      return { success: false, error: updateError.message, coletoresDevolvidos: [] }
    }

    // Registrar no histórico
    for (const numeroColetor of numerosColetores) {
      const { error: historicoError } = await supabase
        .from('historico_coletores')
        .insert([{
          numero_coletor: numeroColetor,
          matricula_usuario: matriculaUsuario,
          acao: 'devolver'
        }])

      if (historicoError) {
        console.error('Erro ao registrar histórico:', historicoError)
        // Não falha a operação por causa do histórico
      }
    }

    return { success: true, error: null, coletoresDevolvidos: numerosColetores }
  } catch (error) {
    console.error('Erro na devolução dos coletores:', error)
    return { success: false, error: 'Erro interno do servidor', coletoresDevolvidos: [] }
  }
}

/**
 * Busca histórico de operações
 */
export async function buscarHistoricoOperacoes(limite = 50): Promise<{ data: HistoricoOperacao[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('historico_coletores')
      .select(`
        *,
        usuario:matriculas(nome)
      `)
      .order('timestamp', { ascending: false })
      .limit(limite)

    if (error) {
      console.error('Erro ao buscar histórico:', error)
      return { data: null, error: error.message }
    }

    return { data: data as HistoricoOperacao[], error: null }
  } catch (error) {
    console.error('Erro na busca do histórico:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}