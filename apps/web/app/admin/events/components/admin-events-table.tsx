'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

import { DataTable } from '@kit/ui/enhanced-data-table';
import { Form, FormControl, FormField, FormItem } from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { EventTableFilters } from './event-table-filters';

export function AdminEventsTable({ data, page, pageSize, pageCount, filters }) {


  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-end gap-2.5">
        <EventTableFilters filters={filters} />
      </div>

      <DataTable
        pageSize={pageSize}
        pageIndex={page - 1}
        pageCount={pageCount}
        data={data}
        columns={getColumns()}
      />
    </div>
  );
}

function getColumns() {
  return [
    { id: 'id', header: 'ID', accessorKey: 'id' },
    { id: 'description', header: 'Descrição', accessorKey: 'description' },
    { id: 'type', header: 'Tipo', accessorKey: 'type' },
  ];
}
