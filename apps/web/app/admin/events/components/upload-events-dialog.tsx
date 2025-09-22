'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Input } from '@kit/ui/input';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { UploadEventSchema } from '../lib/schema/event.schema';
import { uploadEventsAction } from '../lib/server-actions';

export function UploadEventsDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [eventsData, setEventsData] = useState([]);
  const form = useForm({
    resolver: zodResolver(z.array(UploadEventSchema)),
  });

  const onSubmit = (data) => {
    console.log('Dados estruturados para upload:', JSON.stringify(eventsData, null, 2));
    startTransition(async () => {
      try {
        await toast.promise(uploadEventsAction(data), {
          loading: 'Uploading events...',
          success: 'Events uploaded successfully!',
          error: 'Failed to upload events.',
        });
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error('Error uploading events:', error);
      }
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split('\n').slice(1);
    const events = rows.map((row) => {
      const [
        id,
        description,
        type,
        reference_days,
        reference_hours,
        reference_value,
        incidence_inss,
        incidence_irrf,
        incidence_fgts,
      ] = row.split(',');
      return {
        id: Number(id),
        description,
        type: type.toLowerCase(),
        reference_days: reference_days === 'S',
        reference_hours: reference_hours === 'S',
        reference_value: reference_value === 'S',
        incidence_inss: incidence_inss === 'S',
        incidence_irrf: incidence_irrf === 'S',
        incidence_fgts: incidence_fgts === 'S',
      };
    });

    setEventsData(events);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Events</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="admin-events:uploadEvents" defaults="Upload Events" />
          </DialogTitle>
        </DialogHeader>
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={() => onSubmit(eventsData)} disabled={pending} className="mt-4">
          <Trans i18nKey="admin-events:upload" defaults="Upload" />
        </Button>
      </DialogContent>

    
    </Dialog>
  );
}
