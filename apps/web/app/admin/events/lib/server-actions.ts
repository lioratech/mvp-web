'use server';

import { z } from 'zod';

import { enhanceAction } from '@kit/next/actions';
import { getLogger } from '@kit/shared/logger';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { UploadEventSchema } from './schema/event.schema';

const CreateEventSchema = z.object({
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





export const createEventAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const client = getSupabaseServerAdminClient();

    logger.info('Creating event', data);

    const { data: event, error } = await client
      .from('main_events')
      .insert({
        id: data.id,
        description: data.description,
        type: data.type,
        reference_days: data.reference_days,
        reference_hours: data.reference_hours,
        reference_value: data.reference_value,
        incidence_inss: data.incidence_inss,
        incidence_irrf: data.incidence_irrf,
        incidence_fgts: data.incidence_fgts,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error inserting event', { error: error.message });
      throw new Error('Error creating event');
    }

    logger.info('Event created successfully', { eventId: event.id });

    return { success: true, data: event };
  },
  {
    auth: true,
    schema: CreateEventSchema,
  },
);

export const updateEventAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const client = getSupabaseServerAdminClient();

    logger.info('Updating event', data);

    const { data: event, error } = await client
      .from('main_events')
      .update({
        description: data.description,
        type: data.type,
        reference_days: data.reference_days,
        reference_hours: data.reference_hours,
        reference_value: data.reference_value,
        incidence_inss: data.incidence_inss,
        incidence_irrf: data.incidence_irrf,
        incidence_fgts: data.incidence_fgts,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating event', { error: error.message });
      throw new Error('Error updating event');
    }

    logger.info('Event updated successfully', { eventId: event.id });

    return { success: true, data: event };
  },
  {
    auth: true,
    schema: CreateEventSchema,
  },
);

export const uploadEventsAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const client = getSupabaseServerAdminClient();

    logger.info('Uploading events', data);

    const { error } = await client.from('main_events').insert(data);

    if (error) {
      logger.error('Error uploading events', { error: error.message });
      throw new Error('Error uploading events');
    }

    logger.info('Events uploaded successfully');

    return { success: true };
  },
  {
    auth: true,
    schema: z.array(UploadEventSchema),
  },
);
