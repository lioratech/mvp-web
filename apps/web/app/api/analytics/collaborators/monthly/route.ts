import { NextResponse } from 'next/server';

import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';

import { executeQuery } from '~/lib/server/mysql-connection';

export const GET = enhanceRouteHandler(
  async function ({ user, request }) {
    const logger = await getLogger();

    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get('cnpj');
    const branch = searchParams.get('branch');
    const accountId = searchParams.get('account_id');
    const months = searchParams.get('months') || '3'; // Default: últimos 3 meses

    if (!cnpj) {
      return NextResponse.json(
        {
          success: false,
          error: 'CNPJ parameter is required',
        },
        { status: 400 },
      );
    }

    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account ID parameter is required',
        },
        { status: 400 },
      );
    }

    try {
      // Query que busca os últimos N meses de dados agrupados por status
      const analyticsData = await executeQuery(
        `WITH target_periods AS (
          -- Identificar os últimos N períodos disponíveis no banco
          SELECT DISTINCT 
            ec.reference_year,
            ec.reference_month,
            CONCAT(ec.reference_year, '-', LPAD(ec.reference_month, 2, '0')) as period
          FROM events_collaborators ec
          WHERE ec.account_id = ?
          AND ec.company_cnpj = ?
          ${branch ? 'AND ec.collaborator_branch = ?' : ''}
          ORDER BY ec.reference_year DESC, ec.reference_month DESC
          LIMIT ?
        )
        SELECT 
          ec.reference_year as year,
          ec.reference_month as month,
          CONCAT(ec.reference_year, '-', LPAD(ec.reference_month, 2, '0')) as period,
          ec.collaborator_status as status,
          COUNT(DISTINCT ec.collaborator_cpf) as count
        FROM events_collaborators ec
        INNER JOIN target_periods tp 
          ON ec.reference_year = tp.reference_year 
          AND ec.reference_month = tp.reference_month
        WHERE ec.account_id = ?
        AND ec.company_cnpj = ?
        ${branch ? 'AND ec.collaborator_branch = ?' : ''}
        GROUP BY ec.reference_year, ec.reference_month, ec.collaborator_status
        ORDER BY ec.reference_year DESC, ec.reference_month DESC, ec.collaborator_status`,
        branch 
          ? [accountId, cnpj, branch, parseInt(months), accountId, cnpj, branch]
          : [accountId, cnpj, parseInt(months), accountId, cnpj],
      );

      // Processar resultados da query
      const rawData = Array.isArray(analyticsData) ? analyticsData : [];
      
      // Log para debug
      logger.info(
        {
          userId: user.id,
          accountId,
          cnpj,
          branch,
          rawDataCount: rawData.length,
          sampleData: rawData.slice(0, 3),
        },
        'Raw data received from query',
      );
      
      // Estrutura para armazenar dados por mês
      const monthlyMap = new Map<string, {
        year: number;
        month: number;
        period: string;
        month_name: string;
        total: number;
        status_breakdown: Array<{
          status: string;
          count: number;
        }>;
      }>();

      // Processar dados da query
      rawData.forEach((row: {
        year: number;
        month: number;
        period: string;
        status: string;
        count: number;
      }) => {
        const key = row.period;
        const count = Number(row.count) || 0;
        
        if (!monthlyMap.has(key)) {
          // Array de meses em português
          const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const monthShort = monthNames[row.month - 1]; // month é 1-indexed
          const yearShort = String(row.year).slice(-2); // Últimos 2 dígitos do ano
          
          monthlyMap.set(key, {
            year: Number(row.year),
            month: Number(row.month),
            period: row.period,
            month_name: `${monthShort}/${yearShort}`, // Formato: jan/25
            total: 0,
            status_breakdown: [],
          });
        }

        const monthData = monthlyMap.get(key)!;
        monthData.total += count; // Acumular total do mês
        monthData.status_breakdown.push({
          status: row.status || 'Desconhecido',
          count: count,
        });
      });

      // Converter para array, ordenar cronologicamente e limitar aos últimos N meses
      const allMonths = Array.from(monthlyMap.values()).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year; // Mais recente primeiro
        return b.month - a.month;
      });

      // Pegar apenas os últimos N meses e reverter para ordem cronológica
      const monthly = allMonths
        .slice(0, parseInt(months))
        .reverse();

      // Verificar se há dados
      if (rawData.length === 0) {
        logger.warn(
          {
            userId: user.id,
            accountId,
            cnpj,
            branch,
          },
          'No data found for the given filters',
        );
      }

      // Calcular totais atuais (dados do mês mais recente)
      const currentMonth = monthly.length > 0 ? monthly[monthly.length - 1] : null;
      const currentStats = {
        total_colaboradores: currentMonth?.total || 0,
        status_breakdown: currentMonth?.status_breakdown || [],
      };

      // Calcular crescimento percentual (comparando último vs penúltimo mês)
      let growthPercentage = 0;
      if (monthly.length >= 2) {
        const currentMonthData = monthly[monthly.length - 1];
        const previousMonthData = monthly[monthly.length - 2];
        
        if (currentMonthData && previousMonthData && previousMonthData.total > 0) {
          const currentTotal = currentMonthData.total;
          const previousTotal = previousMonthData.total;
          
          growthPercentage = Number(
            (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
          );
        }
      }

      logger.info(
        {
          userId: user.id,
          accountId,
          cnpj,
          branch,
          months,
          currentTotal: currentStats.total_colaboradores,
          monthlyRecords: monthly.length,
          uniqueMonths: monthlyMap.size,
        },
        'Successfully fetched monthly collaborators analytics data',
      );

      return NextResponse.json({
        success: true,
        data: {
          current: {
            ...currentStats,
            growth_percentage: growthPercentage,
          },
          monthly,
        },
      });
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'Error fetching monthly collaborators analytics data',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch monthly collaborators data',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);
