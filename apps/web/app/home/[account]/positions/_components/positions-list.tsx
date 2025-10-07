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

import { Search, Edit, Trash2, List, Grid3X3 } from 'lucide-react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

import { UpdatePositionDialog } from './update-position-dialog';
import { DeletePositionDialog } from './delete-position-dialog';
import { Tables } from '@kit/supabase/database';

type Position = Tables<'positions'>;
type ViewMode = 'table' | 'grid';

export function PositionsList({ 
  accountId, 
  canManagePositions 
}: { 
  accountId: string;
  canManagePositions: boolean;
}) {
  const supabase = useSupabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const { t } = useTranslation('positions');

  const { data: positions, isLoading } = useQuery({
    queryKey: ['positions', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('account_id', accountId)
        .order('hierarchy_level', { ascending: true })
        .order('name');

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const filteredPositions = useMemo(() => {
    if (!positions) return [];

    if (!searchQuery.trim()) {
      return positions;
    }

    const query = searchQuery.toLowerCase();
    return positions.filter((position) =>
      position.name.toLowerCase().includes(query) ||
      position.external_id?.toLowerCase().includes(query) ||
      position.description?.toLowerCase().includes(query)
    );
  }, [positions, searchQuery]);

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
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('positions:searchPlaceholder', 'Buscar cargos...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="table" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:name" defaults="Nome" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:externalId" defaults="ID Externo" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:description" defaults="Descrição" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:hierarchyLevel" defaults="Nível Hierárquico" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:status" defaults="Status" />
                    </TableHead>
                    <If condition={canManagePositions}>
                      <TableHead className="w-[100px]">
                        <Trans i18nKey="common:actions" defaults="Ações" />
                      </TableHead>
                    </If>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPositions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canManagePositions ? 7 : 6} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPositions.map((position) => (
                      <TableRow key={position.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback 
                              style={{ 
                                backgroundColor: position.color || '#6b7280',
                                color: 'white'
                              }}
                            >
                              {position.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {position.name}
                        </TableCell>
                        <TableCell>
                          <If condition={position.external_id} fallback={
                            <span className="text-muted-foreground">
                              <Trans i18nKey="common:notSet" defaults="Não definido" />
                            </span>
                          }>
                            <Badge variant="outline" className="font-mono text-xs">
                              {position.external_id}
                            </Badge>
                          </If>
                        </TableCell>
                        <TableCell>
                          <If condition={position.description} fallback={
                            <span className="text-muted-foreground">
                              <Trans i18nKey="common:noDescription" defaults="Sem descrição" />
                            </span>
                          }>
                            <span className="max-w-[200px] truncate block">
                              {position.description}
                            </span>
                          </If>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {position.hierarchy_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={position.is_active ? 'success' : 'secondary'}>
                            <Trans i18nKey={position.is_active ? 'positions:active' : 'positions:inactive'} 
                              defaults={position.is_active ? 'Ativo' : 'Inativo'} />
                          </Badge>
                        </TableCell>
                        <If condition={canManagePositions}>
                          <TableCell>
                            <div className="flex space-x-1">
                              <UpdatePositionDialog 
                                position={position}
                                accountId={accountId}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:edit" defaults="Editar" />
                                  </span>
                                </Button>
                              </UpdatePositionDialog>
                              
                              <DeletePositionDialog position={position} accountId={accountId}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:delete" defaults="Excluir" />
                                  </span>
                                </Button>
                              </DeletePositionDialog>
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
            <If condition={filteredPositions.length === 0} fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPositions.map((position) => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    accountId={accountId}
                    canManagePositions={canManagePositions}
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
  );
}

function PositionCard({
  position,
  accountId,
  canManagePositions,
}: {
  position: Position;
  accountId: string;
  canManagePositions: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback 
                style={{ 
                  backgroundColor: position.color || '#6b7280',
                  color: 'white'
                }}
              >
                {position.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{position.name}</h3>
              
              <If condition={position.external_id} fallback={
                <p className="text-sm text-muted-foreground">
                  <Trans i18nKey="common:notSet" defaults="Não definido" />
                </p>
              }>
                <Badge variant="outline" className="text-xs mt-1">
                  {position.external_id}
                </Badge>
              </If>
              
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Nível {position.hierarchy_level}
                </Badge>
                <Badge variant={position.is_active ? 'success' : 'secondary'} className="text-xs">
                  <Trans i18nKey={position.is_active ? 'positions:active' : 'positions:inactive'} 
                    defaults={position.is_active ? 'Ativo' : 'Inativo'} />
                </Badge>
              </div>
            </div>
          </div>
          
          <If condition={canManagePositions}>
            <div className="flex space-x-1">
              <UpdatePositionDialog position={position} accountId={accountId}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">
                    <Trans i18nKey="common:edit" defaults="Editar" />
                  </span>
                </Button>
              </UpdatePositionDialog>
              
              <DeletePositionDialog position={position} accountId={accountId}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">
                    <Trans i18nKey="common:delete" defaults="Excluir" />
                  </span>
                </Button>
              </DeletePositionDialog>
            </div>
          </If>
        </div>
        
        <If condition={position.description}>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {position.description}
          </p>
        </If>
        
        <If condition={position.color}>
          <div className="flex items-center space-x-2 mt-2">
            <div 
              className="h-3 w-3 rounded-full border"
              style={{ backgroundColor: position.color || undefined }}
            />
            <Badge variant="secondary" className="text-xs">
              <Trans i18nKey="positions:color" defaults="Cor" />
            </Badge>
          </div>
        </If>
      </CardContent>
    </Card>
  );
}

