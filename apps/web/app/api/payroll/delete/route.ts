import { NextResponse } from 'next/server';

import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';

import { getMySQLPool } from '~/lib/server/mysql-connection';

import { DeletePayrollRequestSchema } from './schema';

export const POST = enhanceRouteHandler(
  async function ({ body, user, request }) {
    const logger = await getLogger();

    const { accountId, platformId } = body;

    logger.info(
      {
        accountId,
        platformId,
        userId: user.id,
      },
      'Iniciando exclusão de dados da folha do MySQL',
    );

    const startTime = Date.now();
    const pool = getMySQLPool();
    const connection = await pool.getConnection();

    try {
      // Iniciar transação
      await connection.beginTransaction();
      logger.info({ userId: user.id, platformId }, 'Transaction started');

      // Arrays para contar registros deletados
      const deletedCounts = {
        events_collaborators: 0,
        events_heading: 0,
        events_inss: 0,
        events_fgts_pis_iss: 0,
        events_irpf_calc: 0,
        events_irpf_payment: 0,
        account_collaborators: 0,
      };

      // 1. Deletar events_collaborators
      const [resultCollaborators] = await connection.execute(
        `DELETE FROM events_collaborators WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.events_collaborators = (resultCollaborators as any)
        .affectedRows;

      // 2. Deletar events_heading
      const [resultHeading] = await connection.execute(
        `DELETE FROM events_heading WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.events_heading = (resultHeading as any).affectedRows;

      // 3. Deletar events_inss
      const [resultInss] = await connection.execute(
        `DELETE FROM events_inss WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.events_inss = (resultInss as any).affectedRows;

      // 4. Deletar events_fgts_pis_iss
      const [resultFgts] = await connection.execute(
        `DELETE FROM events_fgts_pis_iss WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.events_fgts_pis_iss = (resultFgts as any).affectedRows;

      // 5. Deletar events_irpf_calc
      const [resultIrpfCalc] = await connection.execute(
        `DELETE FROM events_irpf_calc WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.events_irpf_calc = (resultIrpfCalc as any).affectedRows;

      // 6. Deletar events_irpf_payment
      const [resultIrpfPayment] = await connection.execute(
        `DELETE FROM events_irpf_payment WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.events_irpf_payment = (resultIrpfPayment as any)
        .affectedRows;

      // 7. Deletar account_collaborators (apenas os que têm esse platform_id)
      const [resultAccountCollaborators] = await connection.execute(
        `DELETE FROM account_collaborators WHERE account_id = ? AND platform_id = ?`,
        [accountId, platformId],
      );
      deletedCounts.account_collaborators = (resultAccountCollaborators as any)
        .affectedRows;

      // Commit da transação
      await connection.commit();
      logger.info(
        { userId: user.id, accountId, platformId },
        'Transaction committed successfully',
      );

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      logger.info(
        {
          userId: user.id,
          accountId,
          platformId,
          deletedCounts,
          duration: `${duration}s`,
        },
        'Payroll data deleted successfully from MySQL',
      );

      return NextResponse.json({
        success: true,
        data: {
          deletedCounts,
          duration: `${duration}s`,
        },
      });
    } catch (error) {
      // Rollback da transação em caso de erro
      try {
        await connection.rollback();
        logger.warn(
          { userId: user.id, accountId, platformId },
          'Transaction rolled back due to error',
        );
      } catch (rollbackError) {
        logger.error(
          { userId: user.id, accountId, platformId, rollbackError },
          'Error during rollback',
        );
      }

      logger.error(
        { userId: user.id, accountId, platformId, error },
        'Error deleting payroll data from MySQL',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete payroll data',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      );
    } finally {
      // Liberar a conexão de volta ao pool
      try {
        connection.release();
        logger.info(
          { userId: user.id, accountId, platformId },
          'Database connection released',
        );
      } catch (releaseError) {
        logger.error(
          { userId: user.id, accountId, platformId, releaseError },
          'Error releasing connection',
        );
      }
    }
  },
  {
    auth: true,
    schema: DeletePayrollRequestSchema,
  },
);

