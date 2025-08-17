'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Input } from '@kit/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Checkbox } from '@kit/ui/checkbox';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Calendar,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Settings,
  RefreshCw,
  Share2,
  Printer,
  Mail
} from 'lucide-react';
import { ProcessedPayrollData } from './types';
import { advancedPayrollFilterManager } from '../_lib/advanced-filters';

interface PayrollReportsProps {
  data: ProcessedPayrollData;
  loading?: boolean;
}

export function PayrollReports({ data, loading }: PayrollReportsProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Obter dados reais para relatórios
  const getRealReportData = () => {
    const filteredData = advancedPayrollFilterManager.applyAdvancedFilters({});
    
    // Calcular métricas para relatórios
    const totalPayroll = filteredData.reduce((acc, company) => {
      return acc + company.employees.reduce((empAcc, employee) => {
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        return empAcc + liquid;
      }, 0);
    }, 0);

    const activeEmployees = filteredData.reduce((acc, company) => {
      return acc + company.employees.filter(e => e.condition === 'Ativo').length;
    }, 0);

    const totalEmployees = filteredData.reduce((acc, company) => {
      return acc + company.employees.length;
    }, 0);

    // Análise por empresa
    const companies = filteredData.map(company => {
      const companyPayroll = company.employees.reduce((acc, employee) => {
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        return acc + liquid;
      }, 0);
      
      const companyEmployees = company.employees.length;
      const companyActive = company.employees.filter(e => e.condition === 'Ativo').length;
      
      return {
        name: company.name || company.cnpj,
        cnpj: company.cnpj,
        employees: companyEmployees,
        activeEmployees: companyActive,
        totalPayroll: companyPayroll,
        averageSalary: companyEmployees > 0 ? companyPayroll / companyEmployees : 0
      };
    });

    // Análise por função
    const functions = new Map<string, { count: number; total: number; avgSalary: number }>();
    filteredData.forEach((company) => {
      company.employees.forEach((employee) => {
        const function_ = employee.function;
        const liquid = employee.events.find(e => e.code === '*LÍQUIDO*')?.value || 0;
        
        if (!functions.has(function_)) {
          functions.set(function_, { count: 0, total: 0, avgSalary: 0 });
        }
        
        const data = functions.get(function_)!;
        data.count++;
        data.total += liquid;
      });
    });

    functions.forEach((data, function_) => {
      data.avgSalary = data.count > 0 ? data.total / data.count : 0;
    });

    // Análise de eventos
    const events = new Map<string, { total: number; count: number; description: string }>();
    filteredData.forEach((company) => {
      company.employees.forEach((employee) => {
        employee.events.forEach((event) => {
          if (!events.has(event.code)) {
            events.set(event.code, { total: 0, count: 0, description: event.description });
          }
          const data = events.get(event.code)!;
          data.total += event.value;
          data.count++;
        });
      });
    });

    return {
      totalPayroll,
      activeEmployees,
      totalEmployees,
      averageSalary: totalEmployees > 0 ? totalPayroll / totalEmployees : 0,
      companies,
      functions: Array.from(functions.entries()).map(([function_, data]) => ({
        function: function_,
        employees: data.count,
        totalCost: data.total,
        averageSalary: data.avgSalary
      })),
      events: Array.from(events.entries()).map(([code, data]) => ({
        code,
        description: data.description,
        total: data.total,
        count: data.count
      }))
    };
  };

  const reportData = getRealReportData();

  // Relatórios disponíveis baseados nos dados reais
  const availableReports = [
    {
      id: 'payroll-summary',
      name: 'Resumo da Folha de Pagamento',
      description: 'Visão geral dos custos e funcionários',
      icon: FileText,
      category: 'Geral',
      dataPoints: [
        `Total da folha: R$ ${reportData.totalPayroll.toLocaleString('pt-BR')}`,
        `${reportData.totalEmployees} funcionários`,
        `${reportData.activeEmployees} ativos`,
        `Média salarial: R$ ${reportData.averageSalary.toLocaleString('pt-BR')}`
      ]
    },
    {
      id: 'company-analysis',
      name: 'Análise por Empresa',
      description: 'Detalhamento dos custos por empresa',
      icon: BarChart3,
      category: 'Empresas',
      dataPoints: reportData.companies.map(c => `${c.name}: R$ ${c.totalPayroll.toLocaleString('pt-BR')}`)
    },
    {
      id: 'function-analysis',
      name: 'Análise por Função',
      description: 'Distribuição de custos por função',
      icon: BarChart3,
      category: 'Funções',
      dataPoints: reportData.functions.slice(0, 5).map(f => `${f.function}: ${f.employees} funcionários`)
    },
    {
      id: 'events-breakdown',
      name: 'Detalhamento de Eventos',
      description: 'Análise detalhada de todos os eventos',
      icon: PieChart,
      category: 'Eventos',
      dataPoints: reportData.events.slice(0, 5).map(e => `${e.code}: R$ ${e.total.toLocaleString('pt-BR')}`)
    },
    {
      id: 'employee-list',
      name: 'Lista de Funcionários',
      description: 'Relação completa de funcionários',
      icon: Table,
      category: 'Funcionários',
      dataPoints: [`${reportData.totalEmployees} funcionários listados`]
    },
    {
      id: 'performance-metrics',
      name: 'Métricas de Performance',
      description: 'Indicadores de eficiência e produtividade',
      icon: LineChart,
      category: 'Performance',
      dataPoints: [
        `Taxa de atividade: ${((reportData.activeEmployees / reportData.totalEmployees) * 100).toFixed(1)}%`,
        `Média salarial: R$ ${reportData.averageSalary.toLocaleString('pt-BR')}`,
        `${reportData.companies.length} empresas`
      ]
    }
  ];

  const filteredReports = availableReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleGenerateReports = () => {
    console.log('Gerando relatórios:', selectedReports);
    console.log('Formato:', reportFormat);
    console.log('Incluir gráficos:', includeCharts);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">
            {selectedReports.length} relatórios selecionados • {reportData.totalEmployees} funcionários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleGenerateReports} disabled={selectedReports.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Gerar Relatórios
          </Button>
        </div>
      </div>

      {/* Configurações de Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato</label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Incluir Gráficos</label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts" 
                  checked={includeCharts} 
                  onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                />
                <label htmlFor="charts" className="text-sm">Gráficos e visualizações</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ações</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Busca e Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="geral">Geral</SelectItem>
                <SelectItem value="empresas">Empresas</SelectItem>
                <SelectItem value="funcoes">Funções</SelectItem>
                <SelectItem value="eventos">Eventos</SelectItem>
                <SelectItem value="funcionarios">Funcionários</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <report.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <Checkbox 
                  checked={selectedReports.includes(report.id)}
                  onCheckedChange={() => handleReportToggle(report.id)}
                />
              </div>
              <Badge variant="outline" className="w-fit">
                {report.category}
              </Badge>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {report.dataPoints.slice(0, 3).map((point, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {point}
                  </div>
                ))}
                {report.dataPoints.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{report.dataPoints.length - 3} mais...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Histórico de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: 'Relatório Mensal - Janeiro 2024',
                date: '2024-01-31',
                type: 'PDF',
                size: '2.3 MB',
                status: 'Concluído'
              },
              {
                name: 'Análise de Custos por Empresa',
                date: '2024-01-28',
                type: 'Excel',
                size: '1.8 MB',
                status: 'Concluído'
              },
              {
                name: 'Relatório de Performance',
                date: '2024-01-25',
                type: 'PDF',
                size: '3.1 MB',
                status: 'Concluído'
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString('pt-BR')} • {report.type} • {report.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumo dos Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.totalEmployees}
              </div>
              <div className="text-sm text-muted-foreground">Funcionários</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reportData.activeEmployees}
              </div>
              <div className="text-sm text-muted-foreground">Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {reportData.companies.length}
              </div>
              <div className="text-sm text-muted-foreground">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                R$ {(reportData.totalPayroll / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-muted-foreground">Total Folha</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 