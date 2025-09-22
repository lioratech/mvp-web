import { z } from 'zod';

export const CreateEventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  external_id: z.string().optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  accountId: z.string().uuid().optional(),
  main_event_id: z.number().int().positive(),
});

export const CreateEventServerSchema = CreateEventSchema.extend({
  accountId: z.string().uuid(),
});

export const UpdateEventSchema = CreateEventSchema.extend({
  id: z.string().uuid(),
});

export type CreateEventData = z.infer<typeof CreateEventSchema>;
export type CreateEventServerData = z.infer<typeof CreateEventServerSchema>;
export type UpdateEventData = z.infer<typeof UpdateEventSchema>; 