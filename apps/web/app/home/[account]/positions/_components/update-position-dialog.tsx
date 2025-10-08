'use client';

import React, { useState } from 'react';
import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Switch } from '@kit/ui/switch';
import { toast } from '@kit/ui/sonner';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

import {
  type UpdatePositionData,
  UpdatePositionSchema,
} from '../_lib/schema/position.schema';
import { updatePositionAction } from '../_lib/server/server-actions';
import { Tables } from '@kit/supabase/database';

type Position = Tables<'positions'>;

interface UpdatePositionDialogProps {
  children: React.ReactNode;
  position: Position;
  accountId: string;
}

export function UpdatePositionDialog({
  children,
  position,
  accountId,
}: UpdatePositionDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  // Buscar positions existentes para o parent_id (excluindo o cargo atual)
  const { data: positions } = useQuery({
    queryKey: ['positions', accountId, position.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('id, name')
        .eq('account_id', accountId)
        .eq('is_active', true)
        .neq('id', position.id) // Não pode ser pai de si mesmo
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Buscar departments para o department_id
  const { data: departments } = useQuery({
    queryKey: ['departments', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('account_id', accountId)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<UpdatePositionData>({
    resolver: zodResolver(UpdatePositionSchema),
    defaultValues: {
      id: position.id,
      name: position.name,
      external_id: position.external_id || '',
      description: position.description || '',
      color: position.color || '#3B82F6',
      parent_id: position.parent_id || null,
      department_id: position.department_id || null,
      is_leadership: position.is_leadership || false,
      is_active: position.is_active,
      accountId,
    },
  });

  // Reset form when position changes
  React.useEffect(() => {
    form.reset({
      id: position.id,
      name: position.name,
      external_id: position.external_id || '',
      description: position.description || '',
      color: position.color || '#3B82F6',
      parent_id: position.parent_id || null,
      department_id: position.department_id || null,
      is_leadership: position.is_leadership || false,
      is_active: position.is_active,
      accountId,
    });
  }, [position, form, accountId]);

  const onSubmit = (data: UpdatePositionData) => {
    startTransition(async () => {
      try {
        await toast.promise(
          updatePositionAction(data),
          {
            loading: t('positions:updatingPosition', 'Atualizando cargo...'),
            success: t('positions:positionUpdated', 'Cargo atualizado com sucesso!'),
            error: t('positions:errorUpdatingPosition', 'Erro ao atualizar cargo'),
          },
        );

        console.log('🔄 Atualizando cache para accountId:', accountId);
        
        // Remover dados do cache e invalidar
        queryClient.removeQueries({ 
          queryKey: ['positions-with-relations', accountId]
        });
        
        // Forçar refetch imediato
        await queryClient.refetchQueries({ 
          queryKey: ['positions-with-relations', accountId],
          type: 'active'
        });
        
        console.log('✅ Cache atualizado, fechando dialog');
        setOpen(false);
      } catch (error) {
        console.error('Error updating position:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="positions:updatePosition" defaults="Editar Cargo" />
          </DialogTitle>
          <DialogDescription>
            <Trans i18nKey="positions:updatePositionDescription" defaults="Atualize as informações do cargo" />
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey="positions:name" defaults="Nome" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('positions:namePlaceholder', 'Nome do cargo')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="external_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey="positions:externalId" defaults="ID Externo" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('positions:externalIdPlaceholder', 'ID externo (opcional)')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey="positions:description" defaults="Descrição" />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('positions:descriptionPlaceholder', 'Descrição do cargo')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey="positions:parentPosition" defaults="Cargo Superior" />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'null' ? null : value)}
                      value={field.value || 'null'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('positions:selectParent', 'Selecione...')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">
                          <Trans i18nKey="common:none" defaults="Nenhum" />
                        </SelectItem>
                        {positions?.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey="positions:department" defaults="Departamento" />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'null' ? null : value)}
                      value={field.value || 'null'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('positions:selectDepartment', 'Selecione...')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">
                          <Trans i18nKey="common:none" defaults="Nenhum" />
                        </SelectItem>
                        {departments?.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey="positions:color" defaults="Cor" />
                  </FormLabel>
                  <FormControl>
                    <Input type="color" className="h-10 w-full p-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_leadership"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Trans i18nKey="positions:isLeadership" defaults="Cargo de Liderança" />
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      <Trans i18nKey="positions:isLeadershipDescription" defaults="Indica se este cargo possui função de liderança" />
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Trans i18nKey="positions:isActive" defaults="Ativo" />
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      <Trans i18nKey="positions:isActiveDescription" defaults="Cargo está ativo e disponível" />
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                <Trans i18nKey="common:cancel" defaults="Cancelar" />
              </Button>
              <Button type="submit" disabled={pending}>
                <Trans i18nKey="positions:update" defaults="Atualizar" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


