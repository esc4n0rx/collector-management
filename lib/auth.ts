import { supabase } from './supabase'
import type { Usuario, AuthResponse } from '@/types/auth'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

/**
 * Autentica um usuário usando matrícula e senha
 */
export async function authenticateUser(matricula: string, senha: string): Promise<AuthResponse> {
  try {
    console.log('🔍 Iniciando autenticação para matrícula:', matricula)
    
    // Verificar se a senha está correta
    if (senha !== ADMIN_PASSWORD) {
      console.log('❌ Senha incorreta')
      return {
        success: false,
        error: 'Senha incorreta'
      }
    }

    // Converter matrícula para número (já que no banco é bigint)
    const matriculaNumber = parseInt(matricula, 10)
    
    if (isNaN(matriculaNumber)) {
      console.log('❌ Matrícula não é um número válido:', matricula)
      return {
        success: false,
        error: 'Matrícula deve ser um número válido'
      }
    }

    console.log('🔢 Matrícula convertida para número:', matriculaNumber)

    // Buscar usuário na tabela matriculas
    console.log('🔍 Executando consulta no Supabase...')
    const { data, error, count } = await supabase
      .from('matriculas')
      .select('*', { count: 'exact' })
      .eq('matricula', matriculaNumber)

    console.log('📊 Resultado da consulta:', { data, error, count })

    if (error) {
      console.error('❌ Erro do Supabase:', error)
      return {
        success: false,
        error: `Erro na consulta: ${error.message}`
      }
    }

    // Verificar se retornou dados
    if (!data || data.length === 0) {
      console.log('❌ Nenhum resultado encontrado para matrícula:', matriculaNumber)
      
      // Fazer uma busca mais ampla para debug
      console.log('🔍 Fazendo busca de debug...')
      const { data: debugData } = await supabase
        .from('matriculas')
        .select('matricula')
        .limit(5)
      
      console.log('📋 Primeiras 5 matrículas no banco:', debugData)
      
      return {
        success: false,
        error: 'Matrícula não encontrada'
      }
    }

    const usuario = data[0]
    console.log('👤 Usuário encontrado:', usuario)

    // Verificar se o usuário tem função de LIDER
    if (usuario.funcao !== 'LIDER') {
      console.log('❌ Usuário não é LIDER:', usuario.funcao)
      return {
        success: false,
        error: 'Acesso negado. Apenas líderes podem acessar o sistema.'
      }
    }

    // Mapear dados para o tipo Usuario
    const usuarioFormatado: Usuario = {
      matricula: usuario.matricula.toString(),
      nome: usuario.nome,
      turno: usuario.turno,
      funcao: usuario.funcao
    }

    console.log('✅ Autenticação bem-sucedida:', usuarioFormatado)

    return {
      success: true,
      usuario: usuarioFormatado
    }
  } catch (error) {
    console.error('💥 Erro na autenticação:', error)
    return {
      success: false,
      error: 'Erro interno do servidor. Tente novamente.'
    }
  }
}