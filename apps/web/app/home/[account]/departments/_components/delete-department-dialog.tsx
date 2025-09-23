'use client';

import { useState, useTransition } from 'react';

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

import { deleteDepartmentAction } from '../_lib/server/server-actions';
import { Tables } from '@kit/supabase/database';

type Department = Tables<'departments'>;

export function DeleteDepartmentDialog({
  children,
  department,
}: {
  children: React.ReactNode;
  department: Department;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await toast.promise(
          deleteDepartmentAction({
            id: department.id,
          }),
          {
            loading: 'Excluindo departamento...',
            success: 'Departamento excluído com sucesso!',
            error: 'Erro ao excluir departamento',
          }
        );

        setOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="departments:deleteDepartment" defaults="Excluir Departamento" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Trans 
              i18nKey="departments:deleteDepartmentDescription" 
              values={{ name: department?.name || 'Departamento' }}
              defaults="Tem certeza que deseja excluir o departamento '{{name}}'? Esta ação não pode ser desfeita."
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            <Trans i18nKey="common:cancel" defaults="Cancelar" />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trans i18nKey="departments:delete" defaults="Excluir" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 