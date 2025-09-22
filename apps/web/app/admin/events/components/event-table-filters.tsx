'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Form, FormControl, FormField, FormItem } from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const FiltersSchema = z.object({
  type: z.enum(['', 'provento', 'desconto', 'outro']),
  description: z.string().optional(),
});

export function EventTableFilters({ filters }) {
  const form = useForm({
    resolver: zodResolver(FiltersSchema),
    defaultValues: filters,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const router = useRouter();
  const pathName = usePathname();

  const onSubmit = (filterData) => {
    const params = new URLSearchParams({
      type: filterData.type !== 'all' ? filterData.type : '',
      description: filterData.description || '',
    });

    const url = `${pathName}?${params.toString()}`;

    router.push(url);
  };

  return (
    <Form {...form}>
      <form className="flex gap-2.5" onSubmit={form.handleSubmit(onSubmit)}>
        <Select
          value={form.watch('type') || 'all'}
          onValueChange={(value) => {
            form.setValue('type', value);
            onSubmit(form.getValues());
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipos de eventos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipo</SelectLabel>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="provento">Provento</SelectItem>
              <SelectItem value="desconto">Desconto</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem className="w-200">
              <FormControl>
                <Input placeholder="Busque por descrição" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
