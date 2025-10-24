import { z } from 'zod';

export const DeletePayrollRequestSchema = z.object({
  accountId: z.string().uuid('accountId deve ser um UUID válido'),
  platformId: z.string().uuid('platformId deve ser um UUID válido'),
});

export type DeletePayrollRequest = z.infer<typeof DeletePayrollRequestSchema>;

