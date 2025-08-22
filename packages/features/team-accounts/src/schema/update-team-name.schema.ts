import { z } from 'zod';

import { TeamNameSchema } from './create-team.schema';

export const TeamNameFormSchema = z.object({
  name: TeamNameSchema,
  cnpj: z.string().min(14).max(18),
  branch: z.preprocess((val) => parseInt(val as string, 10), z.number().int()),
});

export const UpdateTeamNameSchema = TeamNameFormSchema.merge(
  z.object({
    slug: z.string().min(1).max(255),
    path: z.string().min(1).max(255),
  }),
);
