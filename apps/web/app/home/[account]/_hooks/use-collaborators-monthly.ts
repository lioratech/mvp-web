import { useQuery } from '@tanstack/react-query';

import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';

import { MonthlyCollaboratorsData } from '../_types/collaborators';

export function useCollaboratorsMonthly(months: number = 3) {
  const { accounts, account } = useTeamAccountWorkspace();
  
  const currentAccount = accounts?.[0];

  return useQuery({
    queryKey: [
      'analytics',
      'collaborators',
      'monthly',
      account.id,
      currentAccount?.cnpj,
      currentAccount?.branch,
      months,
    ],
    queryFn: async (): Promise<MonthlyCollaboratorsData> => {
      if (!currentAccount?.cnpj) {
        throw new Error('CNPJ da conta não encontrado');
      }

      if (!account.id) {
        throw new Error('Account ID não encontrado');
      }

      // Construir URL com parâmetros
      const params = new URLSearchParams({
        account_id: account.id,
        cnpj: currentAccount.cnpj,
        months: months.toString(),
      });

      if (currentAccount.branch) {
        params.append('branch', String(currentAccount.branch));
      }

      const response = await fetch(
        `/api/analytics/collaborators/monthly?${params.toString()}`,
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch monthly collaborators data');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      return result.data;
    },
    enabled: !!currentAccount?.cnpj && !!account.id,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}
