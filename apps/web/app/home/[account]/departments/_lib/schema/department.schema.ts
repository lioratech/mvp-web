import { z } from 'zod';

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  external_id: z.string().max(100, 'Identificador externo deve ter no máximo 100 caracteres').optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido').optional(),
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

export type CreateDepartmentData = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentData = z.infer<typeof UpdateDepartmentSchema>; 