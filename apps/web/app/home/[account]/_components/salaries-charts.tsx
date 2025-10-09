'use client';

import { useMemo } from 'react';

import { Mars, Venus } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@kit/ui/chart';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function SalariesCharts() {
  const salariesByAreaData = useMemo(() => generateSalariesByAreaData(), []);
  const salariesByRoleData = useMemo(() => generateSalariesByRoleData(), []);
  const salariesByBranchData = useMemo(
    () => generateSalariesByBranchData(),
    [],
  );
  const salaryEvolutionData = useMemo(() => generateSalaryEvolutionData(), []);

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Salário Base Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(2400000.00)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Salário Base Médio
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(15000.00)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Venus size={16} className="text-pink-500 flex-shrink-0" />
                <span className="text-sm">R$ 13.800,00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mars size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">R$ 16.200,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pagamento de PLR/PPR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(360000.00)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pagamento de Bônus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{formatCurrency(90000.00)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

     

      <Card>
        <CardHeader>
          <CardTitle>Evolução do Salário Base</CardTitle>
        </CardHeader>
        <CardContent>
          <SalaryEvolutionChart data={salaryEvolutionData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Salário base por area</CardTitle>
          </CardHeader>
          <CardContent>
            <SalariesByAreaChart data={salariesByAreaData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salário médio por cargo</CardTitle>
          </CardHeader>
          <CardContent>
            <SalariesByRoleChart data={salariesByRoleData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salário base por filial</CardTitle>
          </CardHeader>
          <CardContent>
            <SalariesByBranchChart data={salariesByBranchData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function generateSalariesByAreaData() {
  return [
    { area: 'Tecnologia', salary: 12500.00 },
    { area: 'Financeiro', salary: 8900.00 },
    { area: 'Comercial', salary: 7200.00 },
    { area: 'Marketing', salary: 6800.00 },
    { area: 'RH', salary: 5500.00 },
    { area: 'Administrativo', salary: 4800.00 },
    { area: 'Operacional', salary: 4200.00 },
  ];
}

function generateSalariesByRoleData() {
  return [
    { role: 'Desenvolvedor Senior', salary: 15000.00 },
    { role: 'Gerente de Projetos', salary: 12000.00 },
    { role: 'Analista Financeiro', salary: 8500.00 },
    { role: 'Coordenador de Vendas', salary: 7500.00 },
    { role: 'Designer UX/UI', salary: 6800.00 },
    { role: 'Assistente Administrativo', salary: 4500.00 },
  ];
}

function generateSalariesByBranchData() {
  return [
    { branch: 'São Paulo - SP', salary: 9500.00 },
    { branch: 'Rio de Janeiro - RJ', salary: 8200.00 },
    { branch: 'Belo Horizonte - MG', salary: 7200.00 },
    { branch: 'Brasília - DF', salary: 6800.00 },
    { branch: 'Porto Alegre - RS', salary: 6500.00 },
    { branch: 'Salvador - BA', salary: 5800.00 },
  ];
}

function generateSalaryEvolutionData() {
  const data = [];
  const now = new Date();
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  // Valor inicial e final
  const startSalary = 1816.00;
  const endSalary = 15000.00;
  const totalMonths = 12;
  
  // Calcula o incremento mensal para atingir o valor final
  const monthlyIncrement = (endSalary - startSalary) / (totalMonths - 1);
  
  // Gera dados dos últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    
    // Calcula o salário para este mês
    const monthsFromStart = 11 - i;
    const baseSalaryForMonth = startSalary + (monthlyIncrement * monthsFromStart);
    
    // Adiciona pequena variação aleatória (±2%)
    const variation = (Math.random() - 0.5) * 0.04;
    const totalSalary = baseSalaryForMonth * (1 + variation);
    
    data.push({
      month: `${month}/${year}`,
      totalSalary: Math.round(totalSalary * 100) / 100,
    });
  }
  
  return data;
}

function SalariesByAreaChart(props: {
  data: { area: string; salary: number }[];
}) {
  const chartConfig = {
    salary: {
      label: 'Salário:',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        Sem dados
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 100, right: 40, top: 10, bottom: 10 }}
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
            width={90}
            tick={{ fontSize: 12 }}
          />
          <XAxis dataKey="salary" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value: number) => formatCurrency(value)}
              />
            }
          />
          <Bar dataKey="salary" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="salary"
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

function SalariesByRoleChart(props: {
  data: { role: string; salary: number }[];
}) {
  const chartConfig = {
    salary: {
      label: 'Salário:',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        Sem dados
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 120, right: 40, top: 10, bottom: 10 }}
          width={undefined}
          height={undefined}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="role"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={110}
            tick={{ fontSize: 12 }}
          />
          <XAxis dataKey="salary" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value: number) => formatCurrency(value)}
              />
            }
          />
          <Bar dataKey="salary" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="salary"
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

function SalariesByBranchChart(props: {
  data: { branch: string; salary: number }[];
}) {
  const chartConfig = {
    salary: {
      label: 'Salário:',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        Sem dados
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 120, right: 40, top: 10, bottom: 10 }}
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
            width={110}
            tick={{ fontSize: 12 }}
          />
          <XAxis dataKey="salary" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value: number) => formatCurrency(value)}
              />
            }
          />
          <Bar dataKey="salary" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="salary"
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

function SalaryEvolutionChart(props: {
  data: { month: string; totalSalary: number }[];
}) {
  const chartConfig = {
    totalSalary: {
      label: 'Salário Base Total',
      color: '#3b82f6',
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        Sem dados
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <AreaChart
          accessibilityLayer
          data={props.data}
          margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
        >
          <defs>
            <linearGradient id="fillSalaryEvolution" x1="0" y1="0" x2="0" y2="1">
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
            minTickGap={32}
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
              if (!active || !payload || payload.length === 0) return null;

              return (
                <div className="rounded-lg border bg-white p-3 shadow-md">
                  <p className="font-medium text-sm mb-2">
                    {payload[0].payload.month}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-sm" 
                        style={{ backgroundColor: '#3b82f6' }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Salário Base Total:
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(payload[0].value as number)}
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Area
            dataKey="totalSalary"
            type="monotone"
            fill="url(#fillSalaryEvolution)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
