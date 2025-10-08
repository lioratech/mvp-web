import { z } from 'zod';

export const CreatePositionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  external_id: z.string().optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Formato de cor inválido'),
  parent_id: z.string().uuid().nullable().optional(),
  department_id: z.string().uuid().nullable().optional(),
  is_leadership: z.boolean().default(false),
  is_active: z.boolean().default(true),
  accountId: z.string().uuid().optional(),
});

export const CreatePositionServerSchema = CreatePositionSchema.extend({
  accountId: z.string().uuid(),
});

export const UpdatePositionSchema = CreatePositionSchema.extend({
  id: z.string().uuid(),
});

export type CreatePositionData = z.infer<typeof CreatePositionSchema>;
export type CreatePositionServerData = z.infer<typeof CreatePositionServerSchema>;
export type UpdatePositionData = z.infer<typeof UpdatePositionSchema>;


