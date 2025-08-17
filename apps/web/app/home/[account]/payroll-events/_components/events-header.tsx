import { PageHeader } from '@kit/ui/page-header';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@kit/ui/trans';

import { CreateEventDialog } from './create-event-dialog';

export function EventsHeader({
  title,
  description,
  accountId,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  accountId: string;
}) {
  return (
    <PageHeader
      title={title}
      description={description}
    >
      <CreateEventDialog accountId={accountId}>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <Trans i18nKey="payroll-events:createEvent" />
        </Button>
      </CreateEventDialog>
    </PageHeader>
  );
} 