'use server';

import { revalidatePath } from 'next/cache';
import { enhanceAction } from '@kit/next/actions';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { z } from 'zod';

import { CreatePositionServerSchema, UpdatePositionSchema } from '../schema/position.schema';

export const createPositionAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const supabase = getSupabaseServerClient();

    logger.info('Creating position', { userId: user.id, positionName: data.name, accountId: data.accountId });

    const { data: hasPermission, error: permissionError } = await supabase
      .rpc('has_permission', {
        user_id: user.id,
        account_id: data.accountId,
        permission_name: 'positions.manage'
      });

    if (permissionError) {
      logger.error('Error checking permission', { permissionError, userId: user.id });
      throw new Error('Failed to check permissions');
    }

    if (!hasPermission) {
      logger.error('User does not have permission to create positions', { userId: user.id, accountId: data.accountId });
      throw new Error('Permissões insuficientes para criar cargos. Apenas proprietários podem criar cargos.');
    }

    const { data: position, error } = await supabase
      .from('positions')
      .insert({
        account_id: data.accountId,
        name: data.name,
        external_id: data.external_id || null,
        description: data.description || null,
        color: data.color,
        parent_id: data.parent_id || null,
        department_id: data.department_id || null,
        is_leadership: data.is_leadership,
        is_active: data.is_active,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating position', { error, userId: user.id, errorMessage: error.message });
      throw new Error(`Falha ao criar cargo: ${error.message}`);
    }

    logger.info('Position created successfully', { positionId: position.id, userId: user.id });

    revalidatePath('/home/[account]/positions');

    return {
      success: true,
      data: position,
    };
  },
  {
    auth: true,
    schema: CreatePositionServerSchema,
  },
);

export const updatePositionAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const supabase = getSupabaseServerClient();

    logger.info('Updating position', { userId: user.id, positionId: data.id });

    const { data: position, error } = await supabase
      .from('positions')
      .update({
        name: data.name,
        external_id: data.external_id || null,
        description: data.description || null,
        color: data.color,
        parent_id: data.parent_id || null,
        department_id: data.department_id || null,
        is_leadership: data.is_leadership,
        is_active: data.is_active,
        updated_by: user.id,
      })
      .eq('id', data.id)
      .eq('account_id', data.accountId!)
      .select()
      .single();

    if (error) {
      logger.error('Error updating position', { error, userId: user.id });
      throw new Error('Falha ao atualizar cargo');
    }

    logger.info('Position updated successfully', { positionId: position.id, userId: user.id });

    revalidatePath('/home/[account]/positions');

    return {
      success: true,
      data: position,
    };
  },
  {
    auth: true,
    schema: UpdatePositionSchema,
  },
);

export const deletePositionAction = enhanceAction(
  async function (data: { id: string; accountId: string }, user) {
    const logger = await getLogger();
    const supabase = getSupabaseServerClient();

    logger.info('Deleting position', { userId: user.id, positionId: data.id });

    const { error } = await supabase
      .from('positions')
      .delete()
      .eq('id', data.id)
      .eq('account_id', data.accountId);

    if (error) {
      logger.error('Error deleting position', { error, userId: user.id });
      throw new Error('Falha ao excluir cargo');
    }

    logger.info('Position deleted successfully', { positionId: data.id, userId: user.id });

    revalidatePath('/home/[account]/positions');

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


