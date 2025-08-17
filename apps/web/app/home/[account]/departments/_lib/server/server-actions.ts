'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { enhanceAction } from '@kit/next/actions';
import { getLogger } from '@kit/shared/logger';
import { z } from 'zod';
import { Tables } from '@kit/supabase/database';

import { CreateDepartmentSchema, UpdateDepartmentSchema } from '../schema/department.schema';

export const createDepartmentAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const client = getSupabaseServerClient();

    logger.info('Creating department', { 
      departmentName: data.name,
      externalId: data.external_id,
      userId: user.id 
    });

    const { data: department, error } = await client
      .from<Tables<'departments'>>('departments')
      .insert({
        name: data.name,
        external_id: data.external_id,
        description: data.description,
        color: data.color,
        account_id: data.accountId,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create department', { error });
      throw new Error('Erro ao criar departamento');
    }

    logger.info('Department created successfully', { 
      departmentId: department.id 
    });

    return { success: true, data: department };
  },
  {
    auth: true,
    schema: CreateDepartmentSchema.extend({
      accountId: z.string().uuid(),
    }),
  },
);

export const updateDepartmentAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const client = getSupabaseServerClient();

    logger.info('Updating department', { 
      departmentId: data.id,
      externalId: data.external_id,
      userId: user.id 
    });

    const { data: department, error } = await client
      .from<Tables<'departments'>>('departments')
      .update({
        name: data.name,
        external_id: data.external_id,
        description: data.description,
        color: data.color,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update department', { error });
      throw new Error('Erro ao atualizar departamento');
    }

    logger.info('Department updated successfully', { 
      departmentId: department.id 
    });

    return { success: true, data: department };
  },
  {
    auth: true,
    schema: UpdateDepartmentSchema.extend({
      id: z.string().uuid(),
    }),
  },
);

export const deleteDepartmentAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const client = getSupabaseServerClient();

    logger.info('Deleting department', { 
      departmentId: data.id,
      userId: user.id 
    });

    const { error } = await client
      .from<Tables<'departments'>>('departments')
      .delete()
      .eq('id', data.id);

    if (error) {
      logger.error('Failed to delete department', { error });
      throw new Error('Erro ao excluir departamento');
    }

    logger.info('Department deleted successfully', { 
      departmentId: data.id 
    });

    return { success: true };
  },
  {
    auth: true,
    schema: z.object({
      id: z.string().uuid(),
    }),
  },
); 