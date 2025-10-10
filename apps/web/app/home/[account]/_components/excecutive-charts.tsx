'use client';

import { useMemo, useState } from 'react';

import {
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  IdCardLanyard,
  Mars,
  Menu,
  TrendingUp,
  UserRoundMinus,
  Users,
  Venus,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@kit/ui/badge';
import { InsightsModel } from './insights-model';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';

export default function DashboardDemo() {
  const colaboradoresData = useMemo(() => generateColaboradoresData(), []);
  const turnoverData = useMemo(() => generateTurnoverData(), []);
  const turnoverByDepartmentData = useMemo(
    () => generateTurnoverByDepartmentData(),
    [],
  );
  const leadershipPositionsData = useMemo(
    () => generateLeadershipPositionsData(),
    [],
  );
  const costTrendsData = useMemo(() => generateCostTrendsData(), []);

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Índice de Estabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">92%</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Líderes com +2 anos na função
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Férias em Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">8</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Colaboradores com férias vencendo
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cota de PCD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">5/8</span>
            </div>
            <span className="text-sm text-muted-foreground">
              62,5% da cota preenchida
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cota de Aprendizes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">12/15</span>
            </div>
            <span className="text-sm text-muted-foreground">
              80% da cota preenchida
            </span>
          </CardContent>
        </Card>
      </div>

      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4'
        }
      >
        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Users />
              <span>Colaboradores</span>
              <Trend trend={'up'}>20%</Trend>
            </CardTitle>

            <CardDescription>
              <span>Quantidade de colaboradores ativos</span>
            </CardDescription>

            <div>
              <Figure>152</Figure>
            </div>
          </CardHeader>

          <CardContent className={'space-y-4'}>
            <ColaboradoresChart data={colaboradoresData} />
          </CardContent>
          <CardFooter>
            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                Colaboradores por gênero
              </h3>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500">
                    <span className="text-sm font-bold text-white">
                      <Venus />
                    </span>
                  </div>
                  <span className="text-2xl font-bold">97</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                    <span className="text-sm font-bold text-white">
                      <Mars />
                    </span>
                  </div>
                  <span className="text-2xl font-bold">55</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <UserRoundMinus />
              <span>Turnover</span>
              <Trend trend={'up'}>12%</Trend>
            </CardTitle>

            <CardDescription>
              <span>Turnover dos ultimos 4 meses</span>
            </CardDescription>

            <div>
              <Figure>12%</Figure>
            </div>
          </CardHeader>

          <CardContent>
            <TurnoverChart data={turnoverData} />
            {/* <div className="mt-4">
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                Turnover por departamento
              </h3>
              <TurnoverByDepartmentChart data={turnoverByDepartmentData} />
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <IdCardLanyard />
              <span>Liderança</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Saúde da Liderança</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Diversidade de gênero equilibrada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Retenção de líderes: 95%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span>Desenvolvimento contínuo ativo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Satisfação da equipe: 88%</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>

            <CardDescription>
              <span>Informações sobre a liderança da sua empresa</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-start gap-8">
              <div className="flex flex-1 flex-col items-center">
                <LeadershipRadialChart />
              </div>

              {/* <div className="flex flex-1 flex-col">
                <h3 className="text-md mb-4 font-semibold text-gray-700">
                  Amplitude de controle
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Diretor
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">4</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Coord. Administrativo
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">1</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Coord. de Vendas
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">5</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Gerente de Suporte
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">1</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Coord. de Suporte 
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Gerente de Tecnol.                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Coord. de Dev                     </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                      Coord. de Marketing                  </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">1</span>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <div className="mt-8">
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                Cargos de liderança
              </h3>
              <LeadershipPositionsChart data={leadershipPositionsData} />
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <CircleDollarSign />
              <span>Custos</span>
            </CardTitle>

            <CardDescription>
              <span>Comparado com o último mês</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Custo da folha
                  </p>
                  <p className="text-lg font-bold">R$ 724.317,37</p>
                  <p className="text-xs text-muted-foreground">
                    Jul./25: R$ 713.497,85
                  </p>
                </div>
                <Trend trend={'up'}>+1,5%</Trend>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Custo da folha com encargos
                  </p>
                  <p className="text-lg font-bold">R$ 990.866,16</p>
                  <p className="text-xs text-muted-foreground">
                    Jul./25: R$ 976.065,06
                  </p>
                </div>
                <Trend trend={'up'}>+1,5%</Trend>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Custo médio de rescisões
                  </p>
                  <p className="text-lg font-bold">R$ 129.945,68</p>
                  <p className="text-xs text-muted-foreground">
                    Jul./25: R$ 125.456,88
                  </p>
                </div>
                <Trend trend={'up'}>+3,6%</Trend>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Custo de horas extras
                  </p>
                  <p className="text-lg font-bold">R$ 1.274,64</p>
                  <p className="text-xs text-muted-foreground">
                    Jul./25: R$ 311,20
                  </p>
                </div>
                <Trend trend={'up'}>+309,6%</Trend>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        {/* <InsightsModel 
          panelType="sales"
        /> */}
      </div>
    </div>
  );
}

function generateColaboradoresData() {
  return [
    {
      month: 'jun./25',
      ativos: 140,
      afastados: 1,
      demitidos: 1,
    },
    {
      month: 'jul./25',
      ativos: 148,
      afastados: 2,
      demitidos: 2,
    },
    {
      month: 'ago./25',
      ativos: 152,
      afastados: 2,
      demitidos: 2,
    },
  ];
}

function generateTurnoverData() {
  return [
    {
      month: 'jun./25',
      turnover: 0.70,
    },
    {
      month: 'jul./25',
      turnover: 1.39,
    },
    {
      month: 'ago./25',
      turnover: 1.33,
    },
  ];
}

function generateTurnoverByDepartmentData() {
  return [
    {
      department: 'Comercial',
      turnover: 4.3,
      color: '#f59e0b',
    },
    {
      department: 'Operações',
      turnover: 3.6,
      color: '#f97316',
    },
    {
      department: 'Desenvolvimento',
      turnover: 3.6,
      color: '#06b6d4',
    },
    {
      department: 'Administrativo',
      turnover: 2.2,
      color: '#3b82f6',
    },
    {
      department: 'Marketing',
      turnover: 1.4,
      color: '#ef4444',
    },
    {
      department: 'TI',
      turnover: 0.7,
      color: '#8b5cf6',
    },
    {
      department: 'RH',
      turnover: 0.0,
      color: '#10b981',
    },
  ];
}

function getDepartmentColor(department: string): string {
  const colors: { [key: string]: string } = {
    Administrativo: '#3b82f6', 
    Financeiro: '#10b981', 
    Comercial: '#f59e0b',
    Marketing: '#ef4444', 
    RH: '#8b5cf6', 
    TI: '#06b6d4', 
    Operações: '#f97316', 
    Vendas: '#84cc16', 
  };

  return colors[department] || '#6b7280'; 
}

function generateLeadershipPositionsData() {
  return [
    { position: 'Coord. de Suporte', count: 8, color: '#fbbf24' },
    { position: 'Coord. de Vendas', count: 5, color: '#f59e0b' },
    { position: 'Diretor', count: 4, color: '#d97706' },
    { position: 'Coord. de Dev', count: 4, color: '#b45309' },
    { position: 'Coord. Administrativo', count: 1, color: '#92400e' },
    { position: 'Gerente de Suporte', count: 1, color: '#78350f' },
    { position: 'Gerente de Tecnol.', count: 1, color: '#451a03' },
    { position: 'Coord. de Marketing', count: 1, color: '#fbbf24' },
  ];
}

function generateCostTrendsData() {
  return [
    {
      month: 'jul./25',
      custoFolha: 713497.85,
      custoFolhaEncargos: 976065.06,
      custoMedioRescisoes: 125456.88,
      custoHorasExtras: 311.20,
    },
    {
      month: 'ago./25',
      custoFolha: 724317.37,
      custoFolhaEncargos: 990866.16,
      custoMedioRescisoes: 129945.68,
      custoHorasExtras: 1274.64,
    },
  ];
}

function LeadershipRadialChart() {
  const chartData = [{ mulheres: 6, homens: 17 }];

  const chartConfig = {
    mulheres: {
      label: 'Mulheres',
      color: '#ec4899', 
    },
    homens: {
      label: 'Homens',
      color: '#3b82f6', 
    },
  } satisfies ChartConfig;

  const totalLiderancas =
    (chartData[0]?.mulheres || 0) + (chartData[0]?.homens || 0);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[200px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={60}
        outerRadius={100}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalLiderancas.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Lideranças
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="mulheres"
          stackId="a"
          cornerRadius={5}
          fill="#ec4899"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="homens"
          fill="#3b82f6"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

function LeadershipPositionsChart(
  props: React.PropsWithChildren<{
    data: { position: string; count: number; color: string }[];
  }>,
) {
  const chartConfig = {
    count: {
      label: 'Quantidade',
      color: '#fbbf24',
    },
    label: {
      color: 'var(--background)',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full overflow-hidden">
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{
          left: 80,
          right: 80,
          top: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="position"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={70}
          tick={{ fontSize: 12 }}
        />
        <XAxis dataKey="count" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar 
          dataKey="count" 
          layout="vertical" 
          radius={4}
          fill="#f97316"
        >
          <LabelList
            dataKey="count"
            position="right"
            offset={4}
            className="fill-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function CostTrendChart(
  props: React.PropsWithChildren<{
    data: {
      month: string;
      custoFolha: number;
      custoFolhaEncargos: number;
      custoMedioRescisoes: number;
      custoHorasExtras: number;
    }[];
    dataKey: string;
  }>,
) {
  const chartConfig = {
    value: {
      label: 'Valor',
      color: 'var(--color-value)',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="[--color-value:theme(colors.foreground)] h-12 w-full"
    >
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={2}
          tickFormatter={(value: string) => value.slice(0, 3)}
          fontSize={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Mês: ${value}`}
              formatter={(value) => [
                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              ]}
            />
          }
        />
        <Line
          dataKey={props.dataKey}
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={1.5}
          dot={{
            fill: 'var(--color-value)',
            strokeWidth: 2,
            r: 3,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}

function ColaboradoresChart(
  props: React.PropsWithChildren<{
    data: {
      month: string;
      ativos: number;
      afastados: number;
      demitidos: number;
    }[];
  }>,
) {
  const chartConfig = {
    ativos: {
      label: 'Ativos',
      color: '#00c950', 
    },
    demitidos: {
      label: 'Demitidos',
      color: '#ef4444', 
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={props.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="ativos"
          stackId="a"
          fill="#00c950"
          radius={[0, 0, 4, 4]}
        />
     
        <Bar
          dataKey="demitidos"
          stackId="a"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

function TurnoverChart(
  props: React.PropsWithChildren<{
    data: { month: string; turnover: number }[];
  }>,
) {
  const chartConfig = {
    turnover: {
      label: 'Turnover (%)',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="turnover"
          type="natural"
          stroke="var(--color-turnover)"
          strokeWidth={2}
          dot={{
            fill: 'var(--color-turnover)',
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
}

function TurnoverByDepartmentChart(
  props: React.PropsWithChildren<{
    data: { department: string; turnover: number; color: string }[];
  }>,
) {
  const chartConfig = {
    turnover: {
      label: 'Turnover (%)',
      color: '#f97316', 
    },
    label: {
      color: 'var(--background)',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full overflow-hidden">
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{
          left: 100,
          right: 80,
          top: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="department"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={90}
          tick={{ fontSize: 12 }}
        />
        <XAxis dataKey="turnover" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="turnover" layout="vertical" fill="#f97316" radius={4}>
          <LabelList
            dataKey="turnover"
            position="right"
            offset={4}
            className="fill-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function _CustomersTable() {
  const customers = [
    {
      name: 'John Doe',
      email: 'john@makerkit.dev',
      plan: 'Pro',
      mrr: '$120.5',
      logins: 1020,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Emma Smith',
      email: 'emma@makerit.dev',
      plan: 'Basic',
      mrr: '$65.4',
      logins: 570,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Robert Johnson',
      email: 'robert@makerkit.dev',
      plan: 'Pro',
      mrr: '$500.1',
      logins: 2050,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Olivia Brown',
      email: 'olivia@makerkit.dev',
      plan: 'Basic',
      mrr: '$10',
      logins: 50,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'Michael Davis',
      email: 'michael@makerkit.dev',
      plan: 'Pro',
      mrr: '$300.2',
      logins: 1520,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Emily Jones',
      email: 'emily@makerkit.dev',
      plan: 'Pro',
      mrr: '$75.7',
      logins: 780,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Daniel Garcia',
      email: 'daniel@makerkit.dev',
      plan: 'Basic',
      mrr: '$50',
      logins: 320,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Liam Miller',
      email: 'liam@makerkit.dev',
      plan: 'Pro',
      mrr: '$90.8',
      logins: 1260,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Emma Clark',
      email: 'emma@makerkit.dev',
      plan: 'Basic',
      mrr: '$0',
      logins: 20,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'Elizabeth Rodriguez',
      email: 'liz@makerkit.dev',
      plan: 'Pro',
      mrr: '$145.3',
      logins: 1380,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'James Martinez',
      email: 'james@makerkit.dev',
      plan: 'Pro',
      mrr: '$120.5',
      logins: 940,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Charlotte Ryan',
      email: 'carlotte@makerkit.dev',
      plan: 'Basic',
      mrr: '$80.6',
      logins: 460,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Lucas Evans',
      email: 'lucas@makerkit.dev',
      plan: 'Pro',
      mrr: '$210.3',
      logins: 1850,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Sophia Wilson',
      email: 'sophia@makerkit.dev',
      plan: 'Basic',
      mrr: '$10',
      logins: 35,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'William Kelly',
      email: 'will@makerkit.dev',
      plan: 'Pro',
      mrr: '$350.2',
      logins: 1760,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Oliver Thomas',
      email: 'olly@makerkit.dev',
      plan: 'Pro',
      mrr: '$145.6',
      logins: 1350,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Samantha White',
      email: 'sam@makerkit.dev',
      plan: 'Basic',
      mrr: '$60.3',
      logins: 425,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Benjamin Lewis',
      email: 'ben@makerkit.dev',
      plan: 'Pro',
      mrr: '$175.8',
      logins: 1600,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Zoe Harris',
      email: 'zoe@makerkit.dev',
      plan: 'Basic',
      mrr: '$0',
      logins: 18,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'Zachary Nelson',
      email: 'zac@makerkit.dev',
      plan: 'Pro',
      mrr: '$255.9',
      logins: 1785,
      status: 'Healthy',
      trend: 'up',
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>MRR</TableHead>
          <TableHead>Logins</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.name}>
            <TableCell className={'flex flex-col'}>
              <span>{customer.name}</span>
              <span className={'text-muted-foreground text-sm'}>
                {customer.email}
              </span>
            </TableCell>
            <TableCell>{customer.plan}</TableCell>
            <TableCell>{customer.mrr}</TableCell>
            <TableCell>{customer.logins}</TableCell>
            <TableCell>
              <BadgeWithTrend trend={customer.trend}>
                {customer.status}
              </BadgeWithTrend>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function BadgeWithTrend(props: React.PropsWithChildren<{ trend: string }>) {
  const className = useMemo(() => {
    switch (props.trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-destructive';
      case 'stale':
        return 'text-orange-500';
    }
  }, [props.trend]);

  return (
    <Badge
      variant={'outline'}
      className={'border-transparent px-1.5 font-normal'}
    >
      <span className={className}>{props.children}</span>
    </Badge>
  );
}

function Figure(props: React.PropsWithChildren) {
  return (
    <div className={'font-heading text-2xl font-semibold'}>
      {props.children}
    </div>
  );
}

function Trend(
  props: React.PropsWithChildren<{
    trend: 'up' | 'down' | 'stale';
  }>,
) {
  const Icon = useMemo(() => {
    switch (props.trend) {
      case 'up':
        return <ArrowUp className={'h-3 w-3 text-green-500'} />;
      case 'down':
        return <ArrowDown className={'text-destructive h-3 w-3'} />;
      case 'stale':
        return <Menu className={'h-3 w-3 text-orange-500'} />;
    }
  }, [props.trend]);

  return (
    <div>
      <BadgeWithTrend trend={props.trend}>
        <span className={'flex items-center space-x-1'}>
          {Icon}
          <span>{props.children}</span>
        </span>
      </BadgeWithTrend>
    </div>
  );
}

export function VisitorsChart() {
  const chartData = useMemo(
    () => [
      { date: '2024-04-01', desktop: 222, mobile: 150 },
      { date: '2024-04-02', desktop: 97, mobile: 180 },
      { date: '2024-04-03', desktop: 167, mobile: 120 },
      { date: '2024-04-04', desktop: 242, mobile: 260 },
      { date: '2024-04-05', desktop: 373, mobile: 290 },
      { date: '2024-04-06', desktop: 301, mobile: 340 },
      { date: '2024-04-07', desktop: 245, mobile: 180 },
      { date: '2024-04-08', desktop: 409, mobile: 320 },
      { date: '2024-04-09', desktop: 59, mobile: 110 },
      { date: '2024-04-10', desktop: 261, mobile: 190 },
      { date: '2024-04-11', desktop: 327, mobile: 350 },
      { date: '2024-04-12', desktop: 292, mobile: 210 },
      { date: '2024-04-13', desktop: 342, mobile: 380 },
      { date: '2024-04-14', desktop: 137, mobile: 220 },
      { date: '2024-04-15', desktop: 120, mobile: 170 },
      { date: '2024-04-16', desktop: 138, mobile: 190 },
      { date: '2024-04-17', desktop: 446, mobile: 360 },
      { date: '2024-04-18', desktop: 364, mobile: 410 },
      { date: '2024-04-19', desktop: 243, mobile: 180 },
      { date: '2024-04-20', desktop: 89, mobile: 150 },
      { date: '2024-04-21', desktop: 137, mobile: 200 },
      { date: '2024-04-22', desktop: 224, mobile: 170 },
      { date: '2024-04-23', desktop: 138, mobile: 230 },
      { date: '2024-04-24', desktop: 387, mobile: 290 },
      { date: '2024-04-25', desktop: 215, mobile: 250 },
      { date: '2024-04-26', desktop: 75, mobile: 130 },
      { date: '2024-04-27', desktop: 383, mobile: 420 },
      { date: '2024-04-28', desktop: 122, mobile: 180 },
      { date: '2024-04-29', desktop: 315, mobile: 240 },
      { date: '2024-04-30', desktop: 454, mobile: 380 },
      { date: '2024-05-01', desktop: 165, mobile: 220 },
      { date: '2024-05-02', desktop: 293, mobile: 310 },
      { date: '2024-05-03', desktop: 247, mobile: 190 },
      { date: '2024-05-04', desktop: 385, mobile: 420 },
      { date: '2024-05-05', desktop: 481, mobile: 390 },
      { date: '2024-05-06', desktop: 498, mobile: 520 },
      { date: '2024-05-07', desktop: 388, mobile: 300 },
      { date: '2024-05-08', desktop: 149, mobile: 210 },
      { date: '2024-05-09', desktop: 227, mobile: 180 },
      { date: '2024-05-10', desktop: 293, mobile: 330 },
      { date: '2024-05-11', desktop: 335, mobile: 270 },
      { date: '2024-05-12', desktop: 197, mobile: 240 },
      { date: '2024-05-13', desktop: 197, mobile: 160 },
      { date: '2024-05-14', desktop: 448, mobile: 490 },
      { date: '2024-05-15', desktop: 473, mobile: 380 },
      { date: '2024-05-16', desktop: 338, mobile: 400 },
      { date: '2024-05-17', desktop: 499, mobile: 420 },
      { date: '2024-05-18', desktop: 315, mobile: 350 },
      { date: '2024-05-19', desktop: 235, mobile: 180 },
      { date: '2024-05-20', desktop: 177, mobile: 230 },
      { date: '2024-05-21', desktop: 82, mobile: 140 },
      { date: '2024-05-22', desktop: 81, mobile: 120 },
      { date: '2024-05-23', desktop: 252, mobile: 290 },
      { date: '2024-05-24', desktop: 294, mobile: 220 },
      { date: '2024-05-25', desktop: 201, mobile: 250 },
      { date: '2024-05-26', desktop: 213, mobile: 170 },
      { date: '2024-05-27', desktop: 420, mobile: 460 },
      { date: '2024-05-28', desktop: 233, mobile: 190 },
      { date: '2024-05-29', desktop: 78, mobile: 130 },
      { date: '2024-05-30', desktop: 340, mobile: 280 },
      { date: '2024-05-31', desktop: 178, mobile: 230 },
      { date: '2024-06-01', desktop: 178, mobile: 200 },
      { date: '2024-06-02', desktop: 470, mobile: 410 },
      { date: '2024-06-03', desktop: 103, mobile: 160 },
      { date: '2024-06-04', desktop: 439, mobile: 380 },
      { date: '2024-06-05', desktop: 88, mobile: 140 },
      { date: '2024-06-06', desktop: 294, mobile: 250 },
      { date: '2024-06-07', desktop: 323, mobile: 370 },
      { date: '2024-06-08', desktop: 385, mobile: 320 },
      { date: '2024-06-09', desktop: 438, mobile: 480 },
      { date: '2024-06-10', desktop: 155, mobile: 200 },
      { date: '2024-06-11', desktop: 92, mobile: 150 },
      { date: '2024-06-12', desktop: 492, mobile: 420 },
      { date: '2024-06-13', desktop: 81, mobile: 130 },
      { date: '2024-06-14', desktop: 426, mobile: 380 },
      { date: '2024-06-15', desktop: 307, mobile: 350 },
      { date: '2024-06-16', desktop: 371, mobile: 310 },
      { date: '2024-06-17', desktop: 475, mobile: 520 },
      { date: '2024-06-18', desktop: 107, mobile: 170 },
      { date: '2024-06-19', desktop: 341, mobile: 290 },
      { date: '2024-06-20', desktop: 408, mobile: 450 },
      { date: '2024-06-21', desktop: 169, mobile: 210 },
      { date: '2024-06-22', desktop: 317, mobile: 270 },
      { date: '2024-06-23', desktop: 480, mobile: 530 },
      { date: '2024-06-24', desktop: 132, mobile: 180 },
      { date: '2024-06-25', desktop: 141, mobile: 190 },
      { date: '2024-06-26', desktop: 434, mobile: 380 },
      { date: '2024-06-27', desktop: 448, mobile: 490 },
      { date: '2024-06-28', desktop: 149, mobile: 200 },
      { date: '2024-06-29', desktop: 103, mobile: 160 },
      { date: '2024-06-30', desktop: 446, mobile: 400 },
    ],
    [],
  );

  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    desktop: {
      label: 'Desktop',
      color: 'var(--chart-1)',
    },
    mobile: {
      label: 'Mobile',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer className={'h-64 w-full'} config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
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
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function PageViewsChart() {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>('desktop');

  const chartData = useMemo(
    () => [
      { date: '2024-04-01', desktop: 222, mobile: 150 },
      { date: '2024-04-02', desktop: 97, mobile: 180 },
      { date: '2024-04-03', desktop: 167, mobile: 120 },
      { date: '2024-04-04', desktop: 242, mobile: 260 },
      { date: '2024-04-05', desktop: 373, mobile: 290 },
      { date: '2024-04-06', desktop: 301, mobile: 340 },
      { date: '2024-04-07', desktop: 245, mobile: 180 },
      { date: '2024-04-08', desktop: 409, mobile: 320 },
      { date: '2024-04-09', desktop: 59, mobile: 110 },
      { date: '2024-04-10', desktop: 261, mobile: 190 },
      { date: '2024-04-11', desktop: 327, mobile: 350 },
      { date: '2024-04-12', desktop: 292, mobile: 210 },
      { date: '2024-04-13', desktop: 342, mobile: 380 },
      { date: '2024-04-14', desktop: 137, mobile: 220 },
      { date: '2024-04-15', desktop: 120, mobile: 170 },
      { date: '2024-04-16', desktop: 138, mobile: 190 },
      { date: '2024-04-17', desktop: 446, mobile: 360 },
      { date: '2024-04-18', desktop: 364, mobile: 410 },
      { date: '2024-04-19', desktop: 243, mobile: 180 },
      { date: '2024-04-20', desktop: 89, mobile: 150 },
      { date: '2024-04-21', desktop: 137, mobile: 200 },
      { date: '2024-04-22', desktop: 224, mobile: 170 },
      { date: '2024-04-23', desktop: 138, mobile: 230 },
      { date: '2024-04-24', desktop: 387, mobile: 290 },
      { date: '2024-04-25', desktop: 215, mobile: 250 },
      { date: '2024-04-26', desktop: 75, mobile: 130 },
      { date: '2024-04-27', desktop: 383, mobile: 420 },
      { date: '2024-04-28', desktop: 122, mobile: 180 },
      { date: '2024-04-29', desktop: 315, mobile: 240 },
      { date: '2024-04-30', desktop: 454, mobile: 380 },
      { date: '2024-05-01', desktop: 165, mobile: 220 },
      { date: '2024-05-02', desktop: 293, mobile: 310 },
      { date: '2024-05-03', desktop: 247, mobile: 190 },
      { date: '2024-05-04', desktop: 385, mobile: 420 },
      { date: '2024-05-05', desktop: 481, mobile: 390 },
      { date: '2024-05-06', desktop: 498, mobile: 520 },
      { date: '2024-05-07', desktop: 388, mobile: 300 },
      { date: '2024-05-08', desktop: 149, mobile: 210 },
      { date: '2024-05-09', desktop: 227, mobile: 180 },
      { date: '2024-05-10', desktop: 293, mobile: 330 },
      { date: '2024-05-11', desktop: 335, mobile: 270 },
      { date: '2024-05-12', desktop: 197, mobile: 240 },
      { date: '2024-05-13', desktop: 197, mobile: 160 },
      { date: '2024-05-14', desktop: 448, mobile: 490 },
      { date: '2024-05-15', desktop: 473, mobile: 380 },
      { date: '2024-05-16', desktop: 338, mobile: 400 },
      { date: '2024-05-17', desktop: 499, mobile: 420 },
      { date: '2024-05-18', desktop: 315, mobile: 350 },
      { date: '2024-05-19', desktop: 235, mobile: 180 },
      { date: '2024-05-20', desktop: 177, mobile: 230 },
      { date: '2024-05-21', desktop: 82, mobile: 140 },
      { date: '2024-05-22', desktop: 81, mobile: 120 },
      { date: '2024-05-23', desktop: 252, mobile: 290 },
      { date: '2024-05-24', desktop: 294, mobile: 220 },
      { date: '2024-05-25', desktop: 201, mobile: 250 },
      { date: '2024-05-26', desktop: 213, mobile: 170 },
      { date: '2024-05-27', desktop: 420, mobile: 460 },
      { date: '2024-05-28', desktop: 233, mobile: 190 },
      { date: '2024-05-29', desktop: 78, mobile: 130 },
      { date: '2024-05-30', desktop: 340, mobile: 280 },
      { date: '2024-05-31', desktop: 178, mobile: 230 },
      { date: '2024-06-01', desktop: 178, mobile: 200 },
      { date: '2024-06-02', desktop: 470, mobile: 410 },
      { date: '2024-06-03', desktop: 103, mobile: 160 },
      { date: '2024-06-04', desktop: 439, mobile: 380 },
      { date: '2024-06-05', desktop: 88, mobile: 140 },
      { date: '2024-06-06', desktop: 294, mobile: 250 },
      { date: '2024-06-07', desktop: 323, mobile: 370 },
      { date: '2024-06-08', desktop: 385, mobile: 320 },
      { date: '2024-06-09', desktop: 438, mobile: 480 },
      { date: '2024-06-10', desktop: 155, mobile: 200 },
      { date: '2024-06-11', desktop: 92, mobile: 150 },
      { date: '2024-06-12', desktop: 492, mobile: 420 },
      { date: '2024-06-13', desktop: 81, mobile: 130 },
      { date: '2024-06-14', desktop: 426, mobile: 380 },
      { date: '2024-06-15', desktop: 307, mobile: 350 },
      { date: '2024-06-16', desktop: 371, mobile: 310 },
      { date: '2024-06-17', desktop: 475, mobile: 520 },
      { date: '2024-06-18', desktop: 107, mobile: 170 },
      { date: '2024-06-19', desktop: 341, mobile: 290 },
      { date: '2024-06-20', desktop: 408, mobile: 450 },
      { date: '2024-06-21', desktop: 169, mobile: 210 },
      { date: '2024-06-22', desktop: 317, mobile: 270 },
      { date: '2024-06-23', desktop: 480, mobile: 530 },
      { date: '2024-06-24', desktop: 132, mobile: 180 },
      { date: '2024-06-25', desktop: 141, mobile: 190 },
      { date: '2024-06-26', desktop: 434, mobile: 380 },
      { date: '2024-06-27', desktop: 448, mobile: 490 },
      { date: '2024-06-28', desktop: 149, mobile: 200 },
      { date: '2024-06-29', desktop: 103, mobile: 160 },
      { date: '2024-06-30', desktop: 446, mobile: 400 },
    ],
    [],
  );

  const chartConfig = {
    views: {
      label: 'Page Views',
    },
    desktop: {
      label: 'Desktop',
      color: 'var(--chart-1)',
    },
    mobile: {
      label: 'Mobile',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [chartData],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Page Views</CardTitle>

          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>

        <div className="flex">
          {['desktop', 'mobile'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
