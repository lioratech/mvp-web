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

      // Buscar dados do MySQL
      const rows = await executeQuery(
        `SELECT 
          id,
          platform_id,
          account_id,
          name,
          type,
          status,
          notes,
          created_at,
          updated_at
        FROM account_collaborator_status 
        WHERE account_id = ?
        ORDER BY name ASC`,
        [accountId],
      );

      const rowsArray = Array.isArray(rows) ? rows : [];

      logger.info(
        {
          userId: user.id,
          accountId,
          totalRows: rowsArray.length,
        },
        'Successfully fetched collaborator status data',
      );

      return NextResponse.json({
        success: true,
        data: rows,
      });
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'Error fetching collaborator status data',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch collaborator status data',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);

export const POST = enhanceRouteHandler(
  async function ({ user, request }) {
    const logger = await getLogger();

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
      const { validateAccountAccess } = await import('~/lib/server/validate-account-access');
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

      // Inserir no MySQL
      await executeQuery(
        `INSERT INTO collaborator_status (account_id, name, type, status, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [account_id, name, type, status, notes],
      );

      logger.info(
        {
          userId: user.id,
          accountId: account_id,
          name,
        },
        'Successfully created collaborator status',
      );

      return NextResponse.json({
        success: true,
        message: 'Collaborator status created successfully',
      });
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'Error creating collaborator status',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create collaborator status',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);
