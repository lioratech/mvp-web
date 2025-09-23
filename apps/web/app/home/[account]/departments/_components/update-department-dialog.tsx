'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@kit/ui/textarea';
import { Button } from '@kit/ui/button';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { UpdateDepartmentSchema } from '../_lib/schema/department.schema';
import { updateDepartmentAction } from '../_lib/server/server-actions';

type UpdateDepartmentData = z.infer<typeof UpdateDepartmentSchema>;

type Department = {
  id: string;
  name: string;
  external_id?: string | null;
  description?: string | null;
  color?: string | null;
  created_at: string | null;
  updated_at: string | null;
  account_id: string;
  created_by?: string | null;
  updated_by?: string | null;
};

export function UpdateDepartmentDialog({
  children,
  department,
}: {
  children: React.ReactNode;
  department: Department;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('departments');

  const form = useForm<UpdateDepartmentData>({
    resolver: zodResolver(UpdateDepartmentSchema),
    defaultValues: {
      name: department.name,
      external_id: department.external_id || '',
      description: department.description || '',
      color: department.color || '#3B82F6',
    },
  });

  const onSubmit = (data: UpdateDepartmentData) => {
    startTransition(async () => {
      try {
        await toast.promise(
          updateDepartmentAction({
            ...data,
            id: department.id,
          }),
          {
            loading: 'Atualizando departamento...',
            success: 'Departamento atualizado com sucesso!',
            error: 'Erro ao atualizar departamento',
          }
        );

        setOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Error updating department:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="departments:updateDepartment" defaults="Editar Departamento" />
          </DialogTitle>
          <DialogDescription>
            <Trans 
              i18nKey="departments:updateDepartmentDescription" 
              defaults="Atualize as informações do departamento"
            />
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
                    <Trans i18nKey="departments:name" defaults="Nome" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('departments:namePlaceholder', 'Nome do departamento')} {...field} />
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
                    <Trans i18nKey="departments:externalId" defaults="Identificador Externo" />
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('departments:externalIdPlaceholder', 'ID externo (opcional)')} 
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
                    <Trans i18nKey="departments:description" defaults="Descrição" />
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('departments:descriptionPlaceholder', 'Descrição do departamento (opcional)')} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey="departments:color" defaults="Cor" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="color" 
                        {...field} 
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        placeholder="#3B82F6" 
                        {...field} 
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                <Trans i18nKey="common:cancel" defaults="Cancelar" />
              </Button>
              <Button type="submit" disabled={isPending}>
                <Trans i18nKey="departments:update" defaults="Atualizar" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 