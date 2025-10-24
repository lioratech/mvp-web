'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Trans } from '@kit/ui/trans';
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
import { toast } from '@kit/ui/sonner';
import { Tables } from '@kit/supabase/database';
import { deletePayrollAction } from '../_lib/server/server-actions';

type Payroll = Tables<'payrolls'>;

interface DeletePayrollDialogProps {
  payroll: Payroll;
}

export function DeletePayrollDialog({ payroll }: DeletePayrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isPending, startTransition] = useTransition();

  const formatCompetence = (month: number, year: number) => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  const competenceText = formatCompetence(payroll.month, payroll.year);

  const handleDelete = () => {
    if (confirmText !== competenceText) {
      toast.error('A competência digitada não corresponde');
      return;
    }

    startTransition(async () => {
      try {
        await toast.promise(
          deletePayrollAction(payroll.id, payroll.account_id),
          {
            loading: 'Excluindo folha...',
            success: 'Folha excluída com sucesso!',
            error: 'Erro ao excluir folha',
          },
        );
        setOpen(false);
        setConfirmText('');
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="uploads:deleteDialog.title" defaults="Excluir Folha de Pagamento" />
          </DialogTitle>
          <DialogDescription>
            <Trans 
              i18nKey="uploads:deleteDialog.description" 
              defaults="Esta ação não pode ser desfeita. Para confirmar, digite a competência:" 
            />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-3 select-none">
            <p className="text-sm font-medium text-center select-none">{competenceText}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              <Trans i18nKey="uploads:deleteDialog.confirmLabel" defaults="Digite a competência para confirmar" />
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={competenceText}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setConfirmText('');
            }}
            disabled={isPending}
          >
            <Trans i18nKey="common:cancel" defaults="Cancelar" />
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || confirmText !== competenceText}
          >
            <Trans i18nKey="common:delete" defaults="Excluir" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

