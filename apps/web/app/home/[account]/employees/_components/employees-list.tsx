'use client';

import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Database, Search } from 'lucide-react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';
import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Skeleton } from '@kit/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';

export function EmployeesList() {
  return <AnalyticsDataTable />;
}

// Componente para exibir dados da API de Analytics
function AnalyticsDataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { accounts, account } = useTeamAccountWorkspace();
  const supabase = useSupabase();

  // Encontrar a conta atual baseada na URL ou usar a primeira conta disponível
  const currentAccount = accounts?.[0]; // Assumindo que accounts já tem cnpj e branch

  // Buscar departments do Supabase para fazer o mapeamento
  const { data: departments } = useQuery({
    queryKey: ['departments', account.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, external_id')
        .eq('account_id', account.id);

      if (error) throw error;
      return data as Array<{
        id: string;
        name: string;
        external_id: string | null;
      }>;
    },
    enabled: !!account.id,
  });

  // Criar mapa de external_id -> department name
  const departmentsMap = useMemo(() => {
    if (!departments) return new Map<string, string>();
    return new Map(
      departments
        .filter((d) => d.external_id)
        .map((d) => [d.external_id!, d.name]),
    );
  }, [departments]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'analytics',
      'collaborators',
      account.id,
      currentAccount?.cnpj,
      currentAccount?.branch,
    ],
    queryFn: async () => {
      if (!currentAccount?.cnpj) {
        throw new Error('CNPJ da conta não encontrado');
      }

      if (!account.id) {
        throw new Error('Account ID não encontrado');
      }

      // Construir URL com account_id, CNPJ e branch (se disponível)
      const params = new URLSearchParams({
        account_id: account.id,
        cnpj: currentAccount.cnpj,
      });

      if (currentAccount.branch) {
        params.append('branch', String(currentAccount.branch));
      }

      const response = await fetch(
        `/api/analytics/collaborators?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const result = await response.json();
      return result.data as Array<{
        id: number;
        platform_id: number | null;
        account_id: number | null;
        reference_month: number | null;
        reference_year: number | null;
        company_cnpj: string | null;
        company_code: number | null;
        company_issue_date: string | null;
        collaborator_code: number | null;
        collaborator_name: string | null;
        collaborator_cpf: string | null;
        collaborator_status: string | null;
        collaborator_admission_date: string | null;
        collaborator_link: string | null;
        collaborator_cc: number | null;
        collaborator_department: number | null;
        collaborator_hours_per_month: number | null;
        collaborator_position_code: number | null;
        collaborator_position_description: string | null;
        collaborator_cbo: string | null;
        collaborator_branch: number | null;
        collaborator_salary: number | null;
        collaborator_base_salary: number | null;
        event_code: number | null;
        event_description: string | null;
        event_quantity: number | null;
        event_value: number | null;
        event_type: string | null;
        total_earnings: number | null;
        total_deductions: number | null;
        total_net_salary: number | null;
        base_inss: number | null;
        base_fgts: number | null;
        base_fgts_value: number | null;
        base_irrf: number | null;
      }>;
    },
    enabled: !!currentAccount?.cnpj && !!account.id, 
  });

  const filteredData = useMemo(() => {
    if (!data) {
      return [];
    }

    let filtered = data;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (item) => item.collaborator_status === statusFilter,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.collaborator_name?.toLowerCase().includes(query) ||
          item.collaborator_cpf?.toLowerCase().includes(query) ||
          item.collaborator_position_description
            ?.toLowerCase()
            .includes(query) ||
          item.company_name?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [data, searchQuery, statusFilter]);

  // Obter lista única de status
  const availableStatuses = useMemo(() => {
    if (!data) return [];
    const statuses = new Set(data.map((item) => item.collaborator_status));
    return Array.from(statuses).sort();
  }, [data]);

  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="mt-0">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Buscar colaboradores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">
              Status:
            </span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos ({data?.length || 0})</SelectItem>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status} (
                    {data?.filter((item) => item.collaborator_status === status)
                      .length || 0}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <If condition={isLoading}>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </If>

        <If condition={error}>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive text-sm">
              Erro ao carregar dados de analytics
            </p>
          </div>
        </If>

        <If condition={!isLoading && !error && filteredData}>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>CBO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="text-muted-foreground h-8 w-8" />
                        <p className="text-muted-foreground text-sm">
                          Nenhum dado encontrado
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData?.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        {item.collaborator_code}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.reference_month?.toString().padStart(2, '0')}/
                        {item.reference_year}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.collaborator_name}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
                            item.collaborator_status
                              ?.toLowerCase()
                              .includes('ativo') ||
                            item.collaborator_status
                              ?.toLowerCase()
                              .includes('active') ||
                            item.collaborator_status
                              ?.toLowerCase()
                              .includes('trabalhando')
                              ? 'border-transparent bg-green-100 text-green-800'
                              : item.collaborator_status
                                    ?.toLowerCase()
                                    .includes('demitido') ||
                                  item.collaborator_status
                                    ?.toLowerCase()
                                    .includes('rescindido') ||
                                  item.collaborator_status
                                    ?.toLowerCase()
                                    .includes('desligado')
                                ? 'border-transparent bg-red-100 text-red-800'
                                : item.collaborator_status
                                      ?.toLowerCase()
                                      .includes('afastado') ||
                                    item.collaborator_status
                                      ?.toLowerCase()
                                      .includes('doença') ||
                                    item.collaborator_status
                                      ?.toLowerCase()
                                      .includes('doenca') ||
                                    item.collaborator_status
                                      ?.toLowerCase()
                                      .includes('licença') ||
                                    item.collaborator_status
                                      ?.toLowerCase()
                                      .includes('licenca')
                                  ? 'border-transparent bg-orange-100 text-orange-800'
                                  : item.collaborator_status
                                        ?.toLowerCase()
                                        .includes('férias') ||
                                      item.collaborator_status
                                        ?.toLowerCase()
                                        .includes('ferias')
                                    ? 'border-transparent bg-blue-100 text-blue-800'
                                    : 'border-transparent bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.collaborator_status}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {departmentsMap.get(
                          String(item.collaborator_department),
                        ) ||
                          item.collaborator_department ||
                          '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.collaborator_position_description}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.collaborator_cbo}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </If>
      </CardContent>
    </Card>
  );
}
