'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';
import { AdvancedFiltersComponent } from './_components/advanced-filters';
import { PayrollDashboard } from './_components/payroll-dashboard';
import { PayrollAnalytics } from './_components/payroll-analytics';
import { PayrollPeople } from './_components/payroll-people';
import { PayrollReports } from './_components/payroll-reports';
import { advancedPayrollFilterManager } from './_lib/advanced-filters';
import { AdvancedFilters, ProcessedPayrollData } from './_components/types';

export default function PayrollPage() {
  const [filters, setFilters] = useState<AdvancedFilters>({});
  const [processedData, setProcessedData] = useState<ProcessedPayrollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  // Carregar dados quando filtros mudarem
  useEffect(() => {
    if (Object.keys(filters).length > 0 || processedData) {
      loadData();
    }
  }, [filters]);

  const loadData = () => {
    setLoading(true);
    
    // Simular delay de carregamento
    setTimeout(() => {
      try {
        const data = advancedPayrollFilterManager.getProcessedData(filters);
        setProcessedData(data);
      } catch (error) {
        console.error('Erro ao processar dados:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleFiltersChange = (newFilters: AdvancedFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exportando dados em formato ${format}`);
    // Implementar exportação
  };

  const getFilterOptions = () => {
    const data = advancedPayrollFilterManager.getProcessedData({});
    return data.filterOptions;
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Folha de Pagamento</h1>
          <p className="text-muted-foreground">
            Análise completa e filtros avançados para dados de folha de pagamento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        options={getFilterOptions()}
        loading={loading}
      />

      {/* Indicadores de Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} ativo{activeFiltersCount !== 1 ? 's' : ''}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {processedData?.filterStatistics.filteredData || 0} empresas filtradas
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Limpar Todos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Abas Principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-4">
          {processedData && (
            <PayrollDashboard data={processedData} loading={loading} />
          )}
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          {processedData && (
            <PayrollAnalytics data={processedData} loading={loading} />
          )}
        </TabsContent>

        {/* People */}
        <TabsContent value="people" className="space-y-4">
          {processedData && (
            <PayrollPeople data={processedData} loading={loading} />
          )}
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="reports" className="space-y-4">
          {processedData && (
            <PayrollReports data={processedData} loading={loading} />
          )}
        </TabsContent>
      </Tabs>

      {/* Footer com Estatísticas */}
      {processedData && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {processedData.totalPayroll.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-muted-foreground">Total da Folha</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {processedData.activeEmployees}
                </div>
                <div className="text-sm text-muted-foreground">Funcionários Ativos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {processedData.averageSalary.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-muted-foreground">Média Salarial</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {processedData.totalCompanies}
                </div>
                <div className="text-sm text-muted-foreground">Empresas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 