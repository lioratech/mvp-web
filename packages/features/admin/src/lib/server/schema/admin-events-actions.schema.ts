import { z } from 'zod';

export const CreateEventSchema = z.object({
  id: z.number(),
  description: z.string().min(1),
  type: z.enum(['provento', 'desconto', 'outro']),
  reference_days: z.boolean(),
  reference_hours: z.boolean(),
  reference_value: z.boolean(),
  incidence_inss: z.boolean(),
  incidence_irrf: z.boolean(),
  incidence_fgts: z.boolean(),
});
