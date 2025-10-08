'use client';

import { useState } from 'react';
import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  type CreatePositionData,
  CreatePositionSchema,
} from '../_lib/schema/position.schema';
import { createPositionAction } from '../_lib/server/server-actions';

interface CreatePositionDialogProps {
  children: React.ReactNode;
}

export function CreatePositionDialog({
  children,
  accountId,
}: CreatePositionDialogProps & { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  const form = useForm<CreatePositionData>({
    resolver: zodResolver(CreatePositionSchema),
    defaultValues: {
      name: '',
      external_id: '',
      description: '',
      color: '#3B82F6',
      hierarchy_level: 0,
      is_active: true,
    },
  });

  const onSubmit = (data: CreatePositionData) => {
    startTransition(async () => {
      try {
        await toast.promise(
          createPositionAction({
            ...data,
            accountId,
          }),
          {
            loading: t('positions:creatingPosition', 'Criando cargo...'),
            success: t('positions:positionCreated', 'Cargo criado com sucesso!'),
            error: t('positions:errorCreatingPosition', 'Erro ao criar cargo'),
          },
        );

        setOpen(false);
        form.reset();
        window.location.reload();
      } catch (error) {
        console.error('Error creating position:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="positions:createPosition" defaults="Criar Cargo" />
          </DialogTitle>
          <DialogDescription>
            <Trans i18nKey="positions:createPositionDescription" defaults="Adicione um novo cargo à sua organização" />
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
                name="hierarchy_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey="positions:hierarchyLevel" defaults="Nível Hierárquico" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                      <Trans i18nKey="positions:color" defaults="Cor" />
                    </FormLabel>
                    <FormControl>
                      <Input type="color" className="h-10 w-16 p-1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                <Trans i18nKey="positions:create" defaults="Criar" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


