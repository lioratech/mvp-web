'use client';

import { useMemo, useState } from 'react';

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';

export default function LaborLiabilitiesCharts() {
  const liabilitiesData = useMemo(() => generateLaborLiabilitiesData(), []);

  return (
    <div className="animate-in fade-in flex flex-col space-y-6 pb-36 duration-500">
   

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Passivos Trabalhistas</span>
            </CardTitle>
            <CardDescription>
              Monitoramento de riscos trabalhistas de funcionários demitidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LaborLiabilitiesTable data={liabilitiesData} />
          </CardContent>
        </Card>
      </div>


    </div>
  );
}


function generateLaborLiabilitiesData() {
  return [
    {
      id: '1',
      employeeId: 'emp_001',
      employeeName: 'João Silva',
      employeeEmail: 'joao.silva@empresa.com',
      position: 'Desenvolvedor Senior',
      department: 'Tecnologia',
      hireDate: '2021-03-15',
      terminationDate: '2023-08-15',
      terminationType: 'involuntary',
      terminationReason: 'Redução de quadro',
      lastWorkingDay: '2023-08-15',
      noticePeriod: 30,
      severancePay: 15000,
      riskLevel: 'medium',
      notes: 'Funcionário questionou a legalidade da demissão',
      createdAt: '2023-08-15T10:00:00Z',
      updatedAt: '2023-08-15T10:00:00Z',
    },
    {
      id: '2',
      employeeId: 'emp_002',
      employeeName: 'Maria Santos',
      employeeEmail: 'maria.santos@empresa.com',
      position: 'Analista de Vendas',
      department: 'Vendas',
      hireDate: '2022-08-10',
      terminationDate: '2024-01-20',
      terminationType: 'voluntary',
      terminationReason: 'Oportunidade em outra empresa',
      lastWorkingDay: '2024-02-20',
      noticePeriod: 30,
      severancePay: 8000,
      riskLevel: 'low',
      notes: 'Demissão amigável, sem conflitos',
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: '3',
      employeeId: 'emp_003',
      employeeName: 'Carlos Oliveira',
      employeeEmail: 'carlos.oliveira@empresa.com',
      position: 'Gerente de Projetos',
      department: 'Operações',
      hireDate: '2020-01-15',
      terminationDate: '2022-12-10',
      terminationType: 'involuntary',
      terminationReason: 'Justa causa - faltas injustificadas',
      lastWorkingDay: '2022-12-10',
      noticePeriod: 0,
      severancePay: 0,
      riskLevel: 'critical',
      notes: 'Funcionário contestou a justa causa, processo em andamento',
      createdAt: '2022-12-10T09:00:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
    },
    {
      id: '4',
      employeeId: 'emp_004',
      employeeName: 'Ana Costa',
      employeeEmail: 'ana.costa@empresa.com',
      position: 'Designer UX/UI',
      department: 'Design',
      hireDate: '2021-09-01',
      terminationDate: '2023-11-05',
      terminationType: 'mutual_agreement',
      terminationReason: 'Acordo mútuo - realocação familiar',
      lastWorkingDay: '2023-12-05',
      noticePeriod: 30,
      severancePay: 12000,
      riskLevel: 'low',
      notes: 'Acordo bem documentado, baixo risco',
      createdAt: '2023-11-05T11:15:00Z',
      updatedAt: '2023-11-05T11:15:00Z',
    },
    {
      id: '5',
      employeeId: 'emp_005',
      employeeName: 'Pedro Ferreira',
      employeeEmail: 'pedro.ferreira@empresa.com',
      position: 'Assistente Administrativo',
      department: 'Administrativo',
      hireDate: '2023-01-10',
      terminationDate: '2024-02-28',
      terminationType: 'involuntary',
      terminationReason: 'Reestruturação organizacional',
      lastWorkingDay: '2024-03-30',
      noticePeriod: 30,
      severancePay: 6000,
      riskLevel: 'high',
      notes: 'Funcionário demonstrou insatisfação com o processo',
      createdAt: '2024-02-28T13:20:00Z',
      updatedAt: '2024-02-28T13:20:00Z',
    },
    {
      id: '6',
      employeeId: 'emp_006',
      employeeName: 'Juliana Lima',
      employeeEmail: 'juliana.lima@empresa.com',
      position: 'Contadora',
      department: 'Financeiro',
      hireDate: '2018-05-20',
      terminationDate: '2023-06-15',
      terminationType: 'voluntary',
      terminationReason: 'Aposentadoria',
      lastWorkingDay: '2023-07-15',
      noticePeriod: 30,
      severancePay: 25000,
      riskLevel: 'low',
      notes: 'Aposentadoria por tempo de serviço',
      createdAt: '2023-06-15T08:45:00Z',
      updatedAt: '2023-06-15T08:45:00Z',
    },
    {
      id: '7',
      employeeId: 'emp_007',
      employeeName: 'Rafael Almeida',
      employeeEmail: 'rafael.almeida@empresa.com',
      position: 'Vendedor',
      department: 'Vendas',
      hireDate: '2022-11-01',
      terminationDate: '2023-03-20',
      terminationType: 'involuntary',
      terminationReason: 'Baixo desempenho',
      lastWorkingDay: '2023-04-20',
      noticePeriod: 30,
      severancePay: 7000,
      riskLevel: 'medium',
      notes: 'Processo de demissão por baixo desempenho documentado',
      createdAt: '2023-03-20T15:30:00Z',
      updatedAt: '2023-03-20T15:30:00Z',
    },
    {
      id: '8',
      employeeId: 'emp_008',
      employeeName: 'Fernanda Rodrigues',
      employeeEmail: 'fernanda.rodrigues@empresa.com',
      position: 'Coordenadora de RH',
      department: 'Recursos Humanos',
      hireDate: '2019-02-15',
      terminationDate: '2024-03-10',
      terminationType: 'voluntary',
      terminationReason: 'Mudança de carreira',
      lastWorkingDay: '2024-04-10',
      noticePeriod: 30,
      severancePay: 18000,
      riskLevel: 'low',
      notes: 'Demissão voluntária, sem problemas',
      createdAt: '2024-03-10T12:00:00Z',
      updatedAt: '2024-03-10T12:00:00Z',
    },
    {
      id: '9',
      employeeId: 'emp_009',
      employeeName: 'Lucas Pereira',
      employeeEmail: 'lucas.pereira@empresa.com',
      position: 'Analista de Marketing',
      department: 'Marketing',
      hireDate: '2022-01-05',
      terminationDate: '2022-09-30',
      terminationType: 'involuntary',
      terminationReason: 'Falta de adaptação',
      lastWorkingDay: '2022-10-30',
      noticePeriod: 30,
      severancePay: 5000,
      riskLevel: 'critical',
      notes: 'Funcionário entrou com processo trabalhista',
      createdAt: '2022-09-30T16:15:00Z',
      updatedAt: '2024-01-10T10:30:00Z',
    },
    {
      id: '10',
      employeeId: 'emp_010',
      employeeName: 'Patricia Souza',
      employeeEmail: 'patricia.souza@empresa.com',
      position: 'Assistente de Suporte',
      department: 'Tecnologia',
      hireDate: '2020-06-01',
      terminationDate: '2023-12-01',
      terminationType: 'mutual_agreement',
      terminationReason: 'Acordo mútuo - mudança de cidade',
      lastWorkingDay: '2024-01-01',
      noticePeriod: 30,
      severancePay: 9000,
      riskLevel: 'low',
      notes: 'Acordo bem estruturado e documentado',
      createdAt: '2023-12-01T09:30:00Z',
      updatedAt: '2023-12-01T09:30:00Z',
    },
  ];
}

function LaborLiabilitiesTable({ data }: { data: any[] }) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({ key: 'timeRemaining', direction: 'asc' });

  const calculateDaysRemaining = (terminationDate: string) => {
    const termination = new Date(terminationDate);
    const now = new Date();
    const daysSinceTermination = Math.floor((now.getTime() - termination.getTime()) / (1000 * 60 * 60 * 24));
    const prescriptionPeriod = 730; // 2 anos
    return prescriptionPeriod - daysSinceTermination;
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'timeRemaining':
          aValue = calculateDaysRemaining(a.terminationDate);
          bValue = calculateDaysRemaining(b.terminationDate);
          break;
        case 'employeeName':
          aValue = a.employeeName.toLowerCase();
          bValue = b.employeeName.toLowerCase();
          break;
        case 'terminationDate':
          aValue = new Date(a.terminationDate).getTime();
          bValue = new Date(b.terminationDate).getTime();
          break;
        case 'severancePay':
          aValue = a.severancePay || 0;
          bValue = b.severancePay || 0;
          break;
        case 'riskLevel':
          const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = riskOrder[a.riskLevel as keyof typeof riskOrder] || 0;
          bValue = riskOrder[b.riskLevel as keyof typeof riskOrder] || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUp className="h-3 w-3 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">Crítico</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-orange-500 text-orange-700 bg-orange-50">Alto</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">Médio</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Baixo</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  const getTerminationTypeBadge = (type: string) => {
    switch (type) {
      case 'voluntary':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Voluntária</Badge>;
      case 'involuntary':
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">Involuntária</Badge>;
      case 'mutual_agreement':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Acordo Mútuo</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTenure = (hireDate: string, terminationDate: string) => {
    const hire = new Date(hireDate);
    const termination = new Date(terminationDate);
    const diffTime = Math.abs(termination.getTime() - hire.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    const parts = [];
    if (years > 0) parts.push(`${years}a`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0) parts.push(`${days}d`);
    
    return parts.length > 0 ? parts.join(' ') : '0d';
  };

  const calculateTimeRemaining = (terminationDate: string) => {
    const termination = new Date(terminationDate);
    const now = new Date();
    const daysSinceTermination = Math.floor((now.getTime() - termination.getTime()) / (1000 * 60 * 60 * 24));
    
    const prescriptionPeriod = 730; // 2 anos
    const totalDays = prescriptionPeriod - daysSinceTermination;
    
    if (totalDays <= 0) {
      return <span className="text-gray-600 font-semibold">Risco Expirado</span>;
    }
    
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;
    
    const parts = [];
    if (years > 0) parts.push(`${years}a`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0) parts.push(`${days}d`);
    
    return <span className="text-muted-foreground">{parts.join(' ')}</span>;
  };

  return (
    <div className="space-y-4">
      {sortConfig && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Ordenado por:</span>
          <Badge variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-600 bg-gray-50">
            {sortConfig.key === 'employeeName' && 'Funcionário'}
            {sortConfig.key === 'terminationDate' && 'Data Demissão'}
            {sortConfig.key === 'riskLevel' && 'Nível Risco'}
            {sortConfig.key === 'timeRemaining' && 'Tempo Restante'}
            {sortConfig.key === 'severancePay' && 'Valor Rescisão'}
            {sortConfig.direction === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </Badge>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('employeeName')}
              >
                <span className="flex items-center gap-1">
                  Funcionário
                  {getSortIcon('employeeName')}
                </span>
              </Button>
            </TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('terminationDate')}
              >
                <span className="flex items-center gap-1">
                  Data Demissão
                  {getSortIcon('terminationDate')}
                </span>
              </Button>
            </TableHead>
            <TableHead>Tipo</TableHead>
            {/* <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('riskLevel')}
              >
                <span className="flex items-center gap-1">
                  Nível Risco
                  {getSortIcon('riskLevel')}
                </span>
              </Button>
            </TableHead> */}
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('timeRemaining')}
              >
                <span className="flex items-center gap-1">
                  Tempo Restante
                  {getSortIcon('timeRemaining')}
                </span>
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('severancePay')}
              >
                <span className="flex items-center gap-1">
                  Valor Rescisão
                  {getSortIcon('severancePay')}
                </span>
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((liability) => (
            <TableRow key={liability.id} className="hover:bg-muted/50">
              <TableCell>
                <div>
                  <div className="font-medium">{liability.employeeName}</div>
                  <div className="text-sm text-muted-foreground">
                    Tempo na empresa: {calculateTenure(liability.hireDate, liability.terminationDate)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{liability.position}</div>
                  {liability.department && (
                    <Badge variant="outline" className="text-xs mt-1 border-gray-300 text-gray-600 bg-gray-50">
                      {liability.department}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{formatDate(liability.terminationDate)}</span>
                </div>
              </TableCell>
              <TableCell>
                {getTerminationTypeBadge(liability.terminationType)}
              </TableCell>
              {/* <TableCell>
                {getRiskBadge(liability.riskLevel)}
              </TableCell> */}
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {calculateTimeRemaining(liability.terminationDate)}
                </div>
              </TableCell>
              <TableCell>
                {liability.severancePay ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-mono">
                      {formatCurrency(liability.severancePay)}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}

