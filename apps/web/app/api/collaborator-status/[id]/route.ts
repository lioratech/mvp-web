import { NextResponse } from 'next/server';

import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';

import { executeQuery } from '~/lib/server/mysql-connection';
import { validateAccountAccess } from '~/lib/server/validate-account-access';

export const PUT = enhanceRouteHandler(
  async function ({ user, request, params }) {
    const logger = await getLogger();

    const { id } = await params;
    const body = await request.json();
    const { account_id, name, type, status, notes } = body;

    if (!account_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account ID is required',
        },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name is required',
        },
        { status: 400 },
      );
    }

    try {
      // Validate user has access to this account
      const validation = await validateAccountAccess(user.id, account_id);

      if (!validation.success) {
        logger.warn(
          {
            userId: user.id,
            accountId: account_id,
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

      // Verificar se o status existe
      const statusRows = await executeQuery(
        `SELECT id FROM collaborator_status WHERE id = ? AND account_id = ?`,
        [id, account_id],
      );

      if (!statusRows || statusRows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Collaborator status not found',
          },
          { status: 404 },
        );
      }

      // Atualizar no MySQL
      await executeQuery(
        `UPDATE collaborator_status 
         SET 
           name = ?,
           type = ?,
           status = ?,
           notes = ?,
           updated_at = NOW()
         WHERE id = ? AND account_id = ?`,
        [name, type, status, notes, id, account_id],
      );

      logger.info(
        {
          userId: user.id,
          accountId: account_id,
          statusId: id,
          name,
        },
        'Successfully updated collaborator status',
      );

      return NextResponse.json({
        success: true,
        message: 'Collaborator status updated successfully',
      });
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'Error updating collaborator status',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update collaborator status',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);

export const DELETE = enhanceRouteHandler(
  async function ({ user, request, params }) {
    const logger = await getLogger();

    const { id } = await params;
    const body = await request.json();
    const { account_id } = body;

    if (!account_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account ID is required',
        },
        { status: 400 },
      );
    }

    try {
      // Validate user has access to this account
      const validation = await validateAccountAccess(user.id, account_id);

      if (!validation.success) {
        logger.warn(
          {
            userId: user.id,
            accountId: account_id,
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

      // Verificar se o status existe
      const statusRows = await executeQuery(
        `SELECT id, name FROM collaborator_status WHERE id = ? AND account_id = ?`,
        [id, account_id],
      );

      if (!statusRows || statusRows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Collaborator status not found',
          },
          { status: 404 },
        );
      }

      // Excluir do MySQL
      await executeQuery(
        `DELETE FROM collaborator_status WHERE id = ? AND account_id = ?`,
        [id, account_id],
      );

      logger.info(
        {
          userId: user.id,
          accountId: account_id,
          statusId: id,
          statusName: statusRows[0].name,
        },
        'Successfully deleted collaborator status',
      );

      return NextResponse.json({
        success: true,
        message: 'Collaborator status deleted successfully',
      });
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'Error deleting collaborator status',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete collaborator status',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);
