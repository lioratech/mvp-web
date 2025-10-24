import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Tables } from '@kit/supabase/database';
import { cache } from 'react';

export const loadDepartments = cache(async (accountId: string): Promise<Tables<'departments'>[]> => {
  const client = getSupabaseServerClient();

  const { data: departments, error } = await client
    .from('departments')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro Supabase ao carregar departamentos:', error);
    throw new Error('Erro ao carregar departamentos');
  }

  return departments ?? [];
}); 