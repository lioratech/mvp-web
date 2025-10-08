'use client';

import { useState } from 'react';
import { useTransition } from 'react';

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
import { Button } from '@kit/ui/button';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { deletePositionAction } from '../_lib/server/server-actions';
import { Tables } from '@kit/supabase/database';

type Position = Tables<'positions'>;

interface DeletePositionDialogProps {
  children: React.ReactNode;
  position: Position;
  accountId: string;
}

export function DeletePositionDialog({
  children,
  position,
  accountId,
}: DeletePositionDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await toast.promise(
          deletePositionAction({ id: position.id, accountId }),
          {
            loading: t('positions:deletingPosition', 'Excluindo cargo...'),
            success: t('positions:positionDeleted', 'Cargo excluído com sucesso!'),
            error: t('positions:errorDeletingPosition', 'Erro ao excluir cargo'),
          },
        );

        setOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting position:', error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="positions:deletePosition" defaults="Excluir Cargo" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Trans 
              i18nKey="positions:deletePositionDescription" 
              defaults="Tem certeza que deseja excluir o cargo {name}? Esta ação não pode ser desfeita."
              values={{ name: position.name }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            <Trans i18nKey="common:cancel" defaults="Cancelar" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trans i18nKey="positions:delete" defaults="Excluir" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


