import { NextResponse } from 'next/server';

import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';

import { getMySQLPool } from '~/lib/server/mysql-connection';

import { ProcessPayrollRequestSchema } from './schema';

export const POST = enhanceRouteHandler(
  async function ({ body, user, request }) {
    const logger = await getLogger();

    const { accountId, payrollData } = body;

    logger.info(
      {
        accountId,
        competenciasCount: payrollData?.competencias?.length || 0,
        competenciasWithPlatformId:
          payrollData?.competencias?.filter((c) => c?.platform_id).length || 0,
      },
      'Dados recebidos na API de processamento',
    );

    const startTime = Date.now();
    const pool = getMySQLPool();
    const connection = await pool.getConnection();

    try {
      logger.info(
        {
          userId: user.id,
          accountId,
          cnpj: payrollData?.empresa?.cnpj,
          competenciasCount: payrollData?.competencias?.length || 0,
        },
        'Processing payroll data - Starting transaction',
      );

      // Iniciar transação
      await connection.beginTransaction();
      logger.info({ userId: user.id }, 'Transaction started');

      const empresa = payrollData?.empresa;

      if (!empresa?.emissao || !empresa?.cnpj) {
        throw new Error('Dados da empresa inválidos');
      }

      // Formatar data de emissão
      const [dia, mes, ano] = empresa.emissao.split('/');
      const empresaEmissao = `${ano}-${mes}-${dia}`;

      // Limpar CNPJ
      const empresaCnpj = empresa.cnpj.replace(/[.\-\/]/g, '');

      // Arrays para bulk insert
      const bulkCollaborators: any[] = [];
      const bulkAccountCollaborators: any[] = [];
      const bulkCollaboratorStatus: string[] = [];

      let totalEventos = 0;
      let totalRubricas = 0;

      // Processar cada competência
      for (const competenciaItem of payrollData?.competencias || []) {
        if (!competenciaItem?.competencia) continue;

        const [mesCompetencia, anoCompetencia] =
          competenciaItem.competencia.split('/');

        // Pegar platform_id diretamente da competência
        const platformId = competenciaItem.platform_id;

        logger.info(
          {
            competencia: competenciaItem.competencia,
            platformId,
            hasPlatformId: !!platformId,
          },
          'Processando competência',
        );

        // Processar funcionários e eventos
        if (Array.isArray(competenciaItem.funcionarios)) {
          for (const funcionario of competenciaItem.funcionarios) {
            if (!funcionario?.cpf || !funcionario?.data_admissao) continue;

            const funcionarioCpf = funcionario.cpf.replace(/[.\-\/]/g, '');
            const [admDia, admMes, admAno] =
              funcionario.data_admissao.split('/');
            const admissaoFuncionario = `${admAno}-${admMes}-${admDia}`;

            // Adicionar status do colaborador
            if (
              funcionario.situacao &&
              !bulkCollaboratorStatus.includes(funcionario.situacao)
            ) {
              bulkCollaboratorStatus.push(funcionario.situacao);
            }

            // Adicionar dados do colaborador
            bulkAccountCollaborators.push([
              funcionario.nome || '',
              funcionarioCpf,
              funcionario.filial || '',
              admissaoFuncionario,
              accountId,
              platformId,
            ]);

            // Processar eventos do funcionário
            if (Array.isArray(funcionario.eventos)) {
              for (const evento of funcionario.eventos) {
                if (!evento) continue;
                totalEventos++;

                bulkCollaborators.push([
                  mesCompetencia,
                  anoCompetencia,
                  empresa.codigo || '',
                  empresaCnpj,
                  empresaEmissao,
                  funcionario.codigo || '',
                  funcionario.nome || '',
                  funcionarioCpf,
                  funcionario.situacao || '',
                  admissaoFuncionario,
                  funcionario.vinculo || '',
                  funcionario.cc || '',
                  funcionario.depto || '',
                  funcionario.horas_mes || 0,
                  funcionario.cargo_codigo || '',
                  funcionario.cargo_descricao || '',
                  funcionario.cbo || '',
                  funcionario.filial || '',
                  funcionario.salario || 0,
                  funcionario.salario_base || 0,
                  evento.codigo || '',
                  evento.descricao || '',
                  evento.quantidade || 0,
                  evento.valor || 0,
                  evento.tipo || '',
                  funcionario.totais?.proventos || 0,
                  funcionario.totais?.descontos || 0,
                  funcionario.totais?.liquido || 0,
                  funcionario.bases?.base_inss || 0,
                  funcionario.bases?.base_fgts || 0,
                  funcionario.bases?.base_irrf || 0,
                  funcionario.bases?.valor_fgts || 0,
                  accountId,
                  platformId,
                ]);
              }
            }
          }
        }

        if (Array.isArray(competenciaItem.resumo_rubrica)) {
          for (const rubrica of competenciaItem.resumo_rubrica) {
            if (!rubrica) continue;
            totalRubricas++;

            await connection.execute(
              `INSERT INTO events_heading (
                reference_month, reference_year, company_code, company_cnpj,
                company_issue_date, heading_code, heading_description,
                heading_quantity, heading_value, heading_type, account_id, platform_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                mesCompetencia,
                anoCompetencia,
                empresa.codigo || '',
                empresaCnpj,
                empresaEmissao,
                rubrica.codigo || '',
                rubrica.descricao || '',
                rubrica.quantidade || 0,
                rubrica.valor || 0,
                rubrica.tipo || '',
                accountId,
                platformId,
              ],
            );
          }
        }

        if (competenciaItem.quadro_competencia?.inss) {
          const inss = competenciaItem.quadro_competencia.inss;

          await connection.execute(
            `INSERT INTO events_inss (
              reference_month, reference_year, company_code, company_cnpj,
              company_issue_date, inss_salary_contribution_employees,
              inss_salary_contribution_contributors, inss_exceeding,
              inss_total_base, inss_insured, inss_rat, inss_contributors,
              inss_third_parties, inss_total, inss_base_gross_revenue,
              inss_family_allowance, inss_maternity_leave,
              inss_cooperative_values, account_id, platform_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              mesCompetencia,
              anoCompetencia,
              empresa.codigo || '',
              empresaCnpj,
              empresaEmissao,
              inss['Salário contribuição empregados'] || 0,
              inss['Salário contribuição contribuintes'] || 0,
              inss['Excedente'] || 0,
              inss['Base total'] || 0,
              inss['Segurados'] || 0,
              inss['RAT'] || 0,
              inss['Contribuintes'] || 0,
              inss['Terceiros'] || 0,
              inss['Total INSS'] || 0,
              inss['Base INSS Receita Bruta'] || 0,
              inss['(-) Salário Família'] || 0,
              inss['(-) Salário Maternidade'] || 0,
              inss['Valores pagos a Cooperativas'] || 0,
              accountId,
              platformId,
            ],
          );
        }

        // Processar FGTS/PIS/ISS
        if (competenciaItem.quadro_competencia?.fgts_pis_iss) {
          const fgts = competenciaItem.quadro_competencia.fgts_pis_iss;

          await connection.execute(
            `INSERT INTO events_fgts_pis_iss (
              reference_month, reference_year, company_code, company_cnpj,
              company_issue_date, base_fgts, value_fgts, base_fgts_apprentice,
              value_fgts_apprentice, base_fgts_resignation,
              base_fgts_resignation_previous_month,
              value_fgts_resignation_previous_month, base_pis, value_pis,
              base_iss, value_iss, account_id, platform_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              mesCompetencia,
              anoCompetencia,
              empresa.codigo || '',
              empresaCnpj,
              empresaEmissao,
              fgts['Base do FGTS'] || 0,
              fgts['Valor do FGTS'] || 0,
              fgts['Base do FGTS Aprendiz'] || 0,
              fgts['Valor do FGTS Aprendiz'] || 0,
              fgts['Base FGTS Rescisório'] || 0,
              fgts['Base FGTS Resc. mês ant.'] || 0,
              fgts['Valor FGTS Resc. mês ant.'] || 0,
              fgts['Base PIS'] || 0,
              fgts['Valor PIS'] || 0,
              fgts['Base ISS'] || 0,
              fgts['Valor ISS'] || 0,
              accountId,
              platformId,
            ],
          );
        }

        // Processar IRRF Cálculo
        if (competenciaItem.quadro_competencia?.irrf_calculo) {
          const irrf = competenciaItem.quadro_competencia.irrf_calculo;

          await connection.execute(
            `INSERT INTO events_irpf_calc (
              reference_month, reference_year, company_code, company_cnpj,
              company_issue_date, base_irpf_monthly, value_irpf_monthly,
              base_irpf_vacation, value_irpf_vacation,
              base_irpf_profit_sharing, value_irpf_profit_sharing,
              base_irpf_foreign, value_irpf_foreign, salary,
              total_value_irpf, irpf_rentals, irpf_contributors, account_id, platform_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              mesCompetencia,
              anoCompetencia,
              empresa.codigo || '',
              empresaCnpj,
              empresaEmissao,
              irrf['Base IRRF Mensal'] || 0,
              irrf['Valor IRRF Mensal'] || 0,
              irrf['Base IRRF Férias'] || 0,
              irrf['Valor IRRF Férias'] || 0,
              irrf['Base IRRF Partic. Lucros'] || 0,
              irrf['Valor IRRF Partic. Lucros'] || 0,
              irrf['Base IRRF Exterior'] || 0,
              irrf['Valor IRRF Exterior'] || 0,
              irrf['Salário'] || 0,
              irrf['Valor Total do IRRF'] || 0,
              irrf['IRRF Aluguéis'] || 0,
              irrf['IRRF contribuintes'] || 0,
              accountId,
              platformId,
            ],
          );
        }

        // Processar IRRF Pagamento
        if (competenciaItem.quadro_competencia?.irrf_pagamento) {
          const irrf = competenciaItem.quadro_competencia.irrf_pagamento;

          await connection.execute(
            `INSERT INTO events_irpf_payment (
              reference_month, reference_year, company_code, company_cnpj,
              company_issue_date, base_irpf_monthly, value_irpf_monthly,
              base_irpf_vacation, value_irpf_vacation,
              base_irpf_profit_sharing, value_irpf_profit_sharing,
              base_irpf_foreign, value_irpf_foreign, salary,
              total_value_irpf, irpf_rentals, irpf_contributors, account_id, platform_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              mesCompetencia,
              anoCompetencia,
              empresa.codigo || '',
              empresaCnpj,
              empresaEmissao,
              irrf['Base IRRF Mensal'] || 0,
              irrf['Valor IRRF Mensal'] || 0,
              irrf['Base IRRF Férias'] || 0,
              irrf['Valor IRRF Férias'] || 0,
              irrf['Base IRRF Partic. Lucros'] || 0,
              irrf['Valor IRRF Partic. Lucros'] || 0,
              irrf['Base IRRF Exterior'] || 0,
              irrf['Valor IRRF Exterior'] || 0,
              irrf['Salário'] || 0,
              irrf['Valor Total do IRRF'] || 0,
              irrf['IRRF Aluguéis'] || 0,
              irrf['IRRF contribuintes'] || 0,
              accountId,
              platformId,
            ],
          );
        }
      }

      // Inserir colaboradores únicos
      if (bulkAccountCollaborators.length > 0) {
        const cpfMap = new Map();
        for (const row of bulkAccountCollaborators) {
          const cpf = row[1];
          if (!cpfMap.has(cpf)) cpfMap.set(cpf, row);
        }
        const uniqueCollaborators = Array.from(cpfMap.values());

        if (uniqueCollaborators.length > 0) {
          const cpfs = uniqueCollaborators.map((r) => r[1]);

          // Buscar CPFs existentes em lotes para evitar exceder o limite de placeholders
          const existingCpfSet = new Set<string>();
          const selectBatchSize = 20000;

          for (let i = 0; i < cpfs.length; i += selectBatchSize) {
            const batchCpfs = cpfs.slice(i, i + selectBatchSize);
            const cpfPlaceholders = batchCpfs.map(() => '?').join(',');

            const [existingCpfsRows] = await connection.execute<any[]>(
              `SELECT cpf FROM account_collaborators WHERE cpf IN (${cpfPlaceholders})`,
              batchCpfs,
            );
            const existingCpfs = existingCpfsRows as Array<{ cpf: string }>;

            existingCpfs.forEach((r) => existingCpfSet.add(String(r.cpf)));
          }

          const newCollaborators = uniqueCollaborators.filter(
            (r) => !existingCpfSet.has(String(r[1])),
          );

          if (newCollaborators.length > 0) {
            // 6 colunas - processar em lotes
            // 65535 / 6 = ~10922 registros por lote
            // Usando 10000 para ter margem de segurança
            const batchSize = 10000;

            for (let i = 0; i < newCollaborators.length; i += batchSize) {
              const batch = newCollaborators.slice(i, i + batchSize);
              const valuesPlaceholder = batch
                .map(() => '(?,?,?,?,?,?)')
                .join(',');
              const flatValues = batch.flat();

              await connection.execute(
                `INSERT INTO account_collaborators (
                  full_name, cpf, branch, admission_date, account_id, platform_id
                ) VALUES ${valuesPlaceholder}`,
                flatValues,
              );
            }

            logger.info(
              { count: newCollaborators.length },
              'New collaborators inserted',
            );
          }
        }
      }

      if (bulkCollaboratorStatus.length > 0) {
        // Processar status únicos
        const uniqueStatuses = new Set<string>();

        for (const status of bulkCollaboratorStatus) {
          if (status && !uniqueStatuses.has(status)) {
            uniqueStatuses.add(status);
          }
        }

        const statusesToInsert = Array.from(uniqueStatuses);

        if (statusesToInsert.length > 0) {
          // 2 colunas - processar em lotes
          // 65535 / 2 = ~32767 registros por lote
          // Usando 20000 para ter margem de segurança
          const batchSize = 20000;

          for (let i = 0; i < statusesToInsert.length; i += batchSize) {
            const batch = statusesToInsert.slice(i, i + batchSize);
            const statusValuesPlaceholder = batch.map(() => '(?,?)').join(',');
            const flatStatusValues = batch.flatMap(status => [status, accountId]);

            await connection.execute(
              `INSERT INTO account_collaborator_status (name, account_id) VALUES ${statusValuesPlaceholder}`,
              flatStatusValues,
            );
          }

          logger.info(
            { count: statusesToInsert.length },
            'New collaborator statuses inserted',
          );
        }
      }

      // Inserir eventos dos colaboradores em lote
      if (bulkCollaborators.length > 0) {
        // 34 colunas - processar em lotes para evitar exceder o limite de placeholders
        // Limite do MySQL: ~65535 placeholders
        // Com 34 colunas: 65535 / 34 = ~1927 registros por lote
        // Usando 1500 para ter margem de segurança
        const batchSize = 1500;

        for (let i = 0; i < bulkCollaborators.length; i += batchSize) {
          const batch = bulkCollaborators.slice(i, i + batchSize);
          const eventValuesPlaceholder = batch
            .map(
              () =>
                '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            )
            .join(',');
          const flatEventValues = batch.flat();

          await connection.execute(
            `INSERT INTO events_collaborators (
              reference_month, reference_year, company_code, company_cnpj,
              company_issue_date, collaborator_code, collaborator_name,
              collaborator_cpf, collaborator_status, collaborator_admission_date,
              collaborator_link, collaborator_cc, collaborator_department,
              collaborator_hours_per_month, collaborator_position_code,
              collaborator_position_description, collaborator_cbo,
              collaborator_branch, collaborator_salary, collaborator_base_salary,
              event_code, event_description, event_quantity, event_value,
              event_type, total_earnings, total_deductions, total_net_salary,
              base_inss, base_fgts, base_irrf, base_fgts_value, account_id, platform_id
            ) VALUES ${eventValuesPlaceholder}`,
            flatEventValues,
          );

          logger.info(
            {
              userId: user.id,
              batchNumber: Math.floor(i / batchSize) + 1,
              batchSize: batch.length,
              totalBatches: Math.ceil(bulkCollaborators.length / batchSize),
            },
            'Batch of events_collaborators inserted',
          );
        }
      }

      // Commit da transação
      await connection.commit();
      logger.info(
        { userId: user.id, accountId },
        'Transaction committed successfully',
      );

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      logger.info(
        {
          userId: user.id,
          accountId,
          totalEventos,
          totalRubricas,
          duration: `${duration}s`,
        },
        'Payroll data processed successfully',
      );

      return NextResponse.json({
        success: true,
        data: {
          totalEventos,
          totalRubricas,
          duration: `${duration}s`,
        },
      });
    } catch (error) {
      // Rollback da transação em caso de erro
      try {
        await connection.rollback();
        logger.warn(
          { userId: user.id, accountId },
          'Transaction rolled back due to error',
        );
      } catch (rollbackError) {
        logger.error(
          { userId: user.id, accountId, rollbackError },
          'Error during rollback',
        );
      }

      logger.error(
        { userId: user.id, accountId, error },
        'Error processing payroll data',
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process payroll data',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      );
    } finally {
      // Liberar a conexão de volta ao pool
      try {
        connection.release();
        logger.info(
          { userId: user.id, accountId },
          'Database connection released',
        );
      } catch (releaseError) {
        logger.error(
          { userId: user.id, accountId, releaseError },
          'Error releasing connection',
        );
      }
    }
  },
  {
    auth: true,
    schema: ProcessPayrollRequestSchema,
  },
);
