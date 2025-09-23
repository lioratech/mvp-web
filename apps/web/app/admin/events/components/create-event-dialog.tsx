'use client';
import { useState, useTransition, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@kit/ui/form';
import { toast } from '@kit/ui/sonner';
import { z } from 'zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Checkbox } from '@kit/ui/checkbox';
import { createEventAction } from '../lib/server-actions';

const CreateEventSchema = z.object({
  id: z.number().positive('ID deve ser um número positivo'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['provento', 'desconto', 'outro']),
  reference_days: z.boolean().optional().default(false),
  reference_hours: z.boolean().optional().default(false),
  reference_value: z.boolean().optional().default(false),
  incidence_inss: z.boolean().optional().default(false),
  incidence_irrf: z.boolean().optional().default(false),
  incidence_fgts: z.boolean().optional().default(false),
});

type CreateEventSchemaType = z.infer<typeof CreateEventSchema>;

export function CreateEventDialog() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<CreateEventSchemaType>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      id: 0, 
      description: '',
      type: 'provento',
    },
    mode: 'onChange',
  });



  const onSubmit = (data: CreateEventSchemaType) => {
    console.log('Data received in onSubmit:', data);
    startTransition(async () => {
      try {
        await createEventAction(data);
        toast.success('Event created successfully');
        form.reset();
        setOpen(false);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar Evento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {error && <div className="text-red-500">{error}</div>}
            <FormField name="id" render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="ID"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo</SelectLabel>
                        <SelectItem value="provento">Provento</SelectItem>
                        <SelectItem value="desconto">Desconto</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="reference_days" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Referência Dias</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="reference_hours" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Referência Horas</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="reference_value" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Referência Valor</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="incidence_inss" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Incidência INSS</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="incidence_irrf" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Incidência IRRF</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="incidence_fgts" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Incidência FGTS</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <Button disabled={pending} type="submit">
              {pending ? 'Criando...' : 'Criar Evento'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
