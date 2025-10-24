'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback } from '@kit/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';
import { If } from '@kit/ui/if';
import { EmptyState, EmptyStateHeading, EmptyStateText } from '@kit/ui/empty-state';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@kit/ui/select';

import { Search, Edit, Trash2, UserCheck } from 'lucide-react';

import { UpdateStatusDialog } from './update-status-dialog';
import { DeleteStatusDialog } from './delete-status-dialog';

type CollaboratorStatus = {
  id: string;
  platform_id: string | null;
  account_id: string;
  name: string;
  type: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function CollaboratorStatusList({ 
  accountId, 
  canManageStatus 
}: { 
  accountId: string; 
  canManageStatus: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  const { data: statuses, isLoading } = useQuery({
    queryKey: ['collaborator-status', accountId],
    queryFn: async () => {
      const response = await fetch(`/api/collaborator-status?account_id=${accountId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch collaborator status');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch collaborator status');
      }
      return result.data as CollaboratorStatus[];
    },
  });

  const filteredStatuses = useMemo(() => {
    if (!statuses) return [];

    return statuses.filter((status) => {
      const matchesSearch =
        status.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === 'Todos' ||
        status.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [statuses, searchQuery, filterType]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <If condition={statuses && statuses.length > 0} fallback={
      <EmptyState>
        <UserCheck className="h-12 w-12 text-muted-foreground" />
        <EmptyStateHeading>
          <Trans i18nKey="collaborator-status:noStatus" />
        </EmptyStateHeading>
        <EmptyStateText>
          <Trans i18nKey="collaborator-status:noStatusDescription" />
        </EmptyStateText>
      </EmptyState>
    }>
      <Card className="mt-0">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  placeholder="Buscar status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="relative max-w-[120px]">
                <Select onValueChange={(value) => setFilterType(value)}>
                  <SelectTrigger>
                    <span>{filterType || 'Todos'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Licença">Licença</SelectItem>
                    <SelectItem value="Doença">Doença</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]"></TableHead>
                  <TableHead>
                    <Trans i18nKey="collaborator-status:name" defaults="Nome" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="collaborator-status:type" defaults="Tipo" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="collaborator-status:status" defaults="Status" />
                  </TableHead>
                  <TableHead>
                    <Trans i18nKey="collaborator-status:notes" defaults="Observações" />
                  </TableHead>
                  <If condition={canManageStatus}>
                    <TableHead className="w-[100px]">
                      <Trans i18nKey="common:actions" defaults="Ações" />
                    </TableHead>
                  </If>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStatuses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManageStatus ? 6 : 5} className="h-24 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Nenhum status encontrado
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStatuses.map((status) => (
                    <TableRow key={status.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {status.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {status.name}
                      </TableCell>
                      <TableCell>
                        <If condition={status.type} fallback={
                          <span className="text-muted-foreground text-sm">
                            <Trans i18nKey="common:notSet" defaults="Não definido" />
                          </span>
                        }>
                          <Badge variant="outline" className="text-xs">
                            {status.type}
                          </Badge>
                        </If>
                      </TableCell>
                      <TableCell>
                        <If condition={status.status} fallback={
                          <span className="text-muted-foreground text-sm">
                            <Trans i18nKey="common:notSet" defaults="Não definido" />
                          </span>
                        }>
                          <Badge variant="secondary" className="text-xs">
                            {status.status}
                          </Badge>
                        </If>
                      </TableCell>
                      <TableCell>
                        <If condition={status.notes} fallback={
                          <span className="text-muted-foreground text-sm">
                            <Trans i18nKey="common:noDescription" defaults="Sem observações" />
                          </span>
                        }>
                          <span className="max-w-[200px] truncate block text-sm">
                            {status.notes}
                          </span>
                        </If>
                      </TableCell>
                      <If condition={canManageStatus}>
                        <TableCell>
                          <div className="flex space-x-1">
                            <UpdateStatusDialog 
                              status={status}
                              accountId={accountId}
                            >
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">
                                  <Trans i18nKey="common:edit" defaults="Editar" />
                                </span>
                              </Button>
                            </UpdateStatusDialog>
                            
                            <DeleteStatusDialog status={status} accountId={accountId}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  <Trans i18nKey="common:delete" defaults="Excluir" />
                                </span>
                              </Button>
                            </DeleteStatusDialog>
                          </div>
                        </TableCell>
                      </If>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </If>
  );
}
