'use client';

import { useMemo, useState, useTransition } from 'react';

import { Loader2, Plus, Search } from 'lucide-react';

import { Tables } from '@kit/supabase/database';
import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import { toast } from '@kit/ui/sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';

import { createPayrollAction } from '../_lib/server/server-actions';
import { DeletePayrollDialog } from './delete-payroll-dialog';

type Payroll = Tables<'payrolls'>;

interface PayrollsListProps {
  payrolls: Payroll[];
}

export function PayrollsList({ payrolls }: PayrollsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const { account } = useTeamAccountWorkspace();

  const formatCompetence = (month: number, year: number) => {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredData = useMemo(() => {
    if (!payrolls) return [];

    let filtered = payrolls;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          formatCompetence(item.month, item.year)
            .toLowerCase()
            .includes(query) ||
          item.cnpj.toLowerCase().includes(query) ||
          item.filial.toLowerCase().includes(query) ||
          item.year.toString().includes(query) ||
          item.month.toString().includes(query),
      );
    }

    return filtered;
  }, [payrolls, searchQuery]);

  const handleAddPayroll = () => {
    startTransition(async () => {
      await toast.promise(createPayrollAction(account.id), {
        loading: 'Criando folha de pagamento...',
        success: 'Folha criada com sucesso!',
        error: 'Erro ao criar folha de pagamento',
      });
    });
  };

  return (
    <Card className="mt-0">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Buscar folhas de pagamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleAddPayroll} size="sm" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Folha
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <If condition={filteredData}>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competência</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Filial</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[50px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData && filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="text-muted-foreground h-8 w-8" />
                        <p className="text-muted-foreground text-sm">
                          Nenhuma folha de pagamento encontrada
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData?.map((payroll) => (
                    <TableRow key={payroll.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {formatCompetence(payroll.month, payroll.year)}{' '}
                        <div
                          className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
                            payroll.is_current
                              ? 'border-transparent bg-green-100 text-green-800'
                              : 'border-transparent bg-gray-100 text-gray-800'
                          }`}
                        >
                          {payroll.is_current ? 'Atual' : 'Anterior'}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payroll.cnpj}
                      </TableCell>
                      <TableCell className="text-sm">
                        {payroll.filial}
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(payroll.created_at)}
                      </TableCell>
                      <TableCell>
                        <DeletePayrollDialog payroll={payroll} />
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
