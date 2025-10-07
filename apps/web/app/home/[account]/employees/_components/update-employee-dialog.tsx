'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@kit/ui/sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Trans } from '@kit/ui/trans';

import { UpdateEmployeeSchema, type UpdateEmployeeData, type Employee } from '../_lib/schema/employee.schema';
import { updateEmployeeAction } from '../_lib/server/server-actions';

export function UpdateEmployeeDialog({
  children,
  employee,
}: {
  children: React.ReactNode;
  employee: Employee;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateEmployeeData>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department || '',
      phone: employee.phone || '',
      hireDate: employee.hireDate || '',
      birthDate: employee.birthDate || '',
      salary: employee.salary,
      gender: employee.gender,
      status: employee.status,
      avatar: employee.avatar || '',
    },
  });

  // Atualiza o formulário quando o employee muda
  useEffect(() => {
    form.reset({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department || '',
      phone: employee.phone || '',
      hireDate: employee.hireDate || '',
      birthDate: employee.birthDate || '',
      salary: employee.salary,
      gender: employee.gender,
      status: employee.status,
      avatar: employee.avatar || '',
    });
  }, [employee, form]);

  const onSubmit = (data: UpdateEmployeeData) => {
    startTransition(async () => {
      try {
        await toast.promise(
          updateEmployeeAction({ ...data, id: employee.id }),
          {
            loading: 'Atualizando funcionário...',
            success: 'Funcionário atualizado com sucesso!',
            error: 'Erro ao atualizar funcionário',
          }
        );
        
        setOpen(false);
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="employees:updateEmployee" defaults="Editar Funcionário" />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                <Trans i18nKey="employees:name" defaults="Nome" />
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Nome completo"
                disabled={isPending}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Trans i18nKey="employees:email" defaults="Email" />
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="email@empresa.com"
                disabled={isPending}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">
                <Trans i18nKey="employees:position" defaults="Cargo" />
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="position"
                {...form.register('position')}
                placeholder="Cargo do funcionário"
                disabled={isPending}
              />
              {form.formState.errors.position && (
                <p className="text-sm text-red-500">{form.formState.errors.position.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                <Trans i18nKey="employees:department" defaults="Departamento" />
              </Label>
              <Select
                value={form.watch('department') || ''}
                onValueChange={(value) => form.setValue('department', value)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Trans i18nKey="employees:phone" defaults="Telefone" />
              </Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="(11) 99999-9999"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">
                <Trans i18nKey="employees:hireDate" defaults="Data de Admissão" />
              </Label>
              <Input
                id="hireDate"
                type="date"
                {...form.register('hireDate')}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="birthDate">
                <Trans i18nKey="employees:birthDate" defaults="Data de Nascimento" />
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...form.register('birthDate')}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                <Trans i18nKey="employees:gender" defaults="Gênero" />
              </Label>
              <Select
                value={form.watch('gender') || ''}
                onValueChange={(value) => form.setValue('gender', value as 'male' | 'female' | 'other' | 'prefer_not_to_say')}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefere não informar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary">
                <Trans i18nKey="employees:salary2" defaults="Salário" />
              </Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                {...form.register('salary', { valueAsNumber: true })}
                placeholder="0.00"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                <Trans i18nKey="employees:status2" defaults="Status" />
              </Label>
              <Select
                value={form.watch('status') || 'active'}
                onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive' | 'on_leave')}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="on_leave">Afastado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">
              <Trans i18nKey="employees:avatar" defaults="URL do Avatar" />
            </Label>
            <Input
              id="avatar"
              {...form.register('avatar')}
              placeholder="https://exemplo.com/avatar.jpg"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              <Trans i18nKey="common:cancel" defaults="Cancelar" />
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Trans i18nKey="common:updating" defaults="Atualizando..." />
              ) : (
                <Trans i18nKey="common:update" defaults="Atualizar" />
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
