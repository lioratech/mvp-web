'use client';

import { useState, useEffect } from 'react';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@kit/ui/sonner';
import { useTranslation } from 'react-i18next';

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
import { Textarea } from '@kit/ui/textarea';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import { UpdateEventSchema, type UpdateEventData } from '../_lib/schema/event.schema';
import { updateEventAction } from '../_lib/server/server-actions';

interface UpdateEventDialogProps {
  children: React.ReactNode;
  event: {
    id: string;
    name: string;
    external_id?: string | null;
    description?: string | null;
    color: string | null;
  };
}

export function UpdateEventDialog({ 
  children, 
  event, 
  accountId 
}: UpdateEventDialogProps & { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  const form = useForm<UpdateEventData>({
    resolver: zodResolver(UpdateEventSchema),
    defaultValues: {
      id: event.id,
      name: event.name,
      external_id: event.external_id || '',
      description: event.description || '',
      color: event.color || '#3B82F6',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: event.id,
        name: event.name,
        external_id: event.external_id || '',
        description: event.description || '',
        color: event.color || '#3B82F6',
      });
    }
  }, [open, event, form]);

  const onSubmit = (data: UpdateEventData) => {
    startTransition(async () => {
      try {
        await toast.promise(updateEventAction({
          ...data,
          accountId,
        }), {
          loading: t('payroll-events:updatingEvent'),
          success: t('payroll-events:eventUpdated'),
          error: t('payroll-events:errorUpdatingEvent'),
        });

        setOpen(false);
        // Refresh the page to show the updated event
        window.location.reload();
      } catch (error) {
        console.error('Error updating event:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="payroll-events:updateEvent" />
          </DialogTitle>
          <DialogDescription>
            <Trans i18nKey="payroll-events:updateEventDescription" />
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
                    <Trans i18nKey="payroll-events:name" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('payroll-events:namePlaceholder')}
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
                    <Trans i18nKey="payroll-events:externalId" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('payroll-events:externalIdPlaceholder')}
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
                    <Trans i18nKey="payroll-events:description" />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('payroll-events:descriptionPlaceholder')}
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
                    <Trans i18nKey="payroll-events:color" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        className="w-16 h-10 p-1"
                        {...field}
                      />
                      <Input
                        placeholder="#3B82F6"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
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
                <Trans i18nKey="common:cancel" />
              </Button>
              <Button type="submit" disabled={pending}>
                <Trans i18nKey="payroll-events:update" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 