'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@kit/ui/utils';
import { Button } from '@kit/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@kit/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@kit/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Badge } from '@kit/ui/badge';

export function MainEventSelector({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const supabase = useSupabase();

  const { data: mainEvents } = useQuery({
    queryKey: ['mainEvents'],
    queryFn: async () => {
      const { data, error } = await supabase.from('main_events').select('id, description, type');
      if (error) {
        console.error('Error fetching main events:', error);
        throw new Error(error.message);
      }
      return data;
    },
  });

  const filteredEvents = mainEvents?.filter(event =>
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <>
              <Badge
                variant={
                  mainEvents?.find((event) => event.id === value)?.type === 'provento'
                    ? 'success'
                    : mainEvents?.find((event) => event.id === value)?.type === 'desconto'
                    ? 'destructive'
                    : 'outline'
                }
                className="mr-2 text-xs"
              >
                {mainEvents?.find((event) => event.id === value)?.type}
              </Badge>
              ({value}) {mainEvents?.find((event) => event.id === value)?.description}
            </>
          ) : (
            'Selecione um evento principal'
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar evento..."
            onValueChange={(value) => {
              setSearchTerm(value.toLowerCase());
              console.log('Search Term:', value);
            }}
          />
          <CommandList>
            <CommandEmpty>Nenhum evento encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredEvents?.map((event) => (
                <CommandItem
                  key={event.id}
                  value={String(event.id)}
                  onSelect={(currentValue) => {
                    onChange(Number(currentValue));
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === event.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <Badge
                    variant={
                      event.type === 'provento'
                        ? 'success'
                        : event.type === 'desconto'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="mr-2 text-xs"
                  >
                    {event.type}
                  </Badge>
                  ({event.id}) {event.description.toLowerCase().charAt(0).toUpperCase() + event.description.toLowerCase().slice(1)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
