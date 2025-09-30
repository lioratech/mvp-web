'use client';

import { useMemo, useState } from 'react';

import {
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@kit/ui/button';
import { InsightsModel } from './insights-model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@kit/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function WorkforceCostsCharts() {
  const workforceCostsData = useMemo(() => generateWorkforceCostsData(), []);
  const overtimeCostsByAreaData = useMemo(() => generateOvertimeCostsByAreaData(), []);
  const overtimeCostsByBranchData = useMemo(() => generateOvertimeCostsByBranchData(), []);
  const payrollCostsByAreaData = useMemo(() => generatePayrollCostsByAreaData(), []);
  const [timeRange, setTimeRange] = useState('12m');

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Custo da Folha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(724317.37)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Custo da Folha com Encargos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(990866.16)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Custo dos Benefícios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(368879.65)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Custo com PLR/PPR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{formatCurrency(573542.24)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custo Médio por Colaborador e por Rescisões */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Custo Médio por Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(6518.86)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Custo Médio por Rescisões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(129945.68)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução dos Custos */}
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-left">
              Evolução dos custos da folha
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12m">Últimos 12 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <WorkforceCostsChart
              data={workforceCostsData}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Custo de horas extras por área</CardTitle>
          </CardHeader>
          <CardContent>
            <OvertimeCostsByAreaChart data={overtimeCostsByAreaData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custo de horas extras por filial</CardTitle>
          </CardHeader>
          <CardContent>
            <OvertimeCostsByBranchChart data={overtimeCostsByBranchData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custo da folha por área</CardTitle>
          </CardHeader>
          <CardContent>
            <PayrollCostsByAreaChart data={payrollCostsByAreaData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <InsightsModel 
          panelType="workforce-costs"
        />
      </div>
    </div>
  );
}

// Funções de geração de dados
function generateWorkforceCostsData() {
  return [
    { 
      month: 'set./24', 
      payroll: 623825.88, 
      payrollWithCharges: 853393.80, 
      benefits: 242542.26, 
      plr: 458654.25,
      avgPerEmployee: 6827.15,
      avgPerTermination: 211325.23,
      overtime: 11024.69 
    },
    { 
      month: 'out./24', 
      payroll: 640835.78, 
      payrollWithCharges: 876663.35, 
      benefits: 268545.52, 
      plr: 0,
      avgPerEmployee: 6743.56,
      avgPerTermination: 178974.65,
      overtime: 13456.28 
    },
    { 
      month: 'nov./24', 
      payroll: 635131.35, 
      payrollWithCharges: 868859.69, 
      benefits: 263582.23, 
      plr: 0,
      avgPerEmployee: 6735.35,
      avgPerTermination: 65231.20,
      overtime: 9451.00 
    },
    { 
      month: 'dez./24', 
      payroll: 651965.86, 
      payrollWithCharges: 891889.30, 
      benefits: 285352.45, 
      plr: 0,
      avgPerEmployee: 6705.93,
      avgPerTermination: 154743.84,
      overtime: 10659.25 
    },
    { 
      month: 'jan./25', 
      payroll: 679788.60, 
      payrollWithCharges: 929950.80, 
      benefits: 309548.45, 
      plr: 0,
      avgPerEmployee: 6787.96,
      avgPerTermination: 268713.29,
      overtime: 1125.23 
    },
    { 
      month: 'fev./25', 
      payroll: 674018.16, 
      payrollWithCharges: 922056.84, 
      benefits: 303328.91, 
      plr: 0,
      avgPerEmployee: 6830.05,
      avgPerTermination: 43658.77,
      overtime: 2587.63 
    },
    { 
      month: 'mar./25', 
      payroll: 707765.35, 
      payrollWithCharges: 968223.00, 
      benefits: 341280.41, 
      plr: 573542.24,
      avgPerEmployee: 6915.88,
      avgPerTermination: 354258.98,
      overtime: 851.79 
    },
    { 
      month: 'abr./25', 
      payroll: 696214.31, 
      payrollWithCharges: 952421.18, 
      benefits: 315847.59, 
      plr: 0,
      avgPerEmployee: 6851.95,
      avgPerTermination: 134264.52,
      overtime: 1389.74 
    },
    { 
      month: 'mai./25', 
      payroll: 713014.43, 
      payrollWithCharges: 975403.74, 
      benefits: 352894.78, 
      plr: 0,
      avgPerEmployee: 6726.92,
      avgPerTermination: 182497.65,
      overtime: 0.00 
    },
    { 
      month: 'jun./25', 
      payroll: 702345.25, 
      payrollWithCharges: 960808.30, 
      benefits: 343745.25, 
      plr: 0,
      avgPerEmployee: 6862.92,
      avgPerTermination: 78335.33,
      overtime: 3654.89 
    },
    { 
      month: 'jul./25', 
      payroll: 713497.85, 
      payrollWithCharges: 976065.06, 
      benefits: 352324.11, 
      plr: 0,
      avgPerEmployee: 6595.03,
      avgPerTermination: 125456.88,
      overtime: 311.20 
    },
    { 
      month: 'ago./25', 
      payroll: 724317.37, 
      payrollWithCharges: 990866.16, 
      benefits: 368879.65, 
      plr: 0,
      avgPerEmployee: 6518.86,
      avgPerTermination: 129945.68,
      overtime: 1274.64 
    },
  ];
}

function generateOvertimeCostsByAreaData() {
  return [
    { area: 'Operações', cost: 586.3344 },
    { area: 'Desenvolvimento', cost: 305.9136 },
    { area: 'Comercial', cost: 140.2104 },
    { area: 'Marketing', cost: 140.2104 },
    { area: 'TI', cost: 38.2392 },
    { area: 'Administrativo', cost: 38.2392 },
    { area: 'RH', cost: 25.4928 },
  ];
}

function generateOvertimeCostsByBranchData() {
  return [
    { branch: 'São Paulo', cost: 573.588 },
    { branch: 'Belo Horizonte', cost: 280.4208 },
    { branch: 'Campinas', cost: 165.7032 },
    { branch: 'Salvador', cost: 140.2104 },
    { branch: 'Curitiba', cost: 114.7176 },
  ];
}

function generatePayrollCostsByAreaData() {
  return [
    { area: 'Desenvolvimento', cost: 317077.17 },
    { area: 'Operações', cost: 227899.22 },
    { area: 'TI', cost: 108995.28 },
    { area: 'Comercial', cost: 108995.28 },
    { area: 'Marketing', cost: 108995.28 },
    { area: 'Administrativo', cost: 89177.95 },
    { area: 'RH', cost: 29725.98 },
  ];
}

// Componentes de gráficos
function WorkforceCostsChart(props: {
  data: any[];
  timeRange: string;
  setTimeRange: (value: string) => void;
}) {
  const filteredData = props.data.filter((item) => {
    const monthIndex = props.data.indexOf(item);
    let monthsToSubtract = 12;
    if (props.timeRange === '6m') {
      monthsToSubtract = 6;
    } else if (props.timeRange === '3m') {
      monthsToSubtract = 3;
    }
    return monthIndex >= (12 - monthsToSubtract);
  });

  const chartConfig = {
    payroll: {
      label: 'Custo da folha:',
      color: '#f97316', // Laranja
    },
    payrollWithCharges: {
      label: 'Custo da folha + encargos:',
      color: '#dc2626', 
    },
    benefits: {
      label: 'Custo dos benefícios:',
      color: '#059669',
    },
    plr: {
      label: 'Custo PLR/PPR:',
      color: '#7c3aed', 
    },
    avgPerEmployee: {
      label: 'Custo médio por colaborador:',
      color: '#0ea5e9', 
    },
    avgPerTermination: {
      label: 'Custo médio por rescisões:',
      color: '#d97706',
    },
    overtime: {
      label: 'Custo de horas extras:',
      color: '#ec4899', 
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <AreaChart
          accessibilityLayer
          data={filteredData}
          margin={{ top: 20, left: 12, right: 12 }}
        >
          <defs>
            <linearGradient id="fillPayroll" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-payroll)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-payroll)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillPayrollWithCharges" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-payrollWithCharges)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-payrollWithCharges)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillBenefits" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-benefits)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-benefits)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillPlr" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-plr)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-plr)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillAvgPerEmployee" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-avgPerEmployee)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-avgPerEmployee)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillAvgPerTermination" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-avgPerTermination)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-avgPerTermination)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillOvertime" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-overtime)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-overtime)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;

              const monthNames = {
                'set./24': 'Setembro de 2024',
                'out./24': 'Outubro de 2024',
                'nov./24': 'Novembro de 2024',
                'dez./24': 'Dezembro de 2024',
                'jan./25': 'Janeiro de 2025',
                'fev./25': 'Fevereiro de 2025',
                'mar./25': 'Março de 2025',
                'abr./25': 'Abril de 2025',
                'mai./25': 'Maio de 2025',
                'jun./25': 'Junho de 2025',
                'jul./25': 'Julho de 2025',
                'ago./25': 'Agosto de 2025',
              };

              // Ordenar os payloads por valor decrescente para seguir a ordem visual do gráfico
              const sortedPayload = payload
                .filter((entry) => entry.value !== 0)
                .sort((a, b) => (b.value as number) - (a.value as number));

              return (
                <div className="bg-background border border-border shadow-lg rounded-lg p-3 min-w-[280px]">
                  <p className="font-medium text-sm mb-2">
                    {monthNames[label as keyof typeof monthNames] || label}
                  </p>
                  <div className="space-y-1">
                    {sortedPayload.map((entry, index) => {
                        const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
                        if (!config) return null;
                        
                        return (
                          <div key={index} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-sm" 
                                style={{ backgroundColor: config.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {config.label}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {formatCurrency(entry.value as number)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }}
          />
          <Area
            dataKey="overtime"
            type="natural"
            fill="url(#fillOvertime)"
            stroke="var(--color-overtime)"
            stackId="a"
            dot={{ fill: 'var(--color-overtime)', strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: 'var(--color-overtime)',
              strokeWidth: 2,
            }}
          />
          <Area
            dataKey="plr"
            type="natural"
            fill="url(#fillPlr)"
            stroke="var(--color-plr)"
            stackId="a"
            dot={{ fill: 'var(--color-plr)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-plr)', strokeWidth: 2 }}
          />
          <Area
            dataKey="benefits"
            type="natural"
            fill="url(#fillBenefits)"
            stroke="var(--color-benefits)"
            stackId="a"
            dot={{ fill: 'var(--color-benefits)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-benefits)', strokeWidth: 2 }}
          />
          <Area
            dataKey="avgPerEmployee"
            type="natural"
            fill="url(#fillAvgPerEmployee)"
            stroke="var(--color-avgPerEmployee)"
            stackId="a"
            dot={{ fill: 'var(--color-avgPerEmployee)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-avgPerEmployee)', strokeWidth: 2 }}
          />
          <Area
            dataKey="avgPerTermination"
            type="natural"
            fill="url(#fillAvgPerTermination)"
            stroke="var(--color-avgPerTermination)"
            stackId="a"
            dot={{ fill: 'var(--color-avgPerTermination)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-avgPerTermination)', strokeWidth: 2 }}
          />
          <Area
            dataKey="payroll"
            type="natural"
            fill="url(#fillPayroll)"
            stroke="var(--color-payroll)"
            stackId="a"
            dot={{ fill: 'var(--color-payroll)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-payroll)', strokeWidth: 2 }}
          />
          <Area
            dataKey="payrollWithCharges"
            type="natural"
            fill="url(#fillPayrollWithCharges)"
            stroke="var(--color-payrollWithCharges)"
            stackId="a"
            dot={{ fill: 'var(--color-payrollWithCharges)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-payrollWithCharges)', strokeWidth: 2 }}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

function OvertimeCostsByAreaChart(props: {
  data: { area: string; cost: number }[];
}) {
  const chartConfig = {
    cost: {
      label: 'Custo: R$ ', 
      color: '#f97316',
    },
  } satisfies ChartConfig;

  if (props.data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <span className="text-muted-foreground">Sem dados</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 80, right: 120, top: 20, bottom: 20 }}
          width={undefined}
          height={undefined}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="area"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={70}
            tick={{ fontSize: 12 }}
          />
          <XAxis dataKey="cost" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar dataKey="cost" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="cost"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => formatCurrency(value)}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function OvertimeCostsByBranchChart(props: {
  data: { branch: string; cost: number }[];
}) {
  const chartConfig = {
    cost: {
      label: 'Custo:  R$ ',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  if (props.data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <span className="text-muted-foreground">Sem dados</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 80, right: 120, top: 20, bottom: 20 }}
          width={undefined}
          height={undefined}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="branch"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={70}
            tick={{ fontSize: 12 }}
          />
          <XAxis dataKey="cost" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar dataKey="cost" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="cost"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => formatCurrency(value)}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function PayrollCostsByAreaChart(props: {
  data: { area: string; cost: number }[];
}) {
  const chartConfig = {
    cost: {
      label: 'Custo: R$ ',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  if (props.data.length === 0) {
  return (
      <div className="flex h-64 w-full items-center justify-center">
        <span className="text-muted-foreground">Sem dados</span>
            </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 80, right: 120, top: 20, bottom: 20 }}
          width={undefined}
          height={undefined}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="area"
            type="category"
              tickLine={false}
            tickMargin={10}
              axisLine={false}
          />
          <XAxis dataKey="cost" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar dataKey="cost" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="cost"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => formatCurrency(value)}
            />
          </Bar>
          </BarChart>
        </ChartContainer>
    </div>
  );
}