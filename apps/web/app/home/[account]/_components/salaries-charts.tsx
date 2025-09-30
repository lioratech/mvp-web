'use client';

import { useMemo } from 'react';

import { Mars, Venus } from 'lucide-react';
import {
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

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Salário Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(1250000.00)}
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
           <CardContent className='flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center'>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {formatCurrency(7850.00)}
              </span>
            </div>
             <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <Venus size={19} className="text-pink-500" />
                <span className="text-md">R$ 7.200,00
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mars size={19} className="text-blue-500" />
                <span className="text-md">R$ 8.500,00
                </span>
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
                {formatCurrency(180000.00)}
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
              <span className="text-2xl font-bold">{formatCurrency(45000.00)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

     

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
