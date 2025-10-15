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
      const rows = await executeQuery(
        `WITH latest_period AS (
          -- Identificar a referência mais recente disponível
          SELECT 
            ec.reference_year,
            ec.reference_month
          FROM events_collaborators ec
          WHERE ec.account_id = ?
          AND ec.company_cnpj = ?
          ${branch ? 'AND ec.collaborator_branch = ?' : ''}
          ORDER BY ec.reference_year DESC, ec.reference_month DESC
          LIMIT 1
        ),
        current_collaborators AS (
          -- Colaboradores da referência mais recente (último registro de cada CPF nessa referência)
          SELECT DISTINCT
            ec.collaborator_cpf,
            MAX(ec.id) as latest_id
          FROM events_collaborators ec
          INNER JOIN latest_period lp 
            ON ec.reference_year = lp.reference_year 
            AND ec.reference_month = lp.reference_month
          WHERE ec.account_id = ?
          AND ec.company_cnpj = ?
          ${branch ? 'AND ec.collaborator_branch = ?' : ''}
          GROUP BY ec.collaborator_cpf
        ),
        historical_collaborators AS (
          -- Colaboradores de outras referências que NÃO estão na referência mais recente
          SELECT 
            ec.collaborator_cpf,
            MAX(ec.id) as latest_id
          FROM events_collaborators ec
          WHERE ec.account_id = ?
          AND ec.company_cnpj = ?
          ${branch ? 'AND ec.collaborator_branch = ?' : ''}
          AND ec.collaborator_cpf NOT IN (
            SELECT collaborator_cpf FROM current_collaborators
          )
          GROUP BY ec.collaborator_cpf
        ),
        all_collaborators AS (
          -- União de colaboradores atuais e históricos
          SELECT collaborator_cpf, latest_id FROM current_collaborators
          UNION ALL
          SELECT collaborator_cpf, latest_id FROM historical_collaborators
        )
        -- Buscar todos os dados dos colaboradores selecionados
        SELECT 
          ec.id,
          ec.platform_id,
          ec.account_id,
          ec.reference_month,
          ec.reference_year,
          ec.company_cnpj,
          ec.company_code,
          ec.company_issue_date,
          ec.collaborator_code,
          ec.collaborator_name,
          ec.collaborator_cpf,
          ec.collaborator_status,
          ec.collaborator_admission_date,
          ec.collaborator_link,
          ec.collaborator_cc,
          ec.collaborator_department,
          ec.collaborator_hours_per_month,
          ec.collaborator_position_code,
          ec.collaborator_position_description,
          ec.collaborator_cbo,
          ec.collaborator_branch,
          ec.collaborator_salary,
          ec.collaborator_base_salary,
          ec.event_code,
          ec.event_description,
          ec.event_quantity,
          ec.event_value,
          ec.event_type,
          ec.total_earnings,
          ec.total_deductions,
          ec.total_net_salary,
          ec.base_inss,
          ec.base_fgts,
          ec.base_fgts_value,
          ec.base_irrf
        FROM events_collaborators ec
        INNER JOIN all_collaborators ac ON ec.id = ac.latest_id
        ORDER BY 
          ec.reference_year DESC,
          ec.reference_month DESC,
          ec.collaborator_name ASC
        LIMIT 500`,
        branch 
          ? [accountId, cnpj, branch, accountId, cnpj, branch, accountId, cnpj, branch]
          : [accountId, cnpj, accountId, cnpj, accountId, cnpj],
      );

      // Calcular estatísticas para log
      const rowsArray = Array.isArray(rows) ? rows : [];
      const latestPeriod = rowsArray.length > 0 
        ? { 
            year: (rowsArray[0] as { reference_year: number }).reference_year, 
            month: (rowsArray[0] as { reference_month: number }).reference_month 
          }
        : null;
      
      const currentPeriodCount = rowsArray.filter((r: any) =>
        r.reference_year === latestPeriod?.year && r.reference_month === latestPeriod?.month
      ).length;
      
      const historicalCount = rowsArray.length - currentPeriodCount;

      logger.info(
        {
          userId: user.id,
          accountId,
          cnpj,
          branch,
          totalRows: rowsArray.length,
          latestPeriod,
          currentPeriodCollaborators: currentPeriodCount,
          historicalCollaborators: historicalCount,
        },
        'Successfully fetched collaborators data for account',
      );

      return NextResponse.json({
        success: true,
        data: rows,
      });
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'Error fetching collaborators analytics data',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch collaborators data',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);
