'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
import { Switch } from '@kit/ui/switch';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

interface CreateStatusDialogProps {
  accountId: string;
  children: React.ReactNode;
}

export function CreateStatusDialog({ accountId, children }: CreateStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
    };

    startTransition(async () => {
      try {
        const response = await fetch('/api/collaborator-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, account_id: accountId }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to create status');
        }

        toast.success('Status criado com sucesso!');
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error('Erro ao criar status');
        console.error('Error creating status:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              <Trans i18nKey="collaborator-status:createStatus" defaults="Criar Status" />
            </DialogTitle>
            <DialogDescription>
              <Trans 
                i18nKey="collaborator-status:createStatusDescription" 
                defaults="Crie um novo status para colaboradores"
              />
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                <Trans i18nKey="collaborator-status:name" defaults="Nome" />
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="col-span-3"
                placeholder="Nome do status"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                <Trans i18nKey="collaborator-status:type" defaults="Tipo" />
              </Label>
              <Input
                id="type"
                name="type"
                className="col-span-3"
                placeholder="Tipo do status"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                <Trans i18nKey="collaborator-status:status" defaults="Status" />
              </Label>
              <Input
                id="status"
                name="status"
                className="col-span-3"
                placeholder="Status"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                <Trans i18nKey="collaborator-status:notes" defaults="Observações" />
              </Label>
              <Textarea
                id="notes"
                name="notes"
                className="col-span-3"
                placeholder="Observações do status"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <Trans i18nKey="common:cancel" defaults="Cancelar" />
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Trans i18nKey="common:creating" defaults="Criando..." />
              ) : (
                <Trans i18nKey="common:create" defaults="Criar" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
