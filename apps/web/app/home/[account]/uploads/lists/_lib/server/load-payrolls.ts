import { cache } from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loadPayrolls = cache(async (accountId: string) => {
  const client = getSupabaseServerClient();

  const { data, error } = await client
    .from('payrolls')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
});

