'use client';

import { useMemo } from 'react';

import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  Umbrella,
  Gift,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';

import { InsightsModel } from '../../_components/insights-model';
import { Badge } from '@kit/ui/badge';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@kit/ui/chart';

export default function ForecastsCharts() {
  const provisionsBreakdownData = useMemo(() => generateProvisionsBreakdownData(), []);
  const provisionsForecastData = useMemo(() => generateProvisionsForecastData(), []);
  const overdueVacationsData = useMemo(() => generateOverdueVacationsData(), []);

  const totalProvisions = provisionsBreakdownData.reduce((sum, item) => sum + item.value, 0);
  const criticalItems = overdueVacationsData.filter(item => item.risk === 'critical').length;

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total Provisões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                1.435M
              </span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              +5,2% vs mês anterior
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Umbrella className="h-4 w-4" />
              Provisão de Férias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">R$ 892K</span>
            </div>
            <span className="text-sm text-muted-foreground">
              31.8% do total
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Gift className="h-4 w-4" />
              Provisão 13º Salário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">R$ 543.238,02</span>
            </div>
            <span className="text-sm text-muted-foreground">
              11/12 meses acumulados
            </span>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              Férias Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-700 dark:text-orange-400">R$ 143K</span>
            </div>
            <span className="text-sm text-orange-600 dark:text-orange-500">
              {criticalItems} colaboradores
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Projeção Dez/25
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">R$ 3.1M</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              +10,7% até fim do ano
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Alertas Críticos - Ação Imediata Necessária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-white p-4 dark:border-red-800 dark:bg-red-950">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <div className="font-semibold text-red-700 dark:text-red-400">
                  {criticalItems} colaboradores com férias vencidas há mais de 12 meses
                </div>
                <div className="mt-1 text-sm text-red-600 dark:text-red-500">
                  Risco de multa: R$ 290K (200% do valor) + juros de 1% ao mês
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Recomendação: Agendar férias imediatamente para evitar autuação do MTE
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Composição das Provisões
            </CardTitle>
            <CardDescription>
              Breakdown por tipo de provisão (Set/25)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProvisionsBreakdownChart data={provisionsBreakdownData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projeção de Provisões - Próximos 12 Meses
            </CardTitle>
            <CardDescription>
              Previsão de evolução das provisões trabalhistas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProvisionsForecastChart data={provisionsForecastData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Colaboradores com Férias Vencidas
            </CardTitle>
            <CardDescription>
              Monitoramento de férias não gozadas no prazo legal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OverdueVacationsChart data={overdueVacationsData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <InsightsModel panelType="sales" />
      </div>
    </div>
  );
}

function generateProvisionsBreakdownData() {
  return [
    { tipo: 'Férias', value: 892000, percentage: 31.8, fill: '#3b82f6' },
    { tipo: '13º Salário', value: 745000, percentage: 26.6, fill: '#10b981' },
    { tipo: 'Encargos Férias', value: 383000, percentage: 8.9, fill: '#8b5cf6' },
    { tipo: 'Multas FGTS', value: 185000, percentage: 6.6, fill: '#f59e0b' },
    { tipo: 'Férias Vencidas', value: 145000, percentage: 5.2, fill: '#ef4444' },
    { tipo: 'Outros', value: 166240, percentage: 5.9, fill: '#6b7280' },
  ];
}

function generateProvisionsForecastData() {
  return [
    { month: 'Set/25', realizado: 2800000, projetado: 2800000 },
    { month: 'Out/25', realizado: null, projetado: 2870000 },
    { month: 'Nov/25', realizado: null, projetado: 2940000 },
    { month: 'Dez/25', realizado: null, projetado: 3100000 },
    { month: 'Jan/26', realizado: null, projetado: 2200000 },
    { month: 'Fev/26', realizado: null, projetado: 2350000 },
    { month: 'Mar/26', realizado: null, projetado: 2480000 },
    { month: 'Abr/26', realizado: null, projetado: 2610000 },
    { month: 'Mai/26', realizado: null, projetado: 2740000 },
    { month: 'Jun/26', realizado: null, projetado: 2870000 },
  ];
}

function generateOverdueVacationsData() {
  return [
    { name: 'João Silva', department: 'Comercial', daysOverdue: 425, provision: 18500, risk: 'critical' },
    { name: 'Maria Santos', department: 'Operações', daysOverdue: 398, provision: 22300, risk: 'critical' },
    { name: 'Pedro Costa', department: 'TI', daysOverdue: 380, provision: 28400, risk: 'critical' },
    { name: 'Ana Oliveira', department: 'Administrativo', daysOverdue: 365, provision: 15200, risk: 'critical' },
    { name: 'Carlos Souza', department: 'Comercial', daysOverdue: 352, provision: 19800, risk: 'critical' },
    { name: 'Juliana Lima', department: 'Marketing', daysOverdue: 340, provision: 17600, risk: 'critical' },
    { name: 'Roberto Alves', department: 'Operações', daysOverdue: 328, provision: 21200, risk: 'critical' },
  ];
}

function ProvisionsBreakdownChart(props: {
  data: { tipo: string; value: number; percentage: number; fill: string }[];
}) {
  const chartConfig = props.data.reduce(
    (acc, item) => {
      acc[item.tipo] = {
        label: item.tipo,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{ left: 120, right: 40, top: 10, bottom: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="tipo"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={115}
          tick={{ fontSize: 12 }}
        />
        <XAxis
          dataKey="value"
          type="number"
          hide
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0];
              if (data && data.payload) {
                return (
                  <div className="rounded-lg border bg-white p-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-1 rounded-full" 
                        style={{ backgroundColor: data.payload.fill }}
                      />
                      <div className="font-medium">{data.payload.tipo}</div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      R$ {Number(data.value).toLocaleString('pt-BR')}
                    </div>
                  </div>
                );
              }
            }
            return null;
          }}
        />
        <Bar dataKey="value" radius={4}>
          <LabelList
            dataKey="value"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: number) =>
              `R$ ${(value / 1000).toFixed(0)}K (${props.data.find((d) => d.value === value)?.percentage}%)`
            }
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function ProvisionsForecastChart(props: {
  data: { month: string; realizado: number | null; projetado: number | null }[];
}) {
  const chartConfig = {
    realizado: {
      label: 'Realizado',
      color: '#10b981',
    },
    projetado: {
      label: 'Projetado',
      color: '#3b82f6',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <AreaChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <defs>
          <linearGradient id="fillRealizado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillProjetado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0];
              if (data) {
                return (
                  <div className="rounded-lg border bg-white p-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-1 rounded-full" 
                        style={{ backgroundColor: data.color }}
                      />
                      <div className="font-medium">{data.name}</div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      R$ {Number(data.value).toLocaleString('pt-BR')}
                    </div>
                  </div>
                );
              }
            }
            return null;
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="realizado"
          type="monotone"
          fill="url(#fillRealizado)"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          connectNulls={true}
        />
        <Area
          dataKey="projetado"
          type="monotone"
          fill="url(#fillProjetado)"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          connectNulls={true}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function OverdueVacationsChart(props: {
  data: {
    name: string;
    department: string;
    daysOverdue: number;
    provision: number;
    risk: string;
  }[];
}) {
  const getRiskBadge = (risk: string) => {
    if (risk === 'critical') {
      return <Badge className="bg-red-500 text-white">Crítico</Badge>;
    }
    if (risk === 'high') {
      return <Badge className="bg-orange-500 text-white">Alto</Badge>;
    }
    return <Badge className="bg-yellow-500 text-white">Médio</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Colaborador
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Departamento
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
              Dias Vencidos
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
              Provisão
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
              Risco
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {item.department}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-red-600 dark:text-red-400">
                {item.daysOverdue} dias
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.provision)}
              </td>
              <td className="px-4 py-3 text-center">{getRiskBadge(item.risk)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 bg-muted/30">
            <td colSpan={3} className="px-4 py-3 text-sm font-bold">
              Total ({props.data.length} colaboradores)
            </td>
            <td className="px-4 py-3 text-right text-sm font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(props.data.reduce((sum, item) => sum + item.provision, 0))}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

