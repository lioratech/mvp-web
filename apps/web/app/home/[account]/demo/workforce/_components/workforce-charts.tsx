'use client';

import { useMemo, useState } from 'react';

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Brain,
  CircleDollarSign,
  Clock,
  IdCardLanyard,
  Lightbulb,
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
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
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

import { InsightsModel } from '../../../_components/insights-model';

export default function WorkforceCharts() {
  const headcountData = useMemo(() => generateHeadcountData(), []);
  const ageGroupData = useMemo(() => generateAgeGroupData(), []);
  const areaData = useMemo(() => generateAreaData(), []);
  const roleData = useMemo(() => generateRoleData(), []);
  const growthData = useMemo(() => generateGrowthData(), []);
  const contractTypeData = useMemo(() => generateContractTypeData(), []);
  const branchData = useMemo(() => generateBranchData(), []);
  const [timeRange, setTimeRange] = useState('12m');
  const [showAllRoles, setShowAllRoles] = useState(false);

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            <HeadcountChart data={headcountData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colaboradores por faixa etária</CardTitle>
          </CardHeader>
          <CardContent>
            <AgeGroupChart data={ageGroupData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colaboradores por área</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaBarChart data={areaData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Colaboradores por cargo</CardTitle>
            {roleData.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllRoles(!showAllRoles)}
                className="flex items-center gap-2"
              >
                {showAllRoles ? (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4" />
                    Ver mais ({roleData.length - 5} restantes)
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <RoleChart data={roleData} showAll={showAllRoles} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-left">
              Crescimento/Diminuição de Colaboradores
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
            <GrowthChart
              data={growthData}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Terceira linha */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Colaboradores por tipo de contrato */}
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores por tipo de contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <ContractTypeChart data={contractTypeData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colaboradores por filial</CardTitle>
          </CardHeader>
          <CardContent>
            <BranchChart data={branchData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <InsightsModel 
          panelType="workforce"
        />
      </div>
    </div>
  );
}

function generateHeadcountData() {
  return [
    { name: 'Female', value: 55, fill: '#ec4899' },
    { name: 'Male', value: 97, fill: '#3b82f6' },
  ];
}

function generateAgeGroupData() {
  return [
    { ageGroup: '60-70', count: 8 },
    { ageGroup: '50-60', count: 15 },
    { ageGroup: '40-50', count: 25 },
    { ageGroup: '30-40', count: 35 },
    { ageGroup: '20-30', count: 28 },
    { ageGroup: '0-20', count: 5 },
  ];
}

function generateAreaData() {
  return [
    { area: 'Operações', masculino: 37, feminino: 21 },
    { area: 'Desenvolvimento', masculino: 22, feminino: 13 },
    { area: 'Comercial', masculino: 17, feminino: 9 },
    { area: 'Administrativo', masculino: 9, feminino: 6 },
    { area: 'TI', masculino: 6, feminino: 3 },
    { area: 'Marketing', masculino: 4, feminino: 2 },
    { area: 'RH', masculino: 1, feminino: 2 },
  ];
}

function generateRoleData() {
  return [
    { role: 'Aux. de Suporte', masculino: 32, feminino: 17 }, // 49 total
    { role: 'Vendedor', masculino: 14, feminino: 7 }, // 21 total
    { role: 'Assist.Administrativo', masculino: 9, feminino: 5 }, // 14 total
    { role: 'Dev Full Stack', masculino: 7, feminino: 3 }, // 10 total
    { role: 'Suporte Técnico', masculino: 6, feminino: 3 }, // 9 total
    { role: 'Coord. de Suporte', masculino: 6, feminino: 3 }, // 9 total
    { role: 'Dev Python Junior', masculino: 6, feminino: 3 }, // 9 total
    { role: 'Dev Python Sênior', masculino: 4, feminino: 2 }, // 6 total
    { role: 'Dev Python Pleno', masculino: 4, feminino: 2 }, // 6 total
    { role: 'Coord. de Vendas', masculino: 3, feminino: 2 }, // 5 total
    { role: 'Analista de Marketing', masculino: 3, feminino: 2 }, // 5 total
    { role: 'Cood. de Desenvolvimento', masculino: 3, feminino: 1 }, // 4 total
    { role: 'Analista de DP', masculino: 2, feminino: 1 }, // 3 total
    { role: 'Coord.Administrativo', masculino: 1, feminino: 0 }, // 1 total
    { role: 'Coord. de Marketing', masculino: 1, feminino: 0 }, // 1 total
  ];
}

function generateGrowthData() {
  const monthlyData = [];
  const currentDate = new Date();
 
  const baseData = [
    { ativos: 125, demitidos: 5 },
    { ativos: 130, demitidos: 3 },
    { ativos: 129, demitidos: 1 },
    { ativos: 133, demitidos: 3 },
    { ativos: 137, demitidos: 5 },
    { ativos: 135, demitidos: 1 },
    { ativos: 140, demitidos: 6 },
    { ativos: 139, demitidos: 2 },
    { ativos: 145, demitidos: 3 },
    { ativos: 140, demitidos: 1 },
    { ativos: 148, demitidos: 2 },
    { ativos: 152, demitidos: 2 }, // mês atual
  ];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    date.setDate(1);
 
    monthlyData.push({
      date: date.toISOString().split('T')[0],
      ativos: baseData[11 - i].ativos,
      demitidos: baseData[11 - i].demitidos,
    });
  }

  return monthlyData;
}

function generateContractTypeData() {
  return [
    { type: 'CLT', count: 108 },
    { type: 'PJ', count: 24 },
    { type: 'Estagiário', count: 9 },
    { type: 'Temporário', count: 11 },
  ];
}

function generateBranchData() {
  return [
    { branch: 'Pinheiros', count: 35 },
    { branch: 'Campinas', count: 10 },
    { branch: 'Belo Horizonte', count: 9 },
    { branch: 'Curitiba', count: 8 },
    { branch: 'Salvador', count: 5 },
  ];
}

function HeadcountChart(props: {
  data: { name: string; value: number; fill: string }[];
}) {
  const homens = props.data.find((item) => item.name === 'Male')?.value || 0;
  const mulheres =
    props.data.find((item) => item.name === 'Female')?.value || 0;

  const chartData = [
    {
      month: 'headcount',
      homens: homens,
      mulheres: mulheres,
    },
  ];

  const totalEmployees = homens + mulheres;

  const percentHomens = Math.round((homens / totalEmployees) * 100);
  const percentMulheres = Math.round((mulheres / totalEmployees) * 100);

  const chartConfig = {
    homens: {
      label: `Homens (${percentHomens}%)`,
      color: '#3b82f6',
    },
    mulheres: {
      label: `Mulheres (${percentMulheres}%)`,
      color: '#ec4899',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={360}
        innerRadius={80}
        outerRadius={130}
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
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {totalEmployees.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Colaboradores
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="homens"
          stackId="a"
          cornerRadius={5}
          fill="#3b82f6"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="mulheres"
          fill="#ec4899"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

function AgeGroupChart(props: { data: { ageGroup: string; count: number }[] }) {
  const chartData = [
    { ageGroup: '18-25', masculino: 12, feminino: 8 },
    { ageGroup: '26-35', masculino: 35, feminino: 20 },
    { ageGroup: '36-45', masculino: 28, feminino: 15 },
    { ageGroup: '46-55', masculino: 18, feminino: 10 },
    { ageGroup: '56+', masculino: 4, feminino: 2 },
  ];

  const chartConfig = {
    masculino: {
      label: 'Masculino',
      color: '#3b82f6',
    },
    feminino: {
      label: 'Feminino',
      color: '#ec4899',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="ageGroup"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="masculino"
          stackId="a"
          fill="#3b82f6"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="feminino"
          stackId="a"
          fill="#ec4899"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey={(entry) => entry.masculino + entry.feminino}
            position="top"
            style={{ fontSize: '12px', fontWeight: 'bold', fill: '#374151' }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function AreaBarChart(props: {
  data: { area: string; masculino: number; feminino: number }[];
}) {
  const chartConfig = {
    masculino: {
      label: 'Masculino',
      color: '#3b82f6',
    },
    feminino: {
      label: 'Feminino',
      color: '#ec4899',
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 30, bottom: 5 }}
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
            width={80}
          />
          <XAxis dataKey="masculino" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="masculino"
            stackId="a"
            fill="#3b82f6"
            radius={[4, 0, 0, 4]}
          />
          <Bar
            dataKey="feminino"
            stackId="a"
            fill="#ec4899"
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey={(entry) => entry.masculino + entry.feminino}
              position="right"
              offset={8}
              className="fill-foreground font-semibold"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function RoleChart(props: {
  data: { role: string; masculino: number; feminino: number }[];
  showAll: boolean;
}) {
  const chartConfig = {
    masculino: {
      label: 'Masculino',
      color: '#3b82f6',
    },
    feminino: {
      label: 'Feminino',
      color: '#ec4899',
    },
  } satisfies ChartConfig;

  const formatLabel = (text: string) => {
    const words = text.split(' ');
    if (words.length <= 2) return text;

    const mid = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, mid).join(' ');
    const secondLine = words.slice(mid).join(' ');
    return `${firstLine}\n${secondLine}`;
  };

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const text = formatLabel(payload.value);
    const lines = text.split('\n');

    return (
      <g>
        {lines.map((line, index) => (
          <text
            key={index}
            x={x}
            y={y + index * 12}
            textAnchor="end"
            fontSize="12"
            fill="currentColor"
            className="break-words"
            style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  const displayedData = props.showAll ? props.data : props.data.slice(0, 5);

  const chartHeight = Math.max(200, displayedData.length * 50 + 100);

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer
        config={chartConfig}
        className={`w-full`}
        style={{ height: `${chartHeight}px` }}
      >
        <BarChart
          accessibilityLayer
          data={displayedData}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 90, bottom: 5 }}
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
            width={80}
            interval={0}
            tick={<CustomTick />}
          />
          <XAxis dataKey="masculino" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="masculino"
            stackId="a"
            fill="#3b82f6"
            radius={[4, 0, 0, 4]}
          />
          <Bar
            dataKey="feminino"
            stackId="a"
            fill="#ec4899"
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey={(entry) => entry.masculino + entry.feminino}
              position="right"
              offset={8}
              className="fill-foreground font-semibold"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function GrowthChart(props: {
  data: { date: string; ativos: number; demitidos: number }[];
  timeRange: string;
  setTimeRange: (value: string) => void;
}) {
  const filteredData = props.data.filter((item) => {
    const date = new Date(item.date);
    const currentDate = new Date();
    let monthsToSubtract = 12;
    if (props.timeRange === '6m') {
      monthsToSubtract = 6;
    } else if (props.timeRange === '3m') {
      monthsToSubtract = 3;
    }
    const startDate = new Date(currentDate);
    startDate.setMonth(startDate.getMonth() - monthsToSubtract);
    startDate.setDate(1);
    return date >= startDate;
  });

  const chartConfig = {
    ativos: {
      label: 'Ativos',
      color: '#10b981',
    },
    demitidos: {
      label: 'Demitidos',
      color: '#ef4444',
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
            <linearGradient id="fillAtivos" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-ativos)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-ativos)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillDemitidos" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-demitidos)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-demitidos)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('pt-BR', {
                month: 'short',
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="demitidos"
            type="natural"
            fill="url(#fillDemitidos)"
            stroke="var(--color-demitidos)"
            stackId="a"
            dot={{ fill: 'var(--color-demitidos)', strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: 'var(--color-demitidos)',
              strokeWidth: 2,
            }}
          />
          <Area
            dataKey="ativos"
            type="natural"
            fill="url(#fillAtivos)"
            stroke="var(--color-ativos)"
            stackId="a"
            dot={{ fill: 'var(--color-ativos)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-ativos)', strokeWidth: 2 }}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

function ContractTypeChart(props: { data: { type: string; count: number }[] }) {
  const chartConfig = {
    count: {
      label: 'Count',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 30, right: 40, top: 10, bottom: 10 }}
          width={undefined}
          height={undefined}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="type"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <XAxis dataKey="count" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar dataKey="count" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function BranchChart(props: { data: { branch: string; count: number }[] }) {
  const chartConfig = {
    count: {
      label: 'Count',
      color: '#f97316',
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={props.data}
          layout="vertical"
          margin={{ left: 30, right: 40, top: 10, bottom: 10 }}
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
          />
          <XAxis dataKey="count" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar dataKey="count" layout="vertical" fill="#f97316" radius={4}>
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function _CustomersTable() {
  const customers = [
    {
      name: 'João Silva',
      email: 'joao@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 120,50',
      logins: 1020,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Maria Santos',
      email: 'maria@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 65,40',
      logins: 570,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Carlos Oliveira',
      email: 'carlos@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 500,10',
      logins: 2050,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Ana Costa',
      email: 'ana@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 10,00',
      logins: 50,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'Pedro Ferreira',
      email: 'pedro@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 300,20',
      logins: 1520,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Juliana Lima',
      email: 'juliana@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 75,70',
      logins: 780,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Rafael Almeida',
      email: 'rafael@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 50,00',
      logins: 320,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Fernanda Rodrigues',
      email: 'fernanda@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 90,80',
      logins: 1260,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Lucas Pereira',
      email: 'lucas@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 0,00',
      logins: 20,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'Patricia Souza',
      email: 'patricia@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 145,30',
      logins: 1380,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Marcos Barbosa',
      email: 'marcos@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 120,50',
      logins: 940,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Camila Ribeiro',
      email: 'camila@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 80,60',
      logins: 460,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Diego Nascimento',
      email: 'diego@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 210,30',
      logins: 1850,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Beatriz Carvalho',
      email: 'beatriz@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 10,00',
      logins: 35,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'Gabriel Santos',
      email: 'gabriel@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 350,20',
      logins: 1760,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Thiago Mendes',
      email: 'thiago@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 145,60',
      logins: 1350,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Isabela Moreira',
      email: 'isabela@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 60,30',
      logins: 425,
      status: 'Possible Churn',
      trend: 'stale',
    },
    {
      name: 'Bruno Costa',
      email: 'bruno@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 175,80',
      logins: 1600,
      status: 'Healthy',
      trend: 'up',
    },
    {
      name: 'Larissa Silva',
      email: 'larissa@empresa.com.br',
      plan: 'Basic',
      mrr: 'R$ 0,00',
      logins: 18,
      status: 'Churn',
      trend: 'down',
    },
    {
      name: 'André Martins',
      email: 'andre@empresa.com.br',
      plan: 'Pro',
      mrr: 'R$ 255,90',
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
