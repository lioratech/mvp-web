'use server';

import { revalidatePath } from 'next/cache';
import { enhanceAction } from '@kit/next/actions';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { z } from 'zod';

import { CreateEventServerSchema, UpdateEventSchema } from '../schema/event.schema';

export const createEventAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const supabase = getSupabaseServerClient();

    logger.info('Creating event', { userId: user.id, eventName: data.name, accountId: data.accountId });

    // Check if user has permission to create payroll events
    const { data: hasPermission, error: permissionError } = await supabase
      .rpc('has_permission', {
        user_id: user.id,
        account_id: data.accountId,
        permission_name: 'payroll.manage'
      });

    if (permissionError) {
      logger.error('Error checking permission', { permissionError, userId: user.id });
      throw new Error('Failed to check permissions');
    }

    if (!hasPermission) {
      logger.error('User does not have permission to create payroll events', { userId: user.id, accountId: data.accountId });
      throw new Error('Insufficient permissions to create payroll events. Only owners can create payroll events.');
    }

    const { data: event, error } = await supabase
      .from('account_payroll_events')
      .insert({
        account_id: data.accountId,
        name: data.name,
        external_id: data.external_id || null,
        description: data.description || null,
        color: data.color,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating event', { error, userId: user.id, errorMessage: error.message });
      throw new Error(`Failed to create event: ${error.message}`);
    }

    logger.info('Event created successfully', { eventId: event.id, userId: user.id });

    revalidatePath('/home/[account]/payroll-events');

    return {
      success: true,
      data: event,
    };
  },
  {
    auth: true,
    schema: CreateEventServerSchema,
  },
);

export const updateEventAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const supabase = getSupabaseServerClient();

    logger.info('Updating event', { userId: user.id, eventId: data.id });

    const { data: event, error } = await supabase
      .from('account_payroll_events')
      .update({
        name: data.name,
        external_id: data.external_id || null,
        description: data.description || null,
        color: data.color,
        updated_by: user.id,
      })
      .eq('id', data.id)
      .eq('account_id', data.accountId!)
      .select()
      .single();

    if (error) {
      logger.error('Error updating event', { error, userId: user.id });
      throw new Error('Failed to update event');
    }

    logger.info('Event updated successfully', { eventId: event.id, userId: user.id });

    revalidatePath('/home/[account]/payroll-events');

    return {
      success: true,
      data: event,
    };
  },
  {
    auth: true,
    schema: UpdateEventSchema,
  },
);

export const deleteEventAction = enhanceAction(
  async function (data: { id: string; accountId: string }, user) {
    const logger = await getLogger();
    const supabase = getSupabaseServerClient();

    logger.info('Deleting event', { userId: user.id, eventId: data.id });

    const { error } = await supabase
      .from('account_payroll_events')
      .delete()
      .eq('id', data.id)
      .eq('account_id', data.accountId);

    if (error) {
      logger.error('Error deleting event', { error, userId: user.id });
      throw new Error('Failed to delete event');
    }

    logger.info('Event deleted successfully', { eventId: data.id, userId: user.id });

    revalidatePath('/home/[account]/payroll-events');

    return {
      success: true,
    };
  },
  {
    auth: true,
    schema: z.object({
      id: z.string().uuid(),
      accountId: z.string().uuid(),
    }),
  },
); 