'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { toast } from '@kit/ui/sonner';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@kit/ui/alert-dialog';
import { Trans } from '@kit/ui/trans';

import { deleteEventAction } from '../_lib/server/server-actions';

interface DeleteEventDialogProps {
  children: React.ReactNode;
  event: {
    id: string;
    name: string;
  };
}

export function DeleteEventDialog({ 
  children, 
  event, 
  accountId 
}: DeleteEventDialogProps & { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await toast.promise(deleteEventAction({ 
          id: event.id,
          accountId,
        }), {
          loading: t('payroll-events:deletingEvent'),
          success: t('payroll-events:eventDeleted'),
          error: t('payroll-events:errorDeletingEvent'),
        });

        setOpen(false);
        // Refresh the page to show the updated list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="payroll-events:deleteEvent" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Trans 
              i18nKey="payroll-events:deleteEventDescription" 
              values={{ name: event.name }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            <Trans i18nKey="common:cancel" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trans i18nKey="payroll-events:delete" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 