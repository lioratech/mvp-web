'use client';

import { useMemo } from 'react';

import {
  ArrowDown,
  ArrowUp,
  TrendingDown,
  TrendingUp,
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

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@kit/ui/chart';

export default function TurnoverCharts() {
  const turnoverTimeSeriesData = useMemo(() => generateTurnoverTimeSeriesData(), []);
  const turnoverByAreaData = useMemo(() => generateTurnoverByAreaData(), []);
  const turnoverByRoleData = useMemo(() => generateTurnoverByRoleData(), []);
  const turnoverByBranchData = useMemo(() => generateTurnoverByBranchData(), []);
  const turnoverByAgeGroupData = useMemo(() => generateTurnoverByAgeGroupData(), []);

  // Debug logs
  console.log('turnoverByAreaData:', turnoverByAreaData);
  console.log('turnoverTimeSeriesData:', turnoverTimeSeriesData);

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
      {/* KPIs Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnover atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">1,33%</span>
              <ArrowUp className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-sm text-muted-foreground">Competência atual</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnover YTD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">15,77%</span>
              <ArrowDown className="h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo médio na empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">17 meses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground ">
              Total de Desligamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">34</span>
            </div>
            <span className="text-sm text-muted-foreground">Últimos 12 meses</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Demissão antes dos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">5</span>
            </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full" 
                  style={{ width: `${(5/8) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Demissão antes dos 3 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full" 
                  style={{ width: `${(4/8) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4 justify-between">
              Turnover voluntário e involuntário
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 shrink-0 rounded-[2px] bg-black"></div>
                  <span className="text-muted-foreground">Voluntário</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 shrink-0 rounded-[2px] bg-gray-500"></div>
                  <span className="text-muted-foreground">Involuntário</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoverTimeSeriesChart data={turnoverTimeSeriesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4 justify-between">
              Turnover por gênero
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 shrink-0 rounded-[2px] bg-blue-500"></div>
                  <span className="text-muted-foreground">Masculino</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 shrink-0 rounded-[2px] bg-pink-500"></div>
                  <span className="text-muted-foreground">Feminino</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoverByGenderChart data={turnoverTimeSeriesData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Turnover por área</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoverByAreaLineChart data={turnoverByAreaData} />
          </CardContent>
          <CardFooter>
            <TurnoverYTDSummary />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turnover por cargo</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoverByRoleLineChart data={turnoverByRoleData} />
          </CardContent>
          <CardFooter>
            <TurnoverByRoleYTDSummary />
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Turnover por filial</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoverByBranchLineChart data={turnoverByBranchData} />
          </CardContent>
          <CardFooter>
            <TurnoverByBranchYTDSummary />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turnover por faixa etária</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoverByAgeGroupLineChart data={turnoverByAgeGroupData} />
          </CardContent>
          <CardFooter>
            <TurnoverByAgeGroupYTDSummary />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function generateTurnoverTimeSeriesData() {
  return [
    { date: '2024-09-01', voluntario: 2.42, involuntario: 1.61, masculino: 3.23, feminino: 0.81 },
    { date: '2024-10-01', voluntario: 0.00, involuntario: 2.35, masculino: 0.78, feminino: 1.57 },
    { date: '2024-11-01', voluntario: 0.77, involuntario: 0.00, masculino: 0.77, feminino: 0.00 },
    { date: '2024-12-01', voluntario: 1.53, involuntario: 0.76, masculino: 0.76, feminino: 1.53 },
    { date: '2025-01-01', voluntario: 2.22, involuntario: 1.48, masculino: 2.22, feminino: 1.48 },
    { date: '2025-02-01', voluntario: 0.74, involuntario: 0.00, masculino: 0.74, feminino: 0.00 },
    { date: '2025-03-01', voluntario: 1.45, involuntario: 2.91, masculino: 1.45, feminino: 2.91 },
    { date: '2025-04-01', voluntario: 0.00, involuntario: 1.43, masculino: 1.43, feminino: 0.00 },
    { date: '2025-05-01', voluntario: 1.41, involuntario: 0.70, masculino: 2.11, feminino: 0.00 },
    { date: '2025-06-01', voluntario: 0.00, involuntario: 0.70, masculino: 0.00, feminino: 0.70 },
    { date: '2025-07-01', voluntario: 0.69, involuntario: 0.69, masculino: 0.69, feminino: 0.69 },
    { date: '2025-08-01', voluntario: 1.33, involuntario: 0.00, masculino: 1.33, feminino: 0.00 },
  ];
}

function generateTurnoverByAreaData() {
  return [
    { month: "Jan", TI: 0, RH: 0, Comercial: 1.48, Administrativo: 0.74, Operações: 0.74, Desenvolvimento: 0.74, Marketing: 0 },
    { month: "Fev", TI: 0, RH: 0, Comercial: 0.74, Administrativo: 0, Operações: 0, Desenvolvimento: 0, Marketing: 0 },
    { month: "Mar", TI: 0, RH: 0, Comercial: 0.73, Administrativo: 0, Operações: 1.45, Desenvolvimento: 1.45, Marketing: 0.73 },
    { month: "Abr", TI: 0, RH: 0, Comercial: 0, Administrativo: 0.72, Operações: 0.72, Desenvolvimento: 0, Marketing: 0 },
    { month: "Mai", TI: 0, RH: 0, Comercial: 0.70, Administrativo: 0, Operações: 0, Desenvolvimento: 0.70, Marketing: 0.70 },
    { month: "Jun", TI: 0.70, RH: 0, Comercial: 0, Administrativo: 0, Operações: 0, Desenvolvimento: 0, Marketing: 0 },
    { month: "Jul", TI: 0, RH: 0, Comercial: 0.69, Administrativo: 0.69, Operações: 0, Desenvolvimento: 0, Marketing: 0 },
    { month: "Ago", TI: 0, RH: 0, Comercial: 0, Administrativo: 0, Operações: 0.67, Desenvolvimento: 0.67, Marketing: 0 },
  ];
}

function generateTurnoverByAreaYTDData() {
  return {
    TI: 0.7,
    RH: 0.0,
    Comercial: 4.3,
    Administrativo: 2.2,
    Operações: 3.6,
    Desenvolvimento: 3.6,
    Marketing: 1.4,
  };
}

function generateTurnoverByRoleData() {
  return [
    { month: "Jan", suporteTecnico: 0.74, coordenadorVendas: 0, vendedor: 1.48, assistenteAdmin: 0.74, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0.74, devPythonPleno: 0, coordenadorDev: 0, analistaMarketing: 0, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Fev", suporteTecnico: 0, coordenadorVendas: 0.74, vendedor: 0, assistenteAdmin: 0, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0, devPythonPleno: 0, coordenadorDev: 0, analistaMarketing: 0, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Mar", suporteTecnico: 0, coordenadorVendas: 0, vendedor: 0.73, assistenteAdmin: 0, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 1.45, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0.73, devPythonPleno: 0.73, coordenadorDev: 0, analistaMarketing: 0.73, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Abr", suporteTecnico: 0, coordenadorVendas: 0, vendedor: 0, assistenteAdmin: 0.72, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0.72, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0, devPythonPleno: 0, coordenadorDev: 0, analistaMarketing: 0, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Mai", suporteTecnico: 0, coordenadorVendas: 0, vendedor: 0.70, assistenteAdmin: 0, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0, coordenadorSuporte: 0, devPythonSenior: 0.70, devPythonJunior: 0, devPythonPleno: 0, coordenadorDev: 0, analistaMarketing: 0.70, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Jun", suporteTecnico: 0.70, coordenadorVendas: 0, vendedor: 0, assistenteAdmin: 0, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0, devPythonPleno: 0, coordenadorDev: 0, analistaMarketing: 0, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Jul", suporteTecnico: 0, coordenadorVendas: 0, vendedor: 0.69, assistenteAdmin: 0.69, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0, devPythonPleno: 0, coordenadorDev: 0, analistaMarketing: 0, coordenadorMarketing: 0, devFullStack: 0 },
    { month: "Ago", suporteTecnico: 0, coordenadorVendas: 0, vendedor: 0, assistenteAdmin: 0, coordenadorAdmin: 0, analistaDP: 0, auxiliarSuporte: 0.67, coordenadorSuporte: 0, devPythonSenior: 0, devPythonJunior: 0, devPythonPleno: 0.67, coordenadorDev: 0, analistaMarketing: 0, coordenadorMarketing: 0, devFullStack: 0 },
  ];
}

function generateTurnoverByRoleYTDData() {
  return {
    suporteTecnico: 1.4,
    coordenadorVendas: 0.7,
    vendedor: 3.6,
    assistenteAdmin: 2.2,
    coordenadorAdmin: 0.0,
    analistaDP: 0.0,
    auxiliarSuporte: 2.8,
    coordenadorSuporte: 0.0,
    devPythonSenior: 0.7,
    devPythonJunior: 1.5,
    devPythonPleno: 1.4,
    coordenadorDev: 0.0,
    analistaMarketing: 1.4,
    coordenadorMarketing: 0.0,
    devFullStack: 0.0,
  };
}

function generateTurnoverByBranchData() {
  return [
    { month: "Jan", saoPaulo: 1.48, campinas: 0.74, beloHorizonte: 0, curitiba: 1.48, salvador: 0 },
    { month: "Fev", saoPaulo: 0, campinas: 0.74, beloHorizonte: 0, curitiba: 0, salvador: 0 },
    { month: "Mar", saoPaulo: 2.18, campinas: 0, beloHorizonte: 0.73, curitiba: 0.73, salvador: 0.73 },
    { month: "Abr", saoPaulo: 0, campinas: 0.72, beloHorizonte: 0, curitiba: 0, salvador: 0.72 },
    { month: "Mai", saoPaulo: 0.70, campinas: 0, beloHorizonte: 0.70, curitiba: 0.70, salvador: 0 },
    { month: "Jun", saoPaulo: 0, campinas: 0, beloHorizonte: 0, curitiba: 0, salvador: 0.70 },
    { month: "Jul", saoPaulo: 0.69, campinas: 0.69, beloHorizonte: 0, curitiba: 0, salvador: 0 },
    { month: "Ago", saoPaulo: 1.33, campinas: 0, beloHorizonte: 0, curitiba: 0, salvador: 0 },
  ];
}

function generateTurnoverByBranchYTDData() {
  return {
    saoPaulo: 6.4,
    campinas: 2.9,
    beloHorizonte: 1.4,
    curitiba: 2.9,
    salvador: 2.1,
  };
}

function generateTurnoverByAgeGroupData() {
  return [
    { month: "Jan", faixa18_25: 0.74, faixa26_35: 2.22, faixa36_45: 0.74, faixa46_55: 0.00, faixa56_mais: 0.00 },
    { month: "Fev", faixa18_25: 0.00, faixa26_35: 0.74, faixa36_45: 0.00, faixa46_55: 0.00, faixa56_mais: 0.00 },
    { month: "Mar", faixa18_25: 1.45, faixa26_35: 1.45, faixa36_45: 0.73, faixa46_55: 0.73, faixa56_mais: 0.00 },
    { month: "Abr", faixa18_25: 0.72, faixa26_35: 0.72, faixa36_45: 0.00, faixa46_55: 0.00, faixa56_mais: 0.00 },
    { month: "Mai", faixa18_25: 0.00, faixa26_35: 0.00, faixa36_45: 1.41, faixa46_55: 0.00, faixa56_mais: 0.70 },
    { month: "Jun", faixa18_25: 0.70, faixa26_35: 0.00, faixa36_45: 0.00, faixa46_55: 0.00, faixa56_mais: 0.00 },
    { month: "Jul", faixa18_25: 0.69, faixa26_35: 0.69, faixa36_45: 0.00, faixa46_55: 0.00, faixa56_mais: 0.00 },
    { month: "Ago", faixa18_25: 0.67, faixa26_35: 0.67, faixa36_45: 0.00, faixa46_55: 0.00, faixa56_mais: 0.00 },
  ];
}

function generateTurnoverByAgeGroupYTDData() {
  return {
    faixa18_25: 5.0,
    faixa26_35: 6.5,
    faixa36_45: 2.9,
    faixa46_55: 0.7,
    faixa56_mais: 0.7,
  };
}

function TurnoverTimeSeriesChart(props: {
  data: { date: string; voluntario: number; involuntario: number }[];
}) {
  console.log('TurnoverTimeSeriesChart data:', props.data);

  const chartConfig = {
    voluntario: {
      label: 'Voluntário:',
      color: '#000000',
    },
    involuntario: {
      label: 'Involuntário:',
      color: '#6b7280',
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-80 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <AreaChart
        data={props.data}
        margin={{ top: 20, left: 12, right: 12 }}
        width={400}
        height={300}
      >
        <defs>
          <linearGradient id="fillVoluntario" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="#000000"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="#000000"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillInvoluntario" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="#6b7280"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="#6b7280"
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
              day: 'numeric',
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
          dataKey="involuntario"
          type="natural"
          fill="url(#fillInvoluntario)"
          stroke="#6b7280"
            stackId="a"
          dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
          activeDot={{
            r: 6,
            stroke: '#6b7280',
            strokeWidth: 2,
          }}
        />
        <Area
          dataKey="voluntario"
          type="natural"
          fill="url(#fillVoluntario)"
          stroke="#000000"
            stackId="a"
          dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }}
        />
      </AreaChart>
      </ChartContainer>
  );
}

function TurnoverByGenderChart(props: {
  data: { date: string; masculino: number; feminino: number }[];
}) {
  console.log('TurnoverByGenderChart data:', props.data);
  
  const chartConfig = {
    masculino: {
      label: 'Masculino:',
      color: '#3b82f6',
    },
    feminino: {
      label: 'Feminino:',
      color: '#ec4899',
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-48 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
        <AreaChart
        data={props.data}
          margin={{ top: 20, left: 12, right: 12 }}
        width={400}
        height={300}
        >
          <defs>
          <linearGradient id="fillMasculino" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
              stopColor="#3b82f6"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
              stopColor="#3b82f6"
                stopOpacity={0.1}
              />
            </linearGradient>
          <linearGradient id="fillFeminino" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
              stopColor="#ec4899"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
              stopColor="#ec4899"
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
              day: 'numeric',
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
          dataKey="feminino"
            type="natural"
          fill="url(#fillFeminino)"
          stroke="#ec4899"
            stackId="a"
          dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
            stroke: '#ec4899',
              strokeWidth: 2,
            }}
          />
          <Area
          dataKey="masculino"
            type="natural"
          fill="url(#fillMasculino)"
          stroke="#3b82f6"
            stackId="a"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>
  );
}

// Array de cores fixas para os departamentos
const DEPARTMENT_COLORS = [
  '#3b82f6', // Azul
  '#ef4444', // Vermelho
  '#10b981', // Verde
  '#f59e0b', // Amarelo
  '#8b5cf6', // Roxo
  '#06b6d4', // Ciano
  '#f97316', // Laranja
  '#84cc16', // Lima
  '#ec4899', // Rosa
  '#6b7280', // Cinza
];

function TurnoverByAreaLineChart(props: {
  data: { month: string; TI: number; RH: number; Comercial: number; Administrativo: number; Operações: number; Desenvolvimento: number; Marketing: number }[];
}) {
  console.log('TurnoverByAreaLineChart data:', props.data);
  
  const chartConfig = {
    TI: {
      label: "TI",
      color: DEPARTMENT_COLORS[0],
    },
    RH: {
      label: "RH",
      color: DEPARTMENT_COLORS[1],
    },
    Comercial: {
      label: "Comercial",
      color: DEPARTMENT_COLORS[2],
    },
    Administrativo: {
      label: "Administrativo",
      color: DEPARTMENT_COLORS[3],
    },
    Operações: {
      label: "Operações",
      color: DEPARTMENT_COLORS[4],
    },
    Desenvolvimento: {
      label: "Desenvolvimento",
      color: DEPARTMENT_COLORS[5],
    },
    Marketing: {
      label: "Marketing",
      color: DEPARTMENT_COLORS[6],
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <LineChart
          accessibilityLayer
          data={props.data}
        margin={{
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
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="TI"
          type="monotone"
          stroke={DEPARTMENT_COLORS[0]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="RH"
          type="monotone"
          stroke={DEPARTMENT_COLORS[1]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Comercial"
          type="monotone"
          stroke={DEPARTMENT_COLORS[2]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Administrativo"
          type="monotone"
          stroke={DEPARTMENT_COLORS[3]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Operações"
          type="monotone"
          stroke={DEPARTMENT_COLORS[4]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Desenvolvimento"
          type="monotone"
          stroke={DEPARTMENT_COLORS[5]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Marketing"
          type="monotone"
          stroke={DEPARTMENT_COLORS[6]}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
      </ChartContainer>
  );
}

function TurnoverYTDSummary() {
  const ytdData = generateTurnoverByAreaYTDData();

  const areas = [
    { name: "TI", value: ytdData.TI, color: DEPARTMENT_COLORS[0] },
    { name: "RH", value: ytdData.RH, color: DEPARTMENT_COLORS[1] },
    { name: "Comercial", value: ytdData.Comercial, color: DEPARTMENT_COLORS[2] },
    { name: "Administrativo", value: ytdData.Administrativo, color: DEPARTMENT_COLORS[3] },
    { name: "Operações", value: ytdData.Operações, color: DEPARTMENT_COLORS[4] },
    { name: "Desenvolvimento", value: ytdData.Desenvolvimento, color: DEPARTMENT_COLORS[5] },
    { name: "Marketing", value: ytdData.Marketing, color: DEPARTMENT_COLORS[6] },
  ];

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-muted-foreground mb-2">YTD (Year to Date)</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {areas.map((area) => (
          <div key={area.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: area.color }}
            />
            <span className="text-muted-foreground">{area.name}: <span className="text-foreground">{area.value}%</span></span>
          </div>
        ))}
    </div>
    </div>
  );
}

function TurnoverByRoleLineChart(props: {
  data: { month: string; suporteTecnico: number; coordenadorVendas: number; vendedor: number; assistenteAdmin: number; coordenadorAdmin: number; analistaDP: number; auxiliarSuporte: number; coordenadorSuporte: number; devPythonSenior: number; devPythonJunior: number; devPythonPleno: number; coordenadorDev: number; analistaMarketing: number; coordenadorMarketing: number; devFullStack: number }[];
}) {
  console.log('TurnoverByRoleLineChart data:', props.data);

  const chartConfig = {
    suporteTecnico: { label: "Suporte Técnico", color: DEPARTMENT_COLORS[0] },
    coordenadorVendas: { label: "Coordenador de Vendas", color: DEPARTMENT_COLORS[1] },
    vendedor: { label: "Vendedor", color: DEPARTMENT_COLORS[2] },
    assistenteAdmin: { label: "Assistente Administrativo", color: DEPARTMENT_COLORS[3] },
    coordenadorAdmin: { label: "Coordenador Administrativo", color: DEPARTMENT_COLORS[4] },
    analistaDP: { label: "Analista de DP", color: DEPARTMENT_COLORS[5] },
    auxiliarSuporte: { label: "Auxiliar de Suporte", color: DEPARTMENT_COLORS[6] },
    coordenadorSuporte: { label: "Coordenador de Suporte", color: DEPARTMENT_COLORS[7] },
    devPythonSenior: { label: "Desenvolvedor Python Sênior", color: DEPARTMENT_COLORS[8] },
    devPythonJunior: { label: "Desenvolvedor Python Junior", color: DEPARTMENT_COLORS[9] },
    devPythonPleno: { label: "Desenvolvedor Python Pleno", color: "#fbbf24" },
    coordenadorDev: { label: "Coordenador de Desenvolvimento", color: "#a78bfa" },
    analistaMarketing: { label: "Analista de Marketing", color: "#34d399" },
    coordenadorMarketing: { label: "Coordenador de Marketing", color: "#f472b6" },
    devFullStack: { label: "Desenvolvedor Full Stack", color: "#94a3b8" },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{
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
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="suporteTecnico"
          type="monotone"
          stroke={DEPARTMENT_COLORS[0]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="coordenadorVendas"
          type="monotone"
          stroke={DEPARTMENT_COLORS[1]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="vendedor"
          type="monotone"
          stroke={DEPARTMENT_COLORS[2]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="assistenteAdmin"
          type="monotone"
          stroke={DEPARTMENT_COLORS[3]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="coordenadorAdmin"
          type="monotone"
          stroke={DEPARTMENT_COLORS[4]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="analistaDP"
          type="monotone"
          stroke={DEPARTMENT_COLORS[5]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="auxiliarSuporte"
          type="monotone"
          stroke={DEPARTMENT_COLORS[6]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="coordenadorSuporte"
          type="monotone"
          stroke={DEPARTMENT_COLORS[7]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="devPythonSenior"
          type="monotone"
          stroke={DEPARTMENT_COLORS[8]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="devPythonJunior"
          type="monotone"
          stroke={DEPARTMENT_COLORS[9]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="devPythonPleno"
          type="monotone"
          stroke="#fbbf24"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="coordenadorDev"
          type="monotone"
          stroke="#a78bfa"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="analistaMarketing"
          type="monotone"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="coordenadorMarketing"
          type="monotone"
          stroke="#f472b6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="devFullStack"
          type="monotone"
          stroke="#94a3b8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
        </ChartContainer>
  );
}

function TurnoverByRoleYTDSummary() {
  const ytdData = generateTurnoverByRoleYTDData();

  const roles = [
    { name: "Suporte Técnico", value: ytdData.suporteTecnico, color: DEPARTMENT_COLORS[0] },
    { name: "Coordenador de Vendas", value: ytdData.coordenadorVendas, color: DEPARTMENT_COLORS[1] },
    { name: "Vendedor", value: ytdData.vendedor, color: DEPARTMENT_COLORS[2] },
    { name: "Assistente Administrativo", value: ytdData.assistenteAdmin, color: DEPARTMENT_COLORS[3] },
    { name: "Coordenador Administrativo", value: ytdData.coordenadorAdmin, color: DEPARTMENT_COLORS[4] },
    { name: "Analista de DP", value: ytdData.analistaDP, color: DEPARTMENT_COLORS[5] },
    { name: "Auxiliar de Suporte", value: ytdData.auxiliarSuporte, color: DEPARTMENT_COLORS[6] },
    { name: "Coordenador de Suporte", value: ytdData.coordenadorSuporte, color: DEPARTMENT_COLORS[7] },
    { name: "Desenvolvedor Python Sênior", value: ytdData.devPythonSenior, color: DEPARTMENT_COLORS[8] },
    { name: "Desenvolvedor Python Junior", value: ytdData.devPythonJunior, color: DEPARTMENT_COLORS[9] },
    { name: "Desenvolvedor Python Pleno", value: ytdData.devPythonPleno, color: "#fbbf24" },
    { name: "Coordenador de Desenvolvimento", value: ytdData.coordenadorDev, color: "#a78bfa" },
    { name: "Analista de Marketing", value: ytdData.analistaMarketing, color: "#34d399" },
    { name: "Coordenador de Marketing", value: ytdData.coordenadorMarketing, color: "#f472b6" },
    { name: "Desenvolvedor Full Stack", value: ytdData.devFullStack, color: "#94a3b8" },
  ];

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-muted-foreground mb-2">YTD (Year to Date)</div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {roles.map((role) => (
          <div key={role.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: role.color }}
            />
            <span className="text-muted-foreground">{role.name}: <span className="text-foreground">{role.value}%</span></span>
          </div>
        ))}
          </div>
        </div>
  );
}

function TurnoverByAgeGroupLineChart(props: {
  data: { month: string; faixa18_25: number; faixa26_35: number; faixa36_45: number; faixa46_55: number; faixa56_mais: number }[];
}) {
  console.log('TurnoverByAgeGroupLineChart data:', props.data);
  
  const chartConfig = {
    faixa18_25: { label: "18-25", color: DEPARTMENT_COLORS[0] },
    faixa26_35: { label: "26-35", color: DEPARTMENT_COLORS[1] },
    faixa36_45: { label: "36-45", color: DEPARTMENT_COLORS[2] },
    faixa46_55: { label: "46-55", color: DEPARTMENT_COLORS[3] },
    faixa56_mais: { label: "56+", color: DEPARTMENT_COLORS[4] },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-48 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{
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
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="faixa18_25"
          type="monotone"
          stroke={DEPARTMENT_COLORS[0]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="faixa26_35"
          type="monotone"
          stroke={DEPARTMENT_COLORS[1]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="faixa36_45"
          type="monotone"
          stroke={DEPARTMENT_COLORS[2]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="faixa46_55"
          type="monotone"
          stroke={DEPARTMENT_COLORS[3]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="faixa56_mais"
          type="monotone"
          stroke={DEPARTMENT_COLORS[4]}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function TurnoverByAgeGroupYTDSummary() {
  const ytdData = generateTurnoverByAgeGroupYTDData();

  const ageGroups = [
    { name: "18-25", value: ytdData.faixa18_25, color: DEPARTMENT_COLORS[0] },
    { name: "26-35", value: ytdData.faixa26_35, color: DEPARTMENT_COLORS[1] },
    { name: "36-45", value: ytdData.faixa36_45, color: DEPARTMENT_COLORS[2] },
    { name: "46-55", value: ytdData.faixa46_55, color: DEPARTMENT_COLORS[3] },
    { name: "56+", value: ytdData.faixa56_mais, color: DEPARTMENT_COLORS[4] },
  ];

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-muted-foreground mb-2">YTD (Year to Date)</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {ageGroups.map((ageGroup) => (
          <div key={ageGroup.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: ageGroup.color }}
            />
            <span className="text-muted-foreground">{ageGroup.name}: <span className="text-foreground">{ageGroup.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TurnoverByBranchLineChart(props: {
  data: { month: string; saoPaulo: number; campinas: number; beloHorizonte: number; curitiba: number; salvador: number }[];
}) {
  console.log('TurnoverByBranchLineChart data:', props.data);
  
  const chartConfig = {
    saoPaulo: { label: "São Paulo", color: DEPARTMENT_COLORS[0] },
    campinas: { label: "Campinas", color: DEPARTMENT_COLORS[1] },
    beloHorizonte: { label: "Belo Horizonte", color: DEPARTMENT_COLORS[2] },
    curitiba: { label: "Curitiba", color: DEPARTMENT_COLORS[3] },
    salvador: { label: "Salvador", color: DEPARTMENT_COLORS[4] },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-48 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <LineChart
        accessibilityLayer
        data={props.data}
        margin={{
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
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="saoPaulo"
          type="monotone"
          stroke={DEPARTMENT_COLORS[0]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="campinas"
          type="monotone"
          stroke={DEPARTMENT_COLORS[1]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="beloHorizonte"
          type="monotone"
          stroke={DEPARTMENT_COLORS[2]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="curitiba"
          type="monotone"
          stroke={DEPARTMENT_COLORS[3]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="salvador"
          type="monotone"
          stroke={DEPARTMENT_COLORS[4]}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function TurnoverByBranchYTDSummary() {
  const ytdData = generateTurnoverByBranchYTDData();

  const branches = [
    { name: "São Paulo", value: ytdData.saoPaulo, color: DEPARTMENT_COLORS[0] },
    { name: "Campinas", value: ytdData.campinas, color: DEPARTMENT_COLORS[1] },
    { name: "Belo Horizonte", value: ytdData.beloHorizonte, color: DEPARTMENT_COLORS[2] },
    { name: "Curitiba", value: ytdData.curitiba, color: DEPARTMENT_COLORS[3] },
    { name: "Salvador", value: ytdData.salvador, color: DEPARTMENT_COLORS[4] },
  ];

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-muted-foreground mb-2">YTD (Year to Date)</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {branches.map((branch) => (
          <div key={branch.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: branch.color }}
            />
            <span className="text-muted-foreground">{branch.name}: <span className="text-foreground">{branch.value}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TurnoverBreakdownChart(props: {
  data: { category: string; percentage: number }[];
}) {
  console.log('TurnoverBreakdownChart data:', props.data);
  
  const chartConfig = {
    percentage: {
      label: "Percentage",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (!props.data || props.data.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center">Sem dados</div>;
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={props.data}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <XAxis type="number" dataKey="percentage" hide />
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="percentage" fill="var(--color-percentage)" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}

