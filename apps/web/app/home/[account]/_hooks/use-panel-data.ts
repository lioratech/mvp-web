'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { usePanelsFilters } from '../_contexts/panels-filters-context';

interface UsePanelDataOptions {
  panelName: string;
  tableName: string;
  select?: string;
  enabled?: boolean;
}

/**
 * Hook customizado para buscar dados de painéis com filtros aplicados
 * @param options - Opções de configuração da query
 * @returns Query result com dados do painel
 */
export function usePanelData({
  panelName,
  tableName,
  select = '*',
  enabled = true,
}: UsePanelDataOptions) {
  const { accountId, selectedDepartment } = usePanelsFilters();
  const supabase = useSupabase();

  return useQuery({
    queryKey: [panelName, accountId, selectedDepartment],
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select(select)
        .eq('account_id', accountId);

      // Aplicar filtro de departamento se selecionado
      if (selectedDepartment) {
        query = query.eq('department_id', selectedDepartment);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled,
  });
}

