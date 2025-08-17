'use client';

import { useState } from 'react';
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

import { CreateEventSchema, type CreateEventData } from '../_lib/schema/event.schema';
import { createEventAction } from '../_lib/server/server-actions';

interface CreateEventDialogProps {
  children: React.ReactNode;
}

export function CreateEventDialog({ 
  children, 
  accountId 
}: CreateEventDialogProps & { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  const form = useForm<CreateEventData>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: '',
      external_id: '',
      description: '',
      color: '#3B82F6',
    },
  });

  const onSubmit = (data: CreateEventData) => {
    startTransition(async () => {
      try {
        await toast.promise(createEventAction({
          ...data,
          accountId,
        }), {
          loading: t('payroll-events:creatingEvent'),
          success: t('payroll-events:eventCreated'),
          error: t('payroll-events:errorCreatingEvent'),
        });

        setOpen(false);
        form.reset();
        // Refresh the page to show the new event
        window.location.reload();
      } catch (error) {
        console.error('Error creating event:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="payroll-events:createEvent" />
          </DialogTitle>
          <DialogDescription>
            <Trans i18nKey="payroll-events:createEventDescription" />
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
                    <Input
                      type="color"
                      className="w-16 h-10 p-1"
                      {...field}
                    />
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
                <Trans i18nKey="payroll-events:create" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 