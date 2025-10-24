import { z } from 'zod';

const PayrollEventSchema = z.object({
  codigo: z.string().optional(),
  descricao: z.string().optional(),
  quantidade: z.number().optional(),
  valor: z.number().optional(),
  tipo: z.enum(['P', 'D']).optional(),
}).optional();

const PayrollEmployeeSchema = z.object({
  codigo: z.string().optional(),
  nome: z.string().optional(),
  cpf: z.string().optional(),
  situacao: z.string().optional(),
  data_admissao: z.string().optional(),
  vinculo: z.string().optional(),
  cc: z.string().optional(),
  depto: z.string().optional(),
  horas_mes: z.number().optional(),
  cargo_codigo: z.string().optional(),
  cargo_descricao: z.string().optional(),
  cbo: z.string().optional(),
  filial: z.string().optional(),
  salario: z.number().optional(),
  salario_base: z.number().optional(),
  eventos: z.array(PayrollEventSchema).optional(),
  totais: z.object({
    proventos: z.number().optional(),
    descontos: z.number().optional(),
    liquido: z.number().optional(),
  }).optional(),
  bases: z.object({
    base_inss: z.number().optional(),
    base_fgts: z.number().optional(),
    base_irrf: z.number().optional(),
    valor_fgts: z.number().optional(),
  }).optional(),
}).optional();

const PayrollCompetenceSchema = z.object({
  competencia: z.string().optional(),
  platform_id: z.string().uuid().optional(),
  funcionarios: z.array(PayrollEmployeeSchema).optional(),
  resumo_rubrica: z
    .array(
      z.object({
        codigo: z.string().optional(),
        descricao: z.string().optional(),
        quantidade: z.number().optional(),
        valor: z.number().optional(),
        tipo: z.string().optional(),
      }).optional(),
    )
    .optional(),
  quadro_competencia: z
    .object({
      inss: z.record(z.number()).optional(),
      fgts_pis_iss: z.record(z.number()).optional(),
      irrf_calculo: z.record(z.number()).optional(),
      irrf_pagamento: z.record(z.number()).optional(),
    })
    .optional(),
}).optional();

const PayrollCompanySchema = z.object({
  cnpj: z.string().optional(),
  codigo: z.string().optional(),
  nome: z.string().optional(),
  competencia: z.string().optional(),
  emissao: z.string().optional(),
}).optional();

const PayrollDataSchema = z.object({
  empresa: PayrollCompanySchema.optional(),
  competencias: z.array(PayrollCompetenceSchema).optional(),
  metadata: z
    .object({
      data_inicio: z.string().optional(),
      data_fim: z.string().optional(),
      tempo_execucao_segundos: z.number().optional(),
    })
    .optional(),
}).optional();

export const ProcessPayrollRequestSchema = z.object({
  accountId: z.string().uuid('accountId deve ser um UUID válido').optional(),
  payrollData: PayrollDataSchema.optional(),
});

export type ProcessPayrollRequest = z.infer<typeof ProcessPayrollRequestSchema>;

