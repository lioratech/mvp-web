'use client';

import { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Building,
  PieChart,
  BarChart3,
  LineChart,
  Download,
  Filter
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Trans } from '@kit/ui/trans';

import { PayrollData, Empresa, Funcionario } from './types';

interface PayrollDashboardProps {
  data: PayrollData & { filteredData?: any[] };
}

export function PayrollDashboard({ data }: PayrollDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedFunction, setSelectedFunction] = useState<string>('all');

  // Usar dados filtrados se disponível, senão usar todos os dados
  const dadosAnalise = data.filteredData || data.data;
  
  // Consolidar todos os funcionários dos dados filtrados
  const todosFuncionarios = dadosAnalise?.flatMap(empresa => empresa.funcionarios) || [];

  // Cálculos principais
  const metrics = useMemo(() => {
    if (!dadosAnalise || dadosAnalise.length === 0 || todosFuncionarios.length === 0) {
      return {
        totalFolha: 0,
        totalVencimentos: 0,
        totalDescontos: 0,
        funcionariosAtivos: 0,
        custoMedio: 0,
        totalFuncionarios: 0
      };
    }

    const totalFolha = todosFuncionarios.reduce((acc, func) => {
      const liquido = func.eventos.find(e => e.codigo === '*LÍQUIDO*')?.valor || 0;
      return acc + liquido;
    }, 0);

    const totalVencimentos = todosFuncionarios.reduce((acc, func) => {
      const vencimentos = func.eventos.find(e => e.codigo === 'TOT_VENC_')?.valor || 0;
      return acc + vencimentos;
    }, 0);

    const totalDescontos = todosFuncionarios.reduce((acc, func) => {
      const descontos = func.eventos.find(e => e.codigo === 'TOT_DESC_')?.valor || 0;
      return acc + descontos;
    }, 0);

    const funcionariosAtivos = todosFuncionarios.filter(f => f.condicao === 'Ativo').length;
    const custoMedio = funcionariosAtivos > 0 ? totalFolha / funcionariosAtivos : 0;

    return {
      totalFolha,
      totalVencimentos,
      totalDescontos,
      funcionariosAtivos,
      custoMedio,
      totalFuncionarios: todosFuncionarios.length
    };
  }, [todosFuncionarios, dadosAnalise]);

  // Dados para gráficos
  const chartData = useMemo(() => {
    if (!dadosAnalise || dadosAnalise.length === 0 || todosFuncionarios.length === 0) {
      return {
        funcionariosPorFuncao: [],
        custosPorFuncao: []
      };
    }

    const funcionariosPorFuncao = todosFuncionarios.reduce((acc, func) => {
      acc[func.funcao] = (acc[func.funcao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const custosPorFuncao = todosFuncionarios.reduce((acc, func) => {
      const liquido = func.eventos.find(e => e.codigo === '*LÍQUIDO*')?.valor || 0;
      acc[func.funcao] = (acc[func.funcao] || 0) + liquido;
      return acc;
    }, {} as Record<string, number>);

    return {
      funcionariosPorFuncao: Object.entries(funcionariosPorFuncao).map(([funcao, count]) => ({
        funcao,
        count
      })),
      custosPorFuncao: Object.entries(custosPorFuncao).map(([funcao, custo]) => ({
        funcao,
        custo
      }))
    };
  }, [todosFuncionarios, dadosAnalise]);

  // Top funcionários por salário
  const topFuncionarios = useMemo(() => {
    if (!dadosAnalise || dadosAnalise.length === 0 || todosFuncionarios.length === 0) {
      return [];
    }

    return todosFuncionarios
      .map(func => ({
        nome: func.nome,
        funcao: func.funcao,
        liquido: func.eventos.find(e => e.codigo === '*LÍQUIDO*')?.valor || 0,
        vencimentos: func.eventos.find(e => e.codigo === 'TOT_VENC_')?.valor || 0,
        descontos: func.eventos.find(e => e.codigo === 'TOT_DESC_')?.valor || 0
      }))
      .sort((a, b) => b.liquido - a.liquido)
      .slice(0, 5);
  }, [todosFuncionarios, dadosAnalise]);

  // Verificar se há dados para renderizar
  const hasData = dadosAnalise && dadosAnalise.length > 0 && todosFuncionarios.length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          <Trans i18nKey="payroll:noData" defaults="Nenhum dado disponível" />
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações sobre filtros aplicados */}
      {data.filteredData && data.filteredData.length !== data.data.length && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Dados Filtrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {data.filteredData.length} de {data.data.length} empresas
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {metrics.totalFuncionarios} funcionários analisados
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                R$ {metrics.totalFolha.toLocaleString('pt-BR')} total da folha
              </Badge>
            </div>
            <div className="mt-2 text-sm text-blue-700">
              Dashboard baseado nos dados filtrados selecionados
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <Trans i18nKey="payroll:dashboard.title" defaults="Dashboard de Folha de Pagamento" />
          </h1>
          <p className="text-muted-foreground">
            {dadosAnalise.length} empresa(s) • {metrics.totalFuncionarios} funcionários
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              <SelectItem value="current">Mês atual</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedFunction} onValueChange={setSelectedFunction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              <SelectItem value="Frentista">Frentista</SelectItem>
              <SelectItem value="Frentista/Caixa">Frentista/Caixa</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            <Trans i18nKey="common:export" defaults="Exportar" />
          </Button>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans i18nKey="payroll:metrics.totalPayroll" defaults="Total da Folha" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.totalFolha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans i18nKey="payroll:metrics.activeEmployees" defaults="{count} funcionários ativos" values={{ count: metrics.funcionariosAtivos }} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans i18nKey="payroll:metrics.averageCost" defaults="Custo Médio" />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.custoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans i18nKey="payroll:metrics.perEmployee" defaults="por funcionário" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans i18nKey="payroll:metrics.totalEarnings" defaults="Total Vencimentos" />
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.totalVencimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans i18nKey="payroll:metrics.grossPayroll" defaults="Folha bruta" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans i18nKey="payroll:metrics.totalDeductions" defaults="Total Descontos" />
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans i18nKey="payroll:metrics.deductions" defaults="Descontos totais" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes visualizações */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="functions">Por Função</TabsTrigger>
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="companies">Por Empresa</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gráfico de funcionários por função */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Funcionários por Função</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chartData.funcionariosPorFuncao.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.funcao}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de custos por função */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Custos por Função</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chartData.custosPorFuncao
                    .sort((a, b) => b.custo - a.custo)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.funcao}</span>
                        <span className="text-sm font-medium">
                          R$ {item.custo.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Por Função */}
        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Análise Detalhada por Função</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Função</TableHead>
                    <TableHead>Funcionários</TableHead>
                    <TableHead>Total Salários</TableHead>
                    <TableHead>Média Salarial</TableHead>
                    <TableHead>% da Folha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.custosPorFuncao
                    .sort((a, b) => b.custo - a.custo)
                    .map((item, index) => {
                      const funcionarios = chartData.funcionariosPorFuncao.find(f => f.funcao === item.funcao)?.count || 0;
                      const mediaSalarial = funcionarios > 0 ? item.custo / funcionarios : 0;
                      const percentualFolha = metrics.totalFolha > 0 ? (item.custo / metrics.totalFolha) * 100 : 0;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.funcao}</TableCell>
                          <TableCell>{funcionarios}</TableCell>
                          <TableCell>R$ {item.custo.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>R$ {mediaSalarial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</TableCell>
                          <TableCell>{percentualFolha.toFixed(1)}%</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Funcionários */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top 5 Funcionários por Salário</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Vencimentos</TableHead>
                    <TableHead>Descontos</TableHead>
                    <TableHead>Líquido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topFuncionarios.map((func, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{func.nome}</TableCell>
                      <TableCell>{func.funcao}</TableCell>
                      <TableCell>R$ {func.vencimentos.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>R$ {func.descontos.toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="font-bold">
                        R$ {func.liquido.toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Por Empresa */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Análise por Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Funcionários</TableHead>
                    <TableHead>Total Folha</TableHead>
                    <TableHead>Média Salarial</TableHead>
                    <TableHead>% do Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosAnalise.map((empresa, index) => {
                    const funcionariosEmpresa = empresa.funcionarios;
                    const totalFolhaEmpresa = funcionariosEmpresa.reduce((acc, func) => {
                      const liquido = func.eventos.find(e => e.codigo === '*LÍQUIDO*')?.valor || 0;
                      return acc + liquido;
                    }, 0);
                    const mediaSalarial = funcionariosEmpresa.length > 0 ? totalFolhaEmpresa / funcionariosEmpresa.length : 0;
                    const percentualTotal = metrics.totalFolha > 0 ? (totalFolhaEmpresa / metrics.totalFolha) * 100 : 0;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{empresa.nome}</TableCell>
                        <TableCell>{funcionariosEmpresa.length}</TableCell>
                        <TableCell>R$ {totalFolhaEmpresa.toLocaleString('pt-BR')}</TableCell>
                        <TableCell>R$ {mediaSalarial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</TableCell>
                        <TableCell>{percentualTotal.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 