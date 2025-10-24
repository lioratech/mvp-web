'use client';

import { useState, useTransition, useEffect } from 'react';

import { Pencil } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Checkbox } from '@kit/ui/checkbox';
import { toast } from '@kit/ui/sonner';

interface EditCollaboratorDialogProps {
  collaborator: {
    id: number;
    collaborator_name: string | null;
    collaborator_cpf: string | null;
    collaborator_status: string | null;
    gender: string | null;
    birth_date: string | null;
    apprentice: number | null;
    pcd: number | null;
    resignation_date: string | null;
    resignation_type: string | null;
    resignation_type_other: string | null;
  };
}

export function EditCollaboratorDialog({
  collaborator,
}: EditCollaboratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [isApprentice, setIsApprentice] = useState(false);
  const [isPCD, setIsPCD] = useState(false);
  const [terminationDate, setTerminationDate] = useState<string>('');
  const [terminationType, setTerminationType] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const { account } = useTeamAccountWorkspace();
  const queryClient = useQueryClient();

  const isDismissed =
    collaborator.collaborator_status?.toLowerCase().includes('demitido') ||
    collaborator.collaborator_status?.toLowerCase().includes('rescindido') ||
    collaborator.collaborator_status?.toLowerCase().includes('desligado');

  // Pré-preencher o formulário quando o dialog abre ou o colaborador muda
  useEffect(() => {
    if (open && collaborator) {
      // Mapear valores do banco para o formulário
      const genderReverseMap: Record<string, string> = {
        M: 'masculino',
        F: 'feminino',
        O: 'outro',
      };

      const resignationTypeReverseMap: Record<string, string> = {
        VOLUNTARY: 'voluntaria',
        INVOLUNTARY: 'involuntaria',
      };

      // Função para formatar data para input (aceita vários formatos)
      const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        
        // Se vier como ISO (2025-10-09T03:00:00.000Z) ou MySQL (YYYY-MM-DD HH:MM:SS)
        // Usar Date para normalizar e pegar apenas YYYY-MM-DD
        try {
          const date = new Date(dateString);
          // Verificar se a data é válida
          if (isNaN(date.getTime())) return '';
          
          // Formatar como YYYY-MM-DD (formato esperado pelo input date)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          
          return `${year}-${month}-${day}`;
        } catch {
          return '';
        }
      };

      setGender(
        collaborator.gender ? genderReverseMap[collaborator.gender] || '' : '',
      );
      setBirthDate(formatDateForInput(collaborator.birth_date));
      setIsApprentice(collaborator.apprentice === 1);
      setIsPCD(collaborator.pcd === 1);
      setTerminationDate(formatDateForInput(collaborator.resignation_date));
      setTerminationType(
        collaborator.resignation_type
          ? resignationTypeReverseMap[collaborator.resignation_type] || ''
          : '',
      );

      // Debug: ver os valores
      console.log('Preenchendo formulário:', {
        gender: collaborator.gender,
        birth_date: collaborator.birth_date,
        resignation_date: collaborator.resignation_date,
        resignation_type: collaborator.resignation_type,
        apprentice: collaborator.apprentice,
        pcd: collaborator.pcd,
      });
    }
  }, [open, collaborator]);

  const handleSave = () => {
    startTransition(async () => {
      try {
        // Mapear valores para o formato da API
        const genderMap: Record<string, string> = {
          masculino: 'M',
          feminino: 'F',
          outro: 'O',
        };

        const resignationTypeMap: Record<string, string> = {
          voluntaria: 'VOLUNTARY',
          involuntaria: 'INVOLUNTARY',
        };

        const payload = {
          collaborator_cpf: collaborator.collaborator_cpf,
          account_id: account.id,
          gender: gender ? genderMap[gender] : null,
          birth_date: birthDate || null,
          apprentice: isApprentice,
          pcd: isPCD,
          resignation_date: terminationDate || null,
          resignation_type: terminationType
            ? resignationTypeMap[terminationType]
            : null,
        };

        const response = await fetch('/api/collaborators', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Erro ao atualizar colaborador');
        }

        toast.success('Colaborador atualizado com sucesso!');
        setOpen(false);

        // Invalidar a query para recarregar os dados
        queryClient.invalidateQueries({ queryKey: ['collaborators', account.id] });
      } catch (error) {
        console.error('Erro ao salvar:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar colaborador',
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
          <DialogDescription>
            Adicione informações adicionais sobre{' '}
            {collaborator.collaborator_name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
         
            {/* Gênero e Data de Nascimento - Mesma Linha */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="gender">Gênero</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="nao-informar">
                      Prefiro não informar
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apprentice"
                  checked={isApprentice}
                  onCheckedChange={(checked) =>
                    setIsApprentice(checked as boolean)
                  }
                />
                <Label
                  htmlFor="apprentice"
                  className="text-sm font-normal cursor-pointer"
                >
                  Aprendiz
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pcd"
                  checked={isPCD}
                  onCheckedChange={(checked) => setIsPCD(checked as boolean)}
                />
                <Label
                  htmlFor="pcd"
                  className="text-sm font-normal cursor-pointer"
                >
                  PCD (Pessoa com Deficiência)
                </Label>
              </div>
            </div>
          </div>

          {/* Campos de Demissão - Aparecem apenas se o status for demitido */}
          {isDismissed && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Informações de Desligamento
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Data de Demissão */}
                <div className="grid gap-2">
                  <Label htmlFor="terminationDate">Data de Demissão</Label>
                  <Input
                    id="terminationDate"
                    type="date"
                    value={terminationDate}
                    onChange={(e) => setTerminationDate(e.target.value)}
                  />
                </div>

                {/* Tipo de Demissão */}
                <div className="grid gap-2">
                  <Label htmlFor="terminationType">Tipo de Demissão</Label>
                  <Select
                    value={terminationType}
                    onValueChange={setTerminationType}
                  >
                    <SelectTrigger id="terminationType">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voluntaria">Voluntária</SelectItem>
                      <SelectItem value="involuntaria">Involuntária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} type="button" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

