'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@kit/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';

import { usePanelsFilters } from '../_contexts/panels-filters-context';

interface Department {
  id: string;
  name: string;
}

export function PanelsGlobalFilters() {
  const { selectedDepartment, setSelectedDepartment, clearFilters } =
    usePanelsFilters();

  const supabase = useSupabase();

  // Buscar TODOS os departamentos (de todas as contas que o usuário tem acesso)
  const { data: departments = [] } = useQuery({
    queryKey: ['all-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return (data as Department[]) || [];
    },
  });

  const selectDepartment = (departmentId: string) => {
    // Se já está selecionado, desseleciona. Senão, seleciona.
    setSelectedDepartment(
      selectedDepartment === departmentId ? null : departmentId,
    );
  };

  const hasActiveFilters = selectedDepartment !== null;

  // Obter o nome do departamento selecionado ou usar "Todos os Departamentos"
  const selectedDepartmentName = selectedDepartment
    ? departments.find((d) => d.id === selectedDepartment)?.name
    : 'Todos os Departamentos';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Filtro de Departamentos (Single Select) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            {selectedDepartmentName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar departamentos..." />
            <CommandList>
              <CommandEmpty>
                <Trans i18nKey="common:noDepartmentsFound" />
              </CommandEmpty>
              <CommandGroup>
                {/* Opção "Todos os Departamentos" */}
                <CommandItem onSelect={() => setSelectedDepartment(null)}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedDepartment === null ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="text-sm font-medium">
                    Todos os Departamentos
                  </span>
                </CommandItem>

                {/* Lista de departamentos */}
                {departments.map((department) => (
                  <CommandItem
                    key={department.id}
                    onSelect={() => selectDepartment(department.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedDepartment === department.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <span className="text-sm">{department.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

