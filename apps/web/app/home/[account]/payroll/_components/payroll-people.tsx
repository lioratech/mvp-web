'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Input } from '@kit/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  TrendingUp,
  Award,
  Clock,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { ProcessedPayrollData } from './types';
import { advancedPayrollFilterManager } from '../_lib/advanced-filters';

interface PayrollPeopleProps {
  data: ProcessedPayrollData;
  loading?: boolean;
}

export function PayrollPeople({ data, loading }: PayrollPeopleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [functionFilter, setFunctionFilter] = useState('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Obter dados reais de funcionários dos dados filtrados
  const getRealEmployees = () => {
    const filteredData = advancedPayrollFilterManager.applyAdvancedFilters({});
    const employees = [];

    filteredData.forEach((company) => {
      company.employees.forEach((employee) => {
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        const totalEvents = employee.events.reduce((acc, event) => acc + event.value, 0);
        
        // Tratar data de admissão que pode ser null/undefined
        let admissionDate = 'N/A';
        if (employee.admission && typeof employee.admission === 'string') {
          try {
            // Tentar diferentes formatos de data
            if (employee.admission.includes('/')) {
              // Formato DD/MM/YYYY
              const parts = employee.admission.split('/');
              if (parts.length === 3) {
                admissionDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toLocaleDateString('pt-BR');
              } else {
                admissionDate = employee.admission;
              }
            } else if (employee.admission.includes('-')) {
              // Formato YYYY-MM-DD
              admissionDate = new Date(employee.admission).toLocaleDateString('pt-BR');
            } else {
              admissionDate = employee.admission;
            }
          } catch (error) {
            admissionDate = employee.admission || 'N/A';
          }
        }
        
        employees.push({
          id: `${company.company_id}-${employee.cpf}`,
          name: employee.name || 'Nome não informado',
          function: employee.function || 'Função não informada',
          company: company.name || company.cnpj || 'Empresa não informada',
          status: employee.condition || 'Status não informado',
          salary: liquid,
          admission: admissionDate,
          performance: calculatePerformance(employee),
          lastReview: new Date().toISOString().split('T')[0], // Simular data de última avaliação
          cpf: employee.cpf || 'CPF não informado',
          cbo: employee.cbo || 'CBO não informado',
          salaryType: employee.salary_type || 'Tipo não informado',
          totalEvents: totalEvents,
          eventsCount: employee.events.length
        });
      });
    });

    return employees;
  };

  // Calcular performance baseada nos eventos
  const calculatePerformance = (employee: any) => {
    const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
    const totalVenc = employee.events.find(e => e.code === 'TOT_VENC_')?.value || 0;
    
    if (totalVenc === 0) return 75;
    
    const efficiency = (liquid / totalVenc) * 100;
    return Math.min(Math.max(efficiency, 60), 100); // Entre 60% e 100%
  };

  const realEmployees = getRealEmployees();

  const filteredEmployees = realEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesFunction = functionFilter === 'all' || employee.function === functionFilter;
    
    return matchesSearch && matchesStatus && matchesFunction;
  });

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 bg-green-100';
    if (performance >= 80) return 'text-blue-600 bg-blue-100';
    if (performance >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  // Calcular métricas reais
  const activeEmployees = realEmployees.filter(e => e.status === 'Ativo').length;
  const inactiveEmployees = realEmployees.filter(e => e.status === 'Inativo').length;
  const averageSalary = realEmployees.length > 0 
    ? realEmployees.reduce((acc, e) => acc + e.salary, 0) / realEmployees.length 
    : 0;
  const totalCompanies = new Set(realEmployees.map(e => e.company)).size;

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Pessoas</h2>
          <p className="text-muted-foreground">
            {activeEmployees} funcionários ativos • {inactiveEmployees} inativos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Funcionário
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas de RH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Funcionários</p>
                <p className="text-2xl font-bold">{realEmployees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Atividade</p>
                <p className="text-2xl font-bold">
                  {realEmployees.length > 0 ? ((activeEmployees / realEmployees.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Salarial</p>
                <p className="text-2xl font-bold">
                  R$ {averageSalary.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Empresas</p>
                <p className="text-2xl font-bold">{totalCompanies}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar funcionários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativos</SelectItem>
                <SelectItem value="Inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={functionFilter} onValueChange={setFunctionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Funções</SelectItem>
                {Array.from(new Set(realEmployees.map(e => e.function))).map((function_) => (
                  <SelectItem key={function_} value={function_}>
                    {function_}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Funcionários ({filteredEmployees.length})</span>
            <Badge variant="outline">
              {activeEmployees} ativos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.function} • {employee.company}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CPF: {employee.cpf} • CBO: {employee.cbo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {employee.salary.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Admissão: {employee.admission}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {employee.eventsCount} eventos
                    </div>
                  </div>

                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>

                  <Badge className={getPerformanceColor(employee.performance)}>
                    {employee.performance.toFixed(0)}%
                  </Badge>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise de Talentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEmployees
                .filter(e => e.status === 'Ativo')
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 5)
                .map((employee, index) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.function}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{employee.performance.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">
                        R$ {employee.salary.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análise de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Funcionários Ativos</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activeEmployees}</span>
                  <Badge variant="outline" className="text-green-600">+12%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Média Salarial</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    R$ {averageSalary.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                  <Badge variant="outline" className="text-blue-600">+8%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Rotatividade</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {realEmployees.length > 0 ? ((inactiveEmployees / realEmployees.length) * 100).toFixed(1) : 0}%
                  </span>
                  <Badge variant="outline" className="text-yellow-600">+2%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Tempo Médio na Empresa</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">2.3 anos</span>
                  <Badge variant="outline" className="text-green-600">+0.5</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <UserPlus className="h-6 w-6 mb-2" />
              <span className="text-sm">Adicionar Funcionário</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Avaliações</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Relatórios</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 