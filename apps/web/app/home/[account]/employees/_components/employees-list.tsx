'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kit/ui/table';
import { Trans } from '@kit/ui/trans';
import { If } from '@kit/ui/if';

import { Search, Edit, Trash2, List, Grid3X3, Mail, Phone, Calendar, DollarSign, User } from 'lucide-react';

import { UpdateEmployeeDialog } from './update-employee-dialog';
import { DeleteEmployeeDialog } from './delete-employee-dialog';
import { Employee } from '../_lib/schema/employee.schema';

type ViewMode = 'table' | 'grid';

export function EmployeesList({
  employees,
  accountId,
  canManageEmployees,
}: {
  employees: Employee[];
  accountId: string;
  canManageEmployees: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const { t } = useTranslation('employees');

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employees;
    }

    const query = searchQuery.toLowerCase();
    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      employee.department?.toLowerCase().includes(query) ||
      employee.phone?.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'on_leave':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Afastado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Feminino';
      case 'other':
        return 'Outro';
      case 'prefer_not_to_say':
        return 'Prefere não informar';
      default:
        return 'Não informado';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('employees:searchPlaceholder2', 'Buscar colaboradores...')}
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
                      <Trans i18nKey="employees:name" defaults="Nome" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="employees:position" defaults="Cargo" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="employees:department" defaults="Departamento" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="employees:gender" defaults="Gênero" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="employees:email" defaults="Email" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="employees:status2" defaults="Status" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="employees:salary2" defaults="Salário" />
                    </TableHead>
                    <If condition={canManageEmployees}>
                      <TableHead className="w-[100px]">
                        <Trans i18nKey="common:actions" defaults="Ações" />
                      </TableHead>
                    </If>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canManageEmployees ? 9 : 8} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>
                              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {employee.name}
                        </TableCell>
                        <TableCell>
                          {employee.position}
                        </TableCell>
                        <TableCell>
                          <If condition={employee.department} fallback={
                            <span className="text-muted-foreground">
                              <Trans i18nKey="common:notSet" defaults="Não definido" />
                            </span>
                          }>
                            <Badge variant="outline">
                              {employee.department}
                            </Badge>
                          </If>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{getGenderLabel(employee.gender || '')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{employee.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(employee.status)}
                        </TableCell>
                        <TableCell>
                          <If condition={employee.salary} fallback={
                            <span className="text-muted-foreground">
                              <Trans i18nKey="common:notSet" defaults="Não definido" />
                            </span>
                          }>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-mono">
                                {formatCurrency(employee.salary!)}
                              </span>
                            </div>
                          </If>
                        </TableCell>
                        <If condition={canManageEmployees}>
                          <TableCell>
                            <div className="flex space-x-1">
                              <UpdateEmployeeDialog 
                                employee={employee}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:edit" defaults="Editar" />
                                  </span>
                                </Button>
                              </UpdateEmployeeDialog>
                              
                              <DeleteEmployeeDialog employee={employee}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:delete" defaults="Excluir" />
                                  </span>
                                </Button>
                              </DeleteEmployeeDialog>
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
            <If condition={filteredEmployees.length === 0} fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    accountId={accountId}
                    canManageEmployees={canManageEmployees}
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

function EmployeeCard({
  employee,
  accountId,
  canManageEmployees,
}: {
  employee: Employee;
  accountId: string;
  canManageEmployees: boolean;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'on_leave':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Afastado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Feminino';
      case 'other':
        return 'Outro';
      case 'prefer_not_to_say':
        return 'Prefere não informar';
      default:
        return 'Não informado';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback>
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{employee.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
              
              <If condition={employee.department} fallback={
                <p className="text-xs text-muted-foreground mt-1">
                  <Trans i18nKey="common:notSet" defaults="Sem departamento" />
                </p>
              }>
                <Badge variant="outline" className="text-xs mt-1">
                  {employee.department}
                </Badge>
              </If>
              
              <div className="flex items-center space-x-2 mt-2">
                {getStatusBadge(employee.status)}
                <If condition={employee.salary}>
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatCurrency(employee.salary!)}
                  </span>
                </If>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{employee.email}</span>
                </div>
                
                <If condition={employee.phone}>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{employee.phone}</span>
                  </div>
                </If>
                
                <If condition={employee.gender}>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{getGenderLabel(employee.gender!)}</span>
                  </div>
                </If>
                
                <If condition={employee.hireDate}>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Admissão: {formatDate(employee.hireDate!)}</span>
                  </div>
                </If>

                <If condition={employee.birthDate}>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Nascimento: {formatDate(employee.birthDate!)}</span>
                  </div>
                </If>
              </div>
            </div>
          </div>
          
          <If condition={canManageEmployees}>
            <div className="flex space-x-1">
              <UpdateEmployeeDialog 
                employee={employee}
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">
                    <Trans i18nKey="common:edit" defaults="Editar" />
                  </span>
                </Button>
              </UpdateEmployeeDialog>
              
              <DeleteEmployeeDialog employee={employee}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">
                    <Trans i18nKey="common:delete" defaults="Excluir" />
                  </span>
                </Button>
              </DeleteEmployeeDialog>
            </div>
          </If>
        </div>
      </CardContent>
    </Card>
  );
}