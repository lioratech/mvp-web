import { NextResponse } from 'next/server';

import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';

import { executeQuery } from '~/lib/server/mysql-connection';

export const GET = enhanceRouteHandler(
  async function ({ user }) {
    const logger = await getLogger();

    try {
      logger.info(
        { userId: user.id },
        'Testing MySQL connection',
      );

      // Testar conexão executando uma query simples
      const result = await executeQuery<Array<{ result: number }>>(
        'SELECT 1 as result'
      );

      const isConnected = result && result.length > 0 && result[0].result === 1;

      if (isConnected) {
        // Obter informações adicionais sobre o MySQL
        const versionResult = await executeQuery<Array<{ version: string }>>(
          'SELECT VERSION() as version'
        );
        const mysqlVersion = versionResult[0]?.version || 'unknown';

        // Testar query na tabela account_collaborators
        const collaborators = await executeQuery<any[]>(
          'SELECT * FROM account_collaborators LIMIT 5'
        );

        const poolInfo = {
          host: process.env.MYSQL_HOST || 'localhost',
          database: process.env.MYSQL_DATABASE,
          port: Number(process.env.MYSQL_PORT) || 3306,
          user: process.env.MYSQL_USER,
        };

        logger.info(
          { userId: user.id, ...poolInfo, mysqlVersion },
          'MySQL connection successful',
        );

        return NextResponse.json({
          success: true,
          message: 'MySQL connection successful',
          connected: true,
          mysqlVersion,
          pool: poolInfo,
          collaborators: {
            count: collaborators.length,
            sample: collaborators,
          },
        });
      } else {
        logger.warn(
          { userId: user.id },
          'MySQL connection failed - unexpected result',
        );

        return NextResponse.json(
          {
            success: false,
            message: 'MySQL connection failed - unexpected result',
            connected: false,
          },
          { status: 500 },
        );
      }
    } catch (error) {
      logger.error(
        { userId: user.id, error },
        'MySQL connection error',
      );

      return NextResponse.json(
        {
          success: false,
          message: 'MySQL connection failed',
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      );
    }
  },
  {
    auth: true,
  },
);
