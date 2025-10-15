import { z } from 'zod';

import { TeamNameSchema } from './create-team.schema';

export const TeamNameFormSchema = z.object({
  name: TeamNameSchema,
  cnpj: z.preprocess(
    (val) => {
      // Remove máscara do CNPJ (pontos, barras, hífens)
      if (typeof val === 'string') {
        return val.replace(/[^\d]/g, '');
      }
      return val;
    },
    z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  ),
  branch: z.preprocess((val) => parseInt(val as string, 10), z.number().int()),
});

export const UpdateTeamNameSchema = TeamNameFormSchema.merge(
  z.object({
    slug: z.string().min(1).max(255),
    path: z.string().min(1).max(255),
  }),
);
