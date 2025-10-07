'use client';

import { useState, useTransition } from 'react';
import { toast } from '@kit/ui/sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import { type Employee } from '../_lib/schema/employee.schema';
import { deleteEmployeeAction } from '../_lib/server/server-actions';

export function DeleteEmployeeDialog({
  children,
  employee,
}: {
  children: React.ReactNode;
  employee: Employee;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await toast.promise(
          deleteEmployeeAction({ id: employee.id }),
          {
            loading: 'Excluindo funcionário...',
            success: 'Funcionário excluído com sucesso!',
            error: 'Erro ao excluir funcionário',
          }
        );
        
        setOpen(false);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="employees:deleteEmployee" defaults="Excluir Funcionário" />
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <Trans 
              i18nKey="employees:deleteConfirmation" 
              defaults="Tem certeza que deseja excluir o funcionário {{name}}? Esta ação não pode ser desfeita."
              values={{ name: employee.name }}
            />
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            <Trans i18nKey="common:cancel" defaults="Cancelar" />
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Trans i18nKey="common:deleting" defaults="Excluindo..." />
            ) : (
              <Trans i18nKey="common:delete" defaults="Excluir" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
