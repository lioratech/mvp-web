'use server';

import { revalidatePath } from 'next/cache';

import { getLogger } from '@kit/shared/logger';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function createPayrollAction(accountId: string) {
  const client = getSupabaseServerClient();

  try {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomYear = 2024;
    // Gerar CNPJ com 14 dígitos (formato: 12345678000190)
    const randomCnpj = `${Math.floor(10000000 + Math.random() * 90000000)}${Math.floor(100000 + Math.random() * 900000)}`;

    const { data, error } = await client
      .from('payrolls')
      .insert({
        account_id: accountId,
        month: randomMonth,
        year: randomYear,
        cnpj: randomCnpj,
        filial: `Filial ${Math.floor(Math.random() * 10) + 1}`,
        is_current: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar folha: ${error.message}`);
    }

    // Revalidar o cache da página
    revalidatePath('/home/[account]/uploads/lists');

    return {
      success: true,
      data,
      message: 'Folha criada com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao criar folha:', error);
    throw error;
  }
}

export async function deletePayrollAction(
  payrollId: string,
  accountId: string,
) {
  const client = getSupabaseServerClient();
  const logger = await getLogger();

  try {
    logger.info(
      { payrollId, accountId },
      'Iniciando processo de exclusão da folha',
    );

    // 1. Deletar dados do MySQL primeiro
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payroll/delete`;

    logger.info({ payrollId, accountId, apiUrl }, 'Chamando API de exclusão');

    // Obter cookies de autenticação e CSRF token
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const csrfToken = cookieStore.get('csrf-token')?.value || '';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({
        accountId,
        platformId: payrollId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(
        { payrollId, accountId, status: response.status, error: errorData },
        'Erro ao chamar API de exclusão',
      );
      throw new Error(
        `Erro ao deletar dados do MySQL: ${errorData.details || response.statusText}`,
      );
    }

    const result = await response.json();

    logger.info(
      { payrollId, accountId, result },
      'Dados deletados com sucesso do MySQL',
    );

    // 2. Deletar do Supabase
    const { error } = await client.from('payrolls').delete().eq('id', payrollId);

    if (error) {
      logger.error(
        { payrollId, accountId, error: error.message },
        'Erro ao excluir folha do Supabase',
      );
      throw new Error(`Erro ao excluir folha: ${error.message}`);
    }

    logger.info({ payrollId, accountId }, 'Folha excluída com sucesso');

    // Revalidar o cache da página
    revalidatePath('/home/[account]/uploads/lists');

    return {
      success: true,
      message: 'Folha excluída com sucesso!',
      details: result.data,
    };
  } catch (error) {
    logger.error({ payrollId, accountId, error }, 'Erro ao excluir folha');
    throw error;
  }
}

