'use client';

import { useState, useMemo } from 'react';
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

import { UpdateDepartmentDialog } from './update-department-dialog';
import { DeleteDepartmentDialog } from './delete-department-dialog';
import { Tables } from '@kit/supabase/database';

type Department = Tables<'departments'>;
type ViewMode = 'table' | 'grid';

export function DepartmentsList({
  departments,
  accountId,
  canManageDepartments,
}: {
  departments: Department[];
  accountId: string;
  canManageDepartments: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const { t } = useTranslation('departments');

  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) {
      return departments;
    }

    const query = searchQuery.toLowerCase();
    return departments.filter((department) =>
      department.name.toLowerCase().includes(query) ||
      department.external_id?.toLowerCase().includes(query) ||
      department.description?.toLowerCase().includes(query)
    );
  }, [departments, searchQuery]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('departments:searchPlaceholder', 'Buscar departamentos...')}
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
                      <Trans i18nKey="departments:name" defaults="Nome" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="departments:externalId" defaults="ID Externo" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="departments:description" defaults="Descrição" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="departments:color" defaults="Cor" />
                    </TableHead>
                    <If condition={canManageDepartments}>
                      <TableHead className="w-[100px]">
                        <Trans i18nKey="common:actions" defaults="Ações" />
                      </TableHead>
                    </If>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canManageDepartments ? 6 : 5} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map((department) => (
                      <TableRow key={department.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback 
                              style={{ 
                                backgroundColor: department.color || '#6b7280',
                                color: 'white'
                              }}
                            >
                              {department.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell>
                          <If condition={department.external_id} fallback={
                            <span className="text-muted-foreground">
                              <Trans i18nKey="common:notSet" defaults="Não definido" />
                            </span>
                          }>
                            <Badge variant="outline" className="font-mono text-xs">
                              {department.external_id}
                            </Badge>
                          </If>
                        </TableCell>
                        <TableCell>
                          <If condition={department.description} fallback={
                            <span className="text-muted-foreground">
                              <Trans i18nKey="common:noDescription" defaults="Sem descrição" />
                            </span>
                          }>
                            <span className="max-w-[200px] truncate block">
                              {department.description}
                            </span>
                          </If>
                        </TableCell>
                        <TableCell>
                          <If condition={department.color}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="h-4 w-4 rounded-full border"
                                style={{ backgroundColor: department.color || undefined }}
                              />
                              <Badge 
                                variant="secondary" 
                                className="text-xs"
                              >
                                <Trans i18nKey="departments:color" defaults="Cor" />
                              </Badge>
                            </div>
                          </If>
                        </TableCell>
                        <If condition={canManageDepartments}>
                          <TableCell>
                            <div className="flex space-x-1">
                              <UpdateDepartmentDialog 
                                department={department}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:edit" defaults="Editar" />
                                  </span>
                                </Button>
                              </UpdateDepartmentDialog>
                              
                              <DeleteDepartmentDialog department={department}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:delete" defaults="Excluir" />
                                  </span>
                                </Button>
                              </DeleteDepartmentDialog>
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
            <If condition={filteredDepartments.length === 0} fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDepartments.map((department) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    accountId={accountId}
                    canManageDepartments={canManageDepartments}
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

function DepartmentCard({
  department,
  accountId,
  canManageDepartments,
}: {
  department: Department;
  accountId: string;
  canManageDepartments: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback 
                style={{ 
                  backgroundColor: department.color || '#6b7280',
                  color: 'white'
                }}
              >
                {department.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{department.name}</h3>
              
              <If condition={department.external_id} fallback={
                <p className="text-sm text-muted-foreground">
                  <Trans i18nKey="common:notSet" defaults="Não definido" />
                </p>
              }>
                <Badge variant="outline" className="text-xs mt-1">
                  {department.external_id}
                </Badge>
              </If>
              
              <If condition={department.description} fallback={
                <p className="text-sm text-muted-foreground mt-1">
                  <Trans i18nKey="common:noDescription" defaults="Sem descrição" />
                </p>
              }>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {department.description}
                </p>
              </If>
            </div>
          </div>
          
          <If condition={canManageDepartments}>
            <div className="flex space-x-1">
              <UpdateDepartmentDialog 
                department={department}
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">
                    <Trans i18nKey="common:edit" defaults="Editar" />
                  </span>
                </Button>
              </UpdateDepartmentDialog>
              
              <DeleteDepartmentDialog department={department}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">
                    <Trans i18nKey="common:delete" defaults="Excluir" />
                  </span>
                </Button>
              </DeleteDepartmentDialog>
            </div>
          </If>
        </div>
      </CardContent>
    </Card>
  );
} 