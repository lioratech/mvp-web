'use client';

import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
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

import { EditCollaboratorDialog } from './edit-collaborator-dialog';

export function CollaboratorsList() {
  return <AnalyticsDataTable />;
}

// Componente para exibir dados da API de Analytics
function AnalyticsDataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [competenceFilter, setCompetenceFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const { account } = useTeamAccountWorkspace();
  const supabase = useSupabase();

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
    queryKey: ['collaborators', account.id],
    queryFn: async () => {
      if (!account.id) {
        throw new Error('Account ID não encontrado');
      }

      // Construir URL com account_id
      const params = new URLSearchParams({
        account_id: account.id,
      });

      const response = await fetch(`/api/collaborators?${params.toString()}`);
      
      console.log('[CollaboratorsList] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[CollaboratorsList] API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch collaborators data');
      }
      
      const result = await response.json();
      console.log('[CollaboratorsList] API Result:', {
        success: result.success,
        dataLength: result.data?.length,
        total: result.total,
        sampleData: result.data?.[0],
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch collaborators data');
      }
      
      return result.data as Array<{
        id: number;
        collaborator_name: string | null;
        collaborator_cpf: string | null;
        collaborator_branch: string | null;
        collaborator_admission_date: string | null;
        account_id: string | null;
        platform_id: string | null;
        gender: string | null;
        birth_date: string | null;
        apprentice: number | null;
        pcd: number | null;
        resignation_date: string | null;
        resignation_type: string | null;
        resignation_type_other: string | null;
        collaborator_status: string | null;
        collaborator_link: string | null;
        collaborator_department: number | null;
        collaborator_cbo: string | null;
        collaborator_base_salary: number | null;
        reference_month: number | null;
        reference_year: number | null;
      }>;
    },
    enabled: !!account.id,
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

    if (competenceFilter !== 'all') {
      filtered = filtered.filter((item) => {
        const itemCompetence = `${item.reference_month?.toString().padStart(2, '0')}/${item.reference_year}`;
        return itemCompetence === competenceFilter;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.collaborator_name?.toLowerCase().includes(query) ||
          item.collaborator_cpf?.toLowerCase().includes(query),
      );
    }

    // Aplicar ordenação por salário base
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const salaryA = a.collaborator_base_salary || 0;
        const salaryB = b.collaborator_base_salary || 0;
        return sortOrder === 'asc' ? salaryA - salaryB : salaryB - salaryA;
      });
    }

    return filtered;
  }, [data, searchQuery, statusFilter, competenceFilter, sortOrder]);

  const availableStatuses = useMemo(() => {
    if (!data) return [];
    
    // Filtrar dados por competência primeiro, se houver filtro
    let dataToFilter = data;
    if (competenceFilter !== 'all') {
      dataToFilter = data.filter((item) => {
        const itemCompetence = `${item.reference_month?.toString().padStart(2, '0')}/${item.reference_year}`;
        return itemCompetence === competenceFilter;
      });
    }
    
    const statuses = new Set(
      dataToFilter.map((item) => item.collaborator_status).filter(Boolean),
    );
    return Array.from(statuses).sort();
  }, [data, competenceFilter]);

  const availableCompetences = useMemo(() => {
    if (!data) return [];
    const competences = new Set(
      data
        .map((item) => {
          if (item.reference_month && item.reference_year) {
            return `${item.reference_month.toString().padStart(2, '0')}/${item.reference_year}`;
          }
          return null;
        })
        .filter(Boolean),
    );
    return Array.from(competences).sort((a, b) => {
      // Ordenar por ano e mês (mais recente primeiro)
      const [monthA, yearA] = (a as string).split('/').map(Number);
      const [monthB, yearB] = (b as string).split('/').map(Number);
      if (yearB !== yearA) return (yearB ?? 0) - (yearA ?? 0);
      return (monthB ?? 0) - (monthA ?? 0);
    });
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
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const formatGender = (gender: string | null) => {
    if (!gender) return '-';
    const genderMap: Record<string, string> = {
      M: 'Masculino',
      F: 'Feminino',
      O: 'Outro',
    };
    return genderMap[gender] || '-';
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

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Competência:
              </span>
              <Select
                value={competenceFilter}
                onValueChange={setCompetenceFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todas ({data?.length || 0})
                  </SelectItem>
                  {availableCompetences.map((competence) => (
                    <SelectItem key={competence} value={competence as string}>
                      {competence} (
                      {data?.filter((item) => {
                        const itemComp = `${item.reference_month?.toString().padStart(2, '0')}/${item.reference_year}`;
                        return itemComp === competence;
                      }).length || 0}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todos (
                    {competenceFilter === 'all'
                      ? data?.length || 0
                      : data?.filter((item) => {
                          const itemComp = `${item.reference_month?.toString().padStart(2, '0')}/${item.reference_year}`;
                          return itemComp === competenceFilter;
                        }).length || 0}
                    )
                  </SelectItem>
                  {availableStatuses.map((status) => {
                    const filteredData =
                      competenceFilter === 'all'
                        ? data
                        : data?.filter((item) => {
                            const itemComp = `${item.reference_month?.toString().padStart(2, '0')}/${item.reference_year}`;
                            return itemComp === competenceFilter;
                          });

                    const count =
                      filteredData?.filter(
                        (item) => item.collaborator_status === status,
                      ).length || 0;

                    return (
                      <SelectItem key={status} value={status || ''}>
                        {status} ({count})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
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
              Erro ao carregar dados dos colaboradores
            </p>
          </div>
        </If>

        <If condition={!isLoading && !error && filteredData}>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competência</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vínculo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>
                    <button
                      onClick={() => {
                        if (sortOrder === null) setSortOrder('desc');
                        else if (sortOrder === 'desc') setSortOrder('asc');
                        else setSortOrder(null);
                      }}
                      className="flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Salário Base
                      {sortOrder === 'desc' && (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {sortOrder === 'asc' && (
                        <ChevronUp className="h-4 w-4" />
                      )}
                      {sortOrder === null && (
                        <span className="text-muted-foreground h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>CBO</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
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
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.reference_month?.toString().padStart(2, '0')}/
                        {item.reference_year}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {item.collaborator_name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {item.gender && (
                              <span
                                className={
                                  item.gender === 'F'
                                    ? 'text-pink-600 font-medium'
                                    : item.gender === 'M'
                                      ? 'text-blue-600 font-medium'
                                      : ''
                                }
                              >
                                {formatGender(item.gender)}
                              </span>
                            )}
                            {item.gender && item.birth_date && (
                              <span>•</span>
                            )}
                            {item.birth_date && (
                              <span>{formatDate(item.birth_date)}</span>
                            )}
                          </div>
                        </div>
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
                        {item.collaborator_link || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {departmentsMap.get(
                          String(item.collaborator_department),
                        ) ||
                          item.collaborator_department ||
                          '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.collaborator_base_salary
                          ? formatCurrency(item.collaborator_base_salary)
                          : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.collaborator_cbo}
                      </TableCell>
                      <TableCell>
                        <EditCollaboratorDialog
                          collaborator={{
                            id: item.id,
                            collaborator_name: item.collaborator_name,
                            collaborator_cpf: item.collaborator_cpf,
                            collaborator_status: item.collaborator_status,
                            gender: item.gender,
                            birth_date: item.birth_date,
                            apprentice: item.apprentice,
                            pcd: item.pcd,
                            resignation_date: item.resignation_date,
                            resignation_type: item.resignation_type,
                            resignation_type_other: item.resignation_type_other,
                          }}
                        />
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
