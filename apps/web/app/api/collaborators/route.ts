import { NextResponse } from 'next/server';

import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';

import { executeQuery } from '~/lib/server/mysql-connection';
import { validateAccountAccess } from '~/lib/server/validate-account-access';

export const GET = enhanceRouteHandler(
  async function ({ user, request }) {
    const logger = await getLogger();

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('account_id');

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
      // Validate user has access to this account using RLS
      const validation = await validateAccountAccess(user.id, accountId);

      if (!validation.success || !validation.account) {
        logger.warn(
          {
            userId: user.id,
            accountId,
            error: validation.error,
          },
          'Access denied to account',
        );

        return NextResponse.json(
          {
            success: false,
            error: validation.error || 'Access denied',
          },
          { status: 403 },
        );
      }

      // Query com INNER JOIN apenas pelo CPF
      const rows = await executeQuery(
        `SELECT 
          ac.id,
          ac.full_name as collaborator_name,
          ac.cpf as collaborator_cpf,
          ac.branch as collaborator_branch,
          ac.admission_date as collaborator_admission_date,
          ac.account_id,
          ac.platform_id,
          ac.gender,
          ac.birth_date,
          ac.apprentice,
          ac.pcd,
          ac.resignation_date,
          ac.resignation_type,
          ac.resignation_type_other,
          ec.collaborator_status,
          ec.collaborator_link,
          ec.collaborator_department,
          ec.collaborator_cbo,
          ec.collaborator_base_salary,
          ec.reference_month,
          ec.reference_year
        FROM account_collaborators ac
        INNER JOIN (
          SELECT 
            collaborator_cpf,
            collaborator_status,
            collaborator_link,
            collaborator_department,
            collaborator_cbo,
            collaborator_base_salary,
            reference_month,
            reference_year,
            ROW_NUMBER() OVER (
              PARTITION BY collaborator_cpf 
              ORDER BY reference_year DESC, reference_month DESC, id DESC
            ) as rn
          FROM events_collaborators
        ) ec ON ac.cpf = ec.collaborator_cpf AND ec.rn = 1
        WHERE ac.account_id = ?
        ORDER BY ac.full_name ASC`,
        [accountId],
      );

      const rowsArray = Array.isArray(rows) ? rows : [];

      logger.info(
        {
          userId: user.id,
          accountId,
          totalRows: rowsArray.length,
        },
        'Successfully fetched collaborators data',
      );

      return NextResponse.json({
        success: true,
        data: rowsArray,
        total: rowsArray.length,
      });
    } catch (error) {
      logger.error(
        {
          userId: user.id,
          accountId,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error fetching collaborators data',
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch collaborators data',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);

export const PATCH = enhanceRouteHandler(
  async function ({ user, request }) {
    const logger = await getLogger();

    try {
      const body = await request.json();
      const {
        collaborator_cpf,
        account_id,
        gender,
        birth_date,
        apprentice,
        pcd,
        resignation_date,
        resignation_type,
        resignation_type_other,
      } = body;

      // Validação de campos obrigatórios
      if (!collaborator_cpf || !account_id) {
        return NextResponse.json(
          {
            success: false,
            error: 'Collaborator CPF and Account ID are required',
          },
          { status: 400 },
        );
      }

      // Validate user has access to this account
      const validation = await validateAccountAccess(user.id, account_id);

      if (!validation.success || !validation.account) {
        logger.warn(
          {
            userId: user.id,
            accountId: account_id,
            collaboratorCpf: collaborator_cpf,
            error: validation.error,
          },
          'Access denied to account',
        );

        return NextResponse.json(
          {
            success: false,
            error: validation.error || 'Access denied',
          },
          { status: 403 },
        );
      }

      // Construir query de atualização dinamicamente
      const updateFields: string[] = [];
      const updateValues: (string | number | null)[] = [];

      if (gender !== undefined && gender !== null) {
        updateFields.push('gender = ?');
        updateValues.push(gender);
      }

      if (birth_date !== undefined && birth_date !== null) {
        updateFields.push('birth_date = ?');
        updateValues.push(birth_date);
      }

      if (apprentice !== undefined && apprentice !== null) {
        updateFields.push('apprentice = ?');
        updateValues.push(apprentice ? 1 : 0);
      }

      if (pcd !== undefined && pcd !== null) {
        updateFields.push('pcd = ?');
        updateValues.push(pcd ? 1 : 0);
      }

      if (resignation_date !== undefined && resignation_date !== null) {
        updateFields.push('resignation_date = ?');
        updateValues.push(resignation_date);
      }

      if (resignation_type !== undefined && resignation_type !== null) {
        updateFields.push('resignation_type = ?');
        updateValues.push(resignation_type);
      }

      if (
        resignation_type_other !== undefined &&
        resignation_type_other !== null
      ) {
        updateFields.push('resignation_type_other = ?');
        updateValues.push(resignation_type_other);
      }

      // Adicionar updated_at
      updateFields.push('updated_at = NOW()');

      if (updateFields.length === 1) {
        // Apenas updated_at, nenhum campo para atualizar
        return NextResponse.json(
          {
            success: false,
            error: 'No fields to update',
          },
          { status: 400 },
        );
      }

      // Adicionar WHERE clause values
      updateValues.push(collaborator_cpf);
      updateValues.push(account_id);

      // Executar update
      await executeQuery(
        `UPDATE account_collaborators 
         SET ${updateFields.join(', ')}
         WHERE cpf = ? AND account_id = ?`,
        updateValues,
      );

      logger.info(
        {
          userId: user.id,
          accountId: account_id,
          collaboratorCpf: collaborator_cpf,
          updatedFields: updateFields,
        },
        'Successfully updated collaborator data',
      );

      return NextResponse.json({
        success: true,
        message: 'Collaborator updated successfully',
      });
    } catch (error) {
      logger.error(
        {
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error updating collaborator data',
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update collaborator',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);

