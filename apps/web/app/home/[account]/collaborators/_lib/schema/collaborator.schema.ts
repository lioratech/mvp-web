import { z } from 'zod';

export const CollaboratorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  department: z.string().optional(),
  phone: z.string().optional(),
  hireDate: z.string().optional(),
  birthDate: z.string().optional(),
  salary: z.number().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
  avatar: z.string().optional(),
});

export type Collaborator = z.infer<typeof CollaboratorSchema>;

export const CreateCollaboratorSchema = CollaboratorSchema.omit({ id: true });
export const UpdateCollaboratorSchema = CollaboratorSchema.partial().omit({ id: true });
