'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback } from '@kit/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';
import { If } from '@kit/ui/if';
import { EmptyState, EmptyStateHeading, EmptyStateText } from '@kit/ui/empty-state';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@kit/ui/select';

import { Search, Edit, Trash2, List, Grid3X3, Calendar } from 'lucide-react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';

import { UpdateEventDialog } from './update-event-dialog';
import { DeleteEventDialog } from './delete-event-dialog';
import { Tables } from '@kit/supabase/database';

type Event = Tables<'account_payroll_events'>;
type ViewMode = 'table' | 'grid';

export function EventsList({ accountId }: { accountId: string }) {
  const supabase = useSupabase();
  const workspace = useTeamAccountWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filterType, setFilterType] = useState('Todos');
  const { t } = useTranslation('payroll-events');

  // Update the query to fetch main_event_id and its details
  const { data: events, isLoading } = useQuery({
    queryKey: ['account_payroll_events', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_payroll_events')
        .select('*, main_events(id, description, type)')
        .eq('account_id', accountId)
        .order('name');

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const canManageEvents =
    (workspace.account.permissions as string[]).includes('payroll.manage') ||
    workspace.account.role === 'owner';

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.external_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === 'Todos' || // Treat 'Todos' as 'ALL'
        (filterType === 'outros' && !['provento', 'desconto'].includes(event.main_events?.type)) ||
        event.main_events?.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, filterType]);

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
    <If condition={events && events.length > 0} fallback={
      <EmptyState>
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <EmptyStateHeading>
          <Trans i18nKey="payroll-events:noEvents" />
        </EmptyStateHeading>
        <EmptyStateText>
          <Trans i18nKey="payroll-events:noEventsDescription" />
        </EmptyStateText>
      </EmptyState>
    }>
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('payroll-events:searchPlaceholder', 'Buscar eventos...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="relative flex-1 max-w-[120px]">
              <Select onValueChange={(value) => setFilterType(value)} className="w-[80px]">
                <SelectTrigger>
                  <span>{filterType || 'Todos'}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="provento">Provento</SelectItem>
                  <SelectItem value="desconto">Desconto</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table" className="flex items-center space-x-2">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      <Trans i18nKey="common:table" defaults="Tabela" />
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center space-x-2">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      <Trans i18nKey="common:grid" defaults="Grade" />
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Conteúdo baseado no modo de visualização */}
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="table" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">
                      </TableHead>
                      <TableHead>
                        <Trans i18nKey="payroll-events:name" defaults="Nome" />
                      </TableHead>
                      <TableHead>
                        <Trans i18nKey="payroll-events:externalId" defaults="ID Externo" />
                      </TableHead>
                      <TableHead>
                        <Trans i18nKey="payroll-events:description" defaults="Descrição" />
                      </TableHead>
                      <TableHead>
                        <Trans i18nKey="payroll-events:mainEventDetails" defaults="Detalhes do Evento Principal" />
                      </TableHead>
                      <If condition={canManageEvents}>
                        <TableHead className="w-[100px]">
                          <Trans i18nKey="common:actions" defaults="Ações" />
                        </TableHead>
                      </If>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={canManageEvents ? 6 : 5} className="h-24 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <Search className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback 
                                style={{ 
                                  backgroundColor: event.color || '#3B82F6',
                                  color: 'white'
                                }}
                              >
                                {event.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {event.name}
                          </TableCell>
                          <TableCell>
                            <If condition={event.external_id} fallback={
                              <span className="text-muted-foreground">
                                <Trans i18nKey="common:notSet" defaults="Não definido" />
                              </span>
                            }>
                              <Badge variant="outline" className="font-mono text-xs">
                                {event.external_id}
                              </Badge>
                            </If>
                          </TableCell>
                          <TableCell>
                            <If condition={event.description} fallback={
                              <span className="text-muted-foreground">
                                <Trans i18nKey="common:noDescription" defaults="Sem descrição" />
                              </span>
                            }>
                              <span className="max-w-[200px] truncate block">
                                {event.description}
                              </span>
                            </If>
                          </TableCell>
                          <TableCell>
                            <If condition={event.main_events}>
                              <Badge variant="outline" className="font-mono text-xs">
                                {event.main_events?.id}
                              </Badge>
                              <span className="ml-2">
                                {event.main_events?.description}
                              </span>
                              <Badge
                                variant={
                                  event.main_events?.type === 'provento' ? 'success' :
                                  event.main_events?.type === 'desconto' ? 'destructive' :
                                  'outline'
                                }
                                className="ml-2 text-xs"
                              >
                                {event.main_events?.type}
                              </Badge>
                            </If>
                          </TableCell>
                          <If condition={canManageEvents}>
                            <TableCell>
                              <div className="flex space-x-1">
                                <UpdateEventDialog 
                                  event={event}
                                  accountId={accountId}
                                >
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">
                                      <Trans i18nKey="common:edit" defaults="Editar" />
                                    </span>
                                  </Button>
                                </UpdateEventDialog>
                                
                                <DeleteEventDialog event={event} accountId={accountId}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">
                                      <Trans i18nKey="common:delete" defaults="Excluir" />
                                    </span>
                                  </Button>
                                </DeleteEventDialog>
                              </div>
                            </TableCell>
                          </If>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <If condition={filteredEvents.length === 0} fallback={
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      accountId={accountId}
                      canManageEvents={canManageEvents}
                    />
                  ))}
                </div>
              }>
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    <Trans i18nKey="common:noResultsDescription" defaults="Tente ajustar sua busca" />
                  </p>
                </div>
              </If>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </If>
  );
}

// Componente de Card para visualização em grade
function EventCard({
  event,
  accountId,
  canManageEvents,
}: {
  event: Event;
  accountId: string;
  canManageEvents: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback 
                style={{ 
                  backgroundColor: event.color || '#3B82F6',
                  color: 'white'
                }}
              >
                {event.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{event.name}</h3>
              
              <If condition={event.external_id} fallback={
                <p className="text-sm text-muted-foreground">
                  <Trans i18nKey="common:notSet" defaults="Não definido" />
                </p>
              }>
                <Badge variant="outline" className="text-xs mt-1">
                  {event.external_id}
                </Badge>
              </If>
            </div>
          </div>
          
          <If condition={canManageEvents}>
            <div className="flex space-x-1">
              <UpdateEventDialog event={event} accountId={accountId}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                  <span className="sr-only">
                    <Trans i18nKey="common:edit" defaults="Editar" />
                  </span>
                </Button>
              </UpdateEventDialog>
              
              <DeleteEventDialog event={event} accountId={accountId}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">
                    <Trans i18nKey="common:delete" defaults="Excluir" />
                  </span>
                </Button>
              </DeleteEventDialog>
            </div>
          </If>
        </div>
        
        <If condition={event.description}>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {event.description}
          </p>
        </If>
        
        <If condition={event.color}>
          <div className="flex items-center space-x-2 mt-2">
            <div 
              className="h-3 w-3 rounded-full border"
              style={{ backgroundColor: event.color || undefined }}
            />
            <Badge variant="secondary" className="text-xs">
              <Trans i18nKey="payroll-events:color" defaults="Cor" />
            </Badge>
          </div>
        </If>
      </CardContent>
    </Card>
  );
} 