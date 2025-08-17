import { supabase } from './supabase'

export interface Usuario {
  matricula: number
  nome: string
  turno: string
  funcao: string
}

export interface NovoUsuario {
  nome: string
  turno: string
  funcao: string
  matricula?: number
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

/**
 * Busca todos os usuários
 */
export async function buscarUsuarios(): Promise<{ data: Usuario[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('matriculas')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Usuario[], error: null }
  } catch (error) {
    console.error('Erro na busca de usuários:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Cria um novo usuário
 */
export async function criarUsuario(dados: NovoUsuario): Promise<{ data: Usuario | null; error: string | null }> {
  try {
    let matriculaFinal = dados.matricula

    // Se não foi fornecida matrícula, gerar uma nova
    if (!matriculaFinal) {
      const { matricula, error } = await gerarMatriculaUnica()
      if (error || !matricula) {
        return { data: null, error: error || 'Erro ao gerar matrícula' }
      }
      matriculaFinal = matricula
    }

    // Verificar se a matrícula já existe
    const { data: existente } = await supabase
      .from('matriculas')
      .select('matricula')
      .eq('matricula', matriculaFinal)
      .single()

    if (existente) {
      return { data: null, error: 'Matrícula já existe no sistema' }
    }

    // Criar o usuário
    const { data, error } = await supabase
      .from('matriculas')
      .insert([{
        matricula: matriculaFinal,
        nome: dados.nome.trim(),
        turno: dados.turno,
        funcao: dados.funcao
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Usuario, error: null }
  } catch (error) {
    console.error('Erro na criação do usuário:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Atualiza um usuário existente
 */
export async function atualizarUsuario(
  matricula: number,
  dados: Partial<Omit<Usuario, 'matricula'>>
): Promise<{ data: Usuario | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('matriculas')
      .update(dados)
      .eq('matricula', matricula)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar usuário:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Usuario, error: null }
  } catch (error) {
    console.error('Erro na atualização do usuário:', error)
    return { data: null, error: 'Erro interno do servidor' }
  }
}

/**
 * Remove um usuário
 */
export async function removerUsuario(matricula: number): Promise<{ success: boolean; error: string | null }> {
  try {
    // Verificar se o usuário possui coletores em operação
    const { data: coletores } = await supabase
      .from('coletores')
      .select('numero_coletor')
      .eq('matricula_usuario', matricula)
      .eq('status', 'em-operacao')

    if (coletores && coletores.length > 0) {
      return { 
        success: false, 
        error: `Usuário não pode ser removido: possui ${coletores.length} coletor(es) em operação` 
      }
    }

    const { error } = await supabase
      .from('matriculas')
      .delete()
      .eq('matricula', matricula)

    if (error) {
      console.error('Erro ao remover usuário:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Erro na remoção do usuário:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}