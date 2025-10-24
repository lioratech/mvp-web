'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

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
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

type CollaboratorStatus = {
  id: string;
  platform_id: string | null;
  account_id: string;
  name: string;
  type: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

interface DeleteStatusDialogProps {
  status: CollaboratorStatus;
  accountId: string;
  children: React.ReactNode;
}

export function DeleteStatusDialog({ status, accountId, children }: DeleteStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/collaborator-status/${status.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ account_id: accountId }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to delete status');
        }

        toast.success('Status excluído com sucesso!');
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error('Erro ao excluir status');
        console.error('Error deleting status:', error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="collaborator-status:deleteStatus" defaults="Excluir Status" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Trans 
              i18nKey="collaborator-status:deleteStatusDescription" 
              defaults="Tem certeza que deseja excluir o status"
              values={{ name: status.name }}
            />
            <strong> &quot;{status.name}&quot;</strong>?
            <br />
            <Trans 
              i18nKey="collaborator-status:deleteStatusWarning" 
              defaults="Esta ação não pode ser desfeita."
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Trans i18nKey="common:cancel" defaults="Cancelar" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <Trans i18nKey="common:deleting" defaults="Excluindo..." />
            ) : (
              <Trans i18nKey="common:delete" defaults="Excluir" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
