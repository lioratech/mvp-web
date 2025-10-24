'use client';

import { useState, useMemo } from 'react';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback } from '@kit/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';
import { If } from '@kit/ui/if';

import { Search, Edit, Trash2 } from 'lucide-react';

import { UpdateDepartmentDialog } from './update-department-dialog';
import { DeleteDepartmentDialog } from './delete-department-dialog';
import { Tables } from '@kit/supabase/database';

type Department = Tables<'departments'>;

export function DepartmentsList({
  departments,
  canManageDepartments,
}: {
  departments: Department[];
  accountId: string;
  canManageDepartments: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');

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
    <Card className="mt-0">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Buscar departamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
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
                        Nenhum departamento encontrado
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
                        <span className="text-muted-foreground text-sm">
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
                        <span className="text-muted-foreground text-sm">
                          <Trans i18nKey="common:noDescription" defaults="Sem descrição" />
                        </span>
                      }>
                        <span className="max-w-[200px] truncate block text-sm">
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
      </CardContent>
    </Card>
  );
} 