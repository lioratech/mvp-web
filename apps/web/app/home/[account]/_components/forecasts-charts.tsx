'use client';

import { useMemo } from 'react';

import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import { InsightsModel } from './insights-model';

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
  ChartTooltipContent,
} from '@kit/ui/chart';

export default function ForecastsCharts() {
  const headcountForecastData = useMemo(() => generateHeadcountForecastData(), []);
  const costForecastData = useMemo(() => generateCostForecastData(), []);
  const turnoverForecastData = useMemo(() => generateTurnoverForecastData(), []);
  const hiringForecastData = useMemo(() => generateHiringForecastData(), []);

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Previsão de Headcount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">165</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              +8,5% até Dez/25
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Previsão de Custos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">R$ 1.1M</span>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              +6,2% até Dez/25
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnover Projetado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">1,2%</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Média próximos 3 meses
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contratações Previstas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">18</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Próximos 6 meses
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Projeção de Headcount
            </CardTitle>
            <CardDescription>
              Evolução prevista do quadro de colaboradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeadcountForecastChart data={headcountForecastData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Projeção de Custos
            </CardTitle>
            <CardDescription>
              Evolução prevista dos custos com pessoal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostForecastChart data={costForecastData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Projeção de Turnover
            </CardTitle>
            <CardDescription>
              Turnover previsto para os próximos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TurnoverForecastChart data={turnoverForecastData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projeção de Contratações
            </CardTitle>
            <CardDescription>
              Necessidade de contratação por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HiringForecastChart data={hiringForecastData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <InsightsModel panelType="sales" />
      </div>
    </div>
  );
}

function generateHeadcountForecastData() {
  return [
    { month: 'Jun/25', real: 140, projecao: null },
    { month: 'Jul/25', real: 148, projecao: null },
    { month: 'Ago/25', real: 152, projecao: null },
    { month: 'Set/25', real: null, projecao: 155 },
    { month: 'Out/25', real: null, projecao: 158 },
    { month: 'Nov/25', real: null, projecao: 162 },
    { month: 'Dez/25', real: null, projecao: 165 },
  ];
}

function generateCostForecastData() {
  return [
    { month: 'Jun/25', real: 976065, projecao: null },
    { month: 'Jul/25', real: 990866, projecao: null },
    { month: 'Ago/25', real: 1015000, projecao: null },
    { month: 'Set/25', real: null, projecao: 1035000 },
    { month: 'Out/25', real: null, projecao: 1055000 },
    { month: 'Nov/25', real: null, projecao: 1080000 },
    { month: 'Dez/25', real: null, projecao: 1100000 },
  ];
}

function generateTurnoverForecastData() {
  return [
    { month: 'Jun/25', real: 0.70, projecao: null },
    { month: 'Jul/25', real: 1.39, projecao: null },
    { month: 'Ago/25', real: 1.33, projecao: null },
    { month: 'Set/25', real: null, projecao: 1.25 },
    { month: 'Out/25', real: null, projecao: 1.20 },
    { month: 'Nov/25', real: null, projecao: 1.15 },
    { month: 'Dez/25', real: null, projecao: 1.10 },
  ];
}

function generateHiringForecastData() {
  return [
    { area: 'Comercial', contratacoes: 5 },
    { area: 'Desenvolvimento', contratacoes: 4 },
    { area: 'Operações', contratacoes: 4 },
    { area: 'Marketing', contratacoes: 3 },
    { area: 'Administrativo', contratacoes: 2 },
  ];
}

function HeadcountForecastChart(props: {
  data: { month: string; real: number | null; projecao: number | null }[];
}) {
  const chartConfig = {
    real: {
      label: 'Real:',
      color: '#3b82f6',
    },
    projecao: {
      label: 'Projeção:',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <defs>
          <linearGradient id="fillReal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillProjecao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="real"
          type="monotone"
          fill="url(#fillReal)"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          connectNulls={false}
        />
        <Area
          dataKey="projecao"
          type="monotone"
          fill="url(#fillProjecao)"
          stroke="#f97316"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function CostForecastChart(props: {
  data: { month: string; real: number | null; projecao: number | null }[];
}) {
  const chartConfig = {
    real: {
      label: 'Real:',
      color: '#10b981',
    },
    projecao: {
      label: 'Projeção:',
      color: '#f59e0b',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <defs>
          <linearGradient id="fillCostReal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillCostProjecao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => [
                `R$ ${Number(value).toLocaleString('pt-BR')}`,
              ]}
            />
          }
        />
        <Area
          dataKey="real"
          type="monotone"
          fill="url(#fillCostReal)"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          connectNulls={false}
        />
        <Area
          dataKey="projecao"
          type="monotone"
          fill="url(#fillCostProjecao)"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function TurnoverForecastChart(props: {
  data: { month: string; real: number | null; projecao: number | null }[];
}) {
  const chartConfig = {
    real: {
      label: 'Real:',
      color: '#ef4444',
    },
    projecao: {
      label: 'Projeção:',
      color: '#ec4899',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => [`${Number(value).toFixed(2)}%`]}
            />
          }
        />
        <Line
          dataKey="real"
          type="monotone"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          connectNulls={false}
        />
        <Line
          dataKey="projecao"
          type="monotone"
          stroke="#ec4899"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function HiringForecastChart(props: {
  data: { area: string; contratacoes: number }[];
}) {
  const chartConfig = {
    contratacoes: {
      label: 'Contratações:',
      color: '#8b5cf6',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{ left: 80, right: 40, top: 10, bottom: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="area"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={75}
          tick={{ fontSize: 12 }}
        />
        <XAxis dataKey="contratacoes" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="contratacoes" fill="#8b5cf6" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

