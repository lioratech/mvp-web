'use client';

import { useMemo } from 'react';

import {
  Users,
  Award,
  BarChart3,
  Network,
  UserCog,
  ArrowUpCircle,
  Shield,
  Info,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
  Legend,
} from 'recharts';

import { InsightsModel } from '../../_components/insights-model';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@kit/ui/popover';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@kit/ui/chart';

// Cores personalizadas
const ORANGE_PRIMARY = '#f97316'; // Tailwind orange-500
const ORANGE_LIGHT = '#fdba74'; // Tailwind orange-300
const ORANGE_DARK = '#c2410c'; // Tailwind orange-700

// Componente de Tooltip Personalizado
const CustomChartTooltipContent = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    dataKey?: string;
    value?: number;
    payload?: {
      fill?: string;
      stroke?: string;
    };
  }>;
  label?: string;
  formatter?: (value: number) => string[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-white p-2 text-sm shadow-md dark:border-neutral-800 dark:bg-neutral-950">
        {label && <p className="font-medium">{label}</p>}
        {payload.map((entry, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.payload?.fill || entry.payload?.stroke || ORANGE_PRIMARY }}
              />
            </div>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Componente para Popover com Benchmarks
function BenchmarkPopover({ children, benchmarks }: { children: React.ReactNode; benchmarks: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Benchmarks de Amplitude de Controle</h4>
            <p className="text-sm text-muted-foreground">
              Referências baseadas em estudos de gestão organizacional
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <div className="font-medium mb-1">Por Tipo de Liderança:</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>• <strong>Operacional:</strong></span>
                  <span>5-8 subordinados</span>
                </div>
                <div className="flex justify-between">
                  <span>• <strong>Estratégico:</strong></span>
                  <span>3-5 subordinados</span>
                </div>
                <div className="flex justify-between">
                  <span>• <strong>Técnico:</strong></span>
                  <span>6-10 subordinados</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="font-medium mb-1">Por Nível Hierárquico:</div>
                <div className="text-xs text-muted-foreground">
                  {benchmarks}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Componente para Popover de Níveis Hierárquicos
function HierarchyLevelsPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Níveis Hierárquicos Ideais</h4>
            <p className="text-sm text-muted-foreground">
              Referências de profundidade organizacional por tipo de liderança
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium mb-1">
                <strong>Estratégico</strong>
              </div>
              <div className="text-xs text-muted-foreground">
                1 a 2 níveis abaixo (acima de 2 níveis indica complexidade ou burocracia excessiva)
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="font-medium mb-1">
                  <strong>Operacional</strong>
                </div>
                <div className="text-xs text-muted-foreground">
                  1 nível abaixo (Mais de 2 níveis indica possível redundância ou excesso de camadas, podendo sinalizar estrutura ineficiente ou fragmentada)
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="font-medium mb-1">
                  <strong>Técnico</strong>
                </div>
                <div className="text-xs text-muted-foreground">
                  Nenhum ou 1 nível abaixo (Ideal é estar próximo do operacional, mais que isso indica microgestão ou perda de agilidade)
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Componente para Popover de Taxa de Promoção Interna
function PromotionRatePopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Benchmarks de Promoção Interna</h4>
            <p className="text-sm text-muted-foreground">
              Referências de mercado para gestão de talentos
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="text-xs">
                <div className="mb-2">
                  <strong className="text-green-600">Alta performance em gestão de talentos:</strong>
                  <div className="text-muted-foreground mt-1">
                    70% dos líderes são promovidos internamente.
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="text-xs">
                  <div className="mb-2">
                    <strong className="text-blue-600">Média de mercado saudável:</strong>
                    <div className="text-muted-foreground mt-1">
                      Entre 50% e 60% das posições de liderança preenchidas internamente.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="text-xs">
                  <div className="mb-2">
                    <strong className="text-orange-600">Abaixo de 40%:</strong>
                    <div className="text-muted-foreground mt-1">
                      Pode indicar falta de plano de sucessão ou deficiência no desenvolvimento de pessoas.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="text-xs">
                  <div className="mb-2">
                    <strong className="text-red-600">Acima de 80%:</strong>
                    <div className="text-muted-foreground mt-1">
                      Pode sinalizar "endogamia organizacional", pouca oxigenação e risco de pensamento homogêneo.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Componente para Popover de Amplitude de Controle Médio
function SpanOfControlPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Benchmarks de Amplitude de Controle</h4>
            <p className="text-sm text-muted-foreground">
              Referências para avaliação da estrutura organizacional
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="text-xs">
                <div className="mb-2">
                  <strong className="text-red-600">&lt; 4,0</strong>
                  <div className="text-muted-foreground mt-1">
                    Estrutura muito verticalizada → excesso de chefias, burocracia e lentidão nas decisões
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="text-xs">
                  <div className="mb-2">
                    <strong className="text-green-600">4,0 a 8,0</strong>
                    <div className="text-muted-foreground mt-1">
                      Faixa equilibrada → bom balanceamento entre controle e autonomia
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="text-sm">
                <div className="text-xs">
                  <div className="mb-2">
                    <strong className="text-orange-600">&gt; 8,0</strong>
                    <div className="text-muted-foreground mt-1">
                      Estrutura enxuta → pode indicar eficiência ou sobrecarga de gestores, dependendo do contexto
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function LeadershipCharts() {
  const leadersByPositionData = useMemo(() => generateLeadersByPositionData(), []);
  const leadersByAreaData = useMemo(() => generateLeadersByAreaData(), []);
  const genderDistributionData = useMemo(() => generateGenderDistributionData(), []);
  const spanOfControlByAreaData = useMemo(() => generateSpanOfControlByAreaData(), []);
  const hierarchyLevelsData = useMemo(() => generateHierarchyLevelsData(), []);
  const promotionRateData = useMemo(() => generatePromotionRateData(), []);
  const stabilityIndexData = useMemo(() => generateStabilityIndexData(), []);
  const directIndirectSpanData = useMemo(() => generateDirectIndirectSpanData(), []);

  const totalLeaders = 23;
  const femaleLeaders = 6;
  const maleLeaders = 17;
  const avgSpanOfControl = 6.8;
  const promotionRate = 65;
  const stabilityIndex = 92;

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Líderes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">{totalLeaders}</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              {femaleLeaders} mulheres • {maleLeaders} homens
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Amplitude de Controle Médio
              <SpanOfControlPopover>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help" />
              </SpanOfControlPopover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">{avgSpanOfControl}</span>
              <Network className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              Colaboradores por líder
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Taxa de Promoção Interna
              <PromotionRatePopover>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help" />
              </PromotionRatePopover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">{promotionRate}%</span>
              <ArrowUpCircle className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              Líderes promovidos internamente
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Índice de Estabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">{stabilityIndex}%</span>
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              Líderes com +2 anos na função
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Liderança por Cargo e por Área */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Liderança por Cargo
            </CardTitle>
            <CardDescription>
              Distribuição de líderes por posição hierárquica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadersByPositionChart data={leadersByPositionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Liderança por Área
            </CardTitle>
            <CardDescription>
              Número de líderes por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadersByAreaChart data={leadersByAreaData} />
          </CardContent>
        </Card>
      </div>

      {/* Participação por Gênero e Amplitude de Controle */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participação de Gestores por Gênero
            </CardTitle>
            <CardDescription>
              Distribuição de líderes por gênero ({totalLeaders} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenderDistributionChart data={genderDistributionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Amplitude de Controle (Hierarquia)
              <BenchmarkPopover benchmarks="Diretores: 3-7, Gerentes: 5-8, Coordenadores: 6-12">
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </BenchmarkPopover>
            </CardTitle>
            <CardDescription>
              Níveis hierárquicos e quantidade de líderes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HierarchyLevelsChart data={hierarchyLevelsData} />
          </CardContent>
        </Card>
      </div>

      {/* Amplitude de Controle por Área */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Amplitude de Controle Direto por Área
              <HierarchyLevelsPopover>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </HierarchyLevelsPopover>
            </CardTitle>
            <CardDescription>
              Média de subordinados diretos por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SpanOfControlByAreaChart data={spanOfControlByAreaData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Amplitude de Controle Direto Vs Indireto por Área
              <HierarchyLevelsPopover>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </HierarchyLevelsPopover>
            </CardTitle>
            <CardDescription>
              Comparação entre subordinados diretos e indiretos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DirectIndirectSpanChart data={directIndirectSpanData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Índice de Estabilidade na Liderança
            </CardTitle>
            <CardDescription>
              Retenção de líderes ao longo dos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StabilityIndexChart data={stabilityIndexData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <InsightsModel panelType="workforce" />
      </div>
    </div>
  );
}

// Funções de geração de dados
function generateLeadersByPositionData() {
  return [
    { position: 'Coord. de Suporte', count: 8, color: ORANGE_PRIMARY },
    { position: 'Coord. de Vendas', count: 5, color: ORANGE_LIGHT },
    { position: 'Diretor', count: 4, color: ORANGE_DARK },
    { position: 'Coord. de Dev', count: 4, color: ORANGE_PRIMARY },
    { position: 'Coord. Administrativo', count: 1, color: ORANGE_LIGHT },
    { position: 'Gerente de Suporte', count: 1, color: ORANGE_DARK },
    { position: 'Gerente de Tecnol.', count: 1, color: ORANGE_PRIMARY },
    { position: 'Coord. de Marketing', count: 1, color: ORANGE_LIGHT },
  ];
}

function generateLeadersByAreaData() {
  return [
    { area: 'Suporte', count: 9, color: ORANGE_PRIMARY },
    { area: 'Vendas', count: 5, color: ORANGE_LIGHT },
    { area: 'Desenvolvimento', count: 5, color: ORANGE_DARK },
    { area: 'Administrativo', count: 2, color: ORANGE_PRIMARY },
    { area: 'Marketing', count: 2, color: ORANGE_LIGHT },
  ];
}

function generateGenderDistributionData() {
  return [
    { gender: 'Mulheres', count: 6, percentage: 26, color: '#ec4899' },
    { gender: 'Homens', count: 17, percentage: 74, color: '#3b82f6' },
  ];
}

function generateSpanOfControlByAreaData() {
  return [
    { area: 'Suporte', average: 8.2, color: ORANGE_PRIMARY },
    { area: 'Vendas', average: 7.5, color: ORANGE_LIGHT },
    { area: 'Desenvolvimento', average: 6.8, color: ORANGE_DARK },
    { area: 'Marketing', average: 5.2, color: ORANGE_PRIMARY },
    { area: 'Administrativo', average: 4.8, color: ORANGE_LIGHT },
  ];
}

function generateHierarchyLevelsData() {
  return [
    { level: 'Diretores', count: 4, avgSpan: 12.5, color: ORANGE_DARK },
    { level: 'Gerentes', count: 2, avgSpan: 8.0, color: ORANGE_PRIMARY },
    { level: 'Coordenadores', count: 17, avgSpan: 5.2, color: ORANGE_LIGHT },
  ];
}

function generatePromotionRateData() {
  return [
    { quarter: 'Q1/24', rate: 58 },
    { quarter: 'Q2/24', rate: 62 },
    { quarter: 'Q3/24', rate: 65 },
    { quarter: 'Q4/24', rate: 65 },
  ];
}

function generateStabilityIndexData() {
  return [
    { month: 'Jan', stability: 88 },
    { month: 'Fev', stability: 90 },
    { month: 'Mar', stability: 89 },
    { month: 'Abr', stability: 91 },
    { month: 'Mai', stability: 92 },
    { month: 'Jun', stability: 92 },
  ];
}

function generateDirectIndirectSpanData() {
  return [
    { area: 'Suporte', direto: 8.2, indireto: 18.5, colorDirect: ORANGE_PRIMARY, colorIndirect: ORANGE_LIGHT },
    { area: 'Vendas', direto: 7.5, indireto: 15.2, colorDirect: ORANGE_PRIMARY, colorIndirect: ORANGE_LIGHT },
    { area: 'Desenvolvimento', direto: 6.8, indireto: 12.8, colorDirect: ORANGE_PRIMARY, colorIndirect: ORANGE_LIGHT },
    { area: 'Marketing', direto: 5.2, indireto: 8.5, colorDirect: ORANGE_PRIMARY, colorIndirect: ORANGE_LIGHT },
    { area: 'Administrativo', direto: 4.8, indireto: 7.2, colorDirect: ORANGE_PRIMARY, colorIndirect: ORANGE_LIGHT },
  ];
}

function LeadersByPositionChart(props: {
  data: { position: string; count: number; color: string }[];
}) {
  const chartConfig = {
    count: {
      label: 'Líderes:',
      color: ORANGE_PRIMARY,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{ left: 120, right: 20, top: 10, bottom: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="position"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={115}
          tick={{ fontSize: 11 }}
        />
        <XAxis dataKey="count" type="number" hide />
        <ChartTooltip cursor={false} content={<CustomChartTooltipContent />} />
        <Bar dataKey="count" radius={4}>
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function LeadersByAreaChart(props: {
  data: { area: string; count: number; color: string }[];
}) {
  const chartConfig = {
    count: {
      label: 'Líderes:',
      color: ORANGE_PRIMARY,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="area"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip cursor={false} content={<CustomChartTooltipContent />} />
        <Bar dataKey="count" radius={4}>
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function GenderDistributionChart(props: {
  data: { gender: string; count: number; percentage: number; color: string }[];
}) {
  const chartConfig = {
    count: {
      label: 'Líderes:',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <CustomChartTooltipContent />
          }
        />
        <Pie
          data={props.data}
          dataKey="count"
          nameKey="gender"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry) => `${entry.gender}: ${entry.count} (${entry.percentage}%)`}
          labelLine={{ stroke: 'hsl(var(--border))' }}
        >
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ChartContainer>
  );
}

function HierarchyLevelsChart(props: {
  data: { level: string; count: number; avgSpan: number; color: string }[];
}) {
  const chartConfig = {
    count: {
      label: 'Líderes:',
      color: ORANGE_PRIMARY,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="level"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <CustomChartTooltipContent />
          }
        />
        <Bar dataKey="count" radius={4}>
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function SpanOfControlByAreaChart(props: {
  data: { area: string; average: number; color: string }[];
}) {
  const chartConfig = {
    average: {
      label: 'Média:',
      color: ORANGE_PRIMARY,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{ left: 100, right: 40, top: 10, bottom: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="area"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={95}
          tick={{ fontSize: 11 }}
        />
        <XAxis dataKey="average" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={
            <CustomChartTooltipContent
              formatter={(value: number) => [`${Number(value).toFixed(1)} subordinados`]}
            />
          }
        />
        <Bar dataKey="average" radius={4}>
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function DirectIndirectSpanChart(props: {
  data: { area: string; direto: number; indireto: number; colorDirect: string; colorIndirect: string }[];
}) {
  const chartConfig = {
    direto: {
      label: 'Direto:',
      color: ORANGE_PRIMARY,
    },
    indireto: {
      label: 'Indireto:',
      color: ORANGE_LIGHT,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="area"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip cursor={false} content={<CustomChartTooltipContent />} />
        <Bar dataKey="direto" fill={ORANGE_PRIMARY} radius={4} />
        <Bar dataKey="indireto" fill={ORANGE_LIGHT} radius={4} />
        <Legend />
      </BarChart>
    </ChartContainer>
  );
}

function PromotionRateChart(props: {
  data: { quarter: string; rate: number }[];
}) {
  const chartConfig = {
    rate: {
      label: 'Taxa:',
      color: ORANGE_PRIMARY,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="quarter"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <CustomChartTooltipContent
              formatter={(value: number) => [`${Number(value)}%`]}
            />
          }
        />
        <Line
          dataKey="rate"
          type="monotone"
          stroke={ORANGE_PRIMARY}
          strokeWidth={2}
          dot={{ fill: ORANGE_PRIMARY, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

function StabilityIndexChart(props: {
  data: { month: string; stability: number }[];
}) {
  const chartConfig = {
    stability: {
      label: 'Estabilidade:',
      color: ORANGE_DARK,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
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
            <CustomChartTooltipContent
              formatter={(value: number) => [`${Number(value)}%`]}
            />
          }
        />
        <Line
          dataKey="stability"
          type="monotone"
          stroke={ORANGE_DARK}
          strokeWidth={2}
          dot={{ fill: ORANGE_DARK, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

