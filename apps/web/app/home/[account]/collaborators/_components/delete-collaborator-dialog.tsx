'use client';

import { useState, useTransition } from 'react';
import { toast } from '@kit/ui/sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import { type Collaborator } from '../_lib/schema/collaborator.schema';
import { deleteCollaboratorAction } from '../_lib/server/server-actions';

export function DeleteCollaboratorDialog({
  children,
  collaborator,
}: {
  children: React.ReactNode;
  collaborator: Collaborator;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await toast.promise(
          deleteCollaboratorAction({ id: collaborator.id }),
          {
            loading: 'Excluindo colaborador...',
            success: 'Colaborador excluído com sucesso!',
            error: 'Erro ao excluir colaborador',
          }
        );
        
        setOpen(false);
      } catch (error) {
        console.error('Error deleting collaborator:', error);
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
            <Trans i18nKey="collaborators:deleteCollaborator" defaults="Excluir Colaborador" />
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <Trans 
              i18nKey="collaborators:deleteConfirmation" 
              defaults="Tem certeza que deseja excluir o colaborador {{name}}? Esta ação não pode ser desfeita."
              values={{ name: collaborator.name }}
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
