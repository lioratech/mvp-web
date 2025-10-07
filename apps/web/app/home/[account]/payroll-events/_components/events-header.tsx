import { PageHeader } from '@kit/ui/page-header';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@kit/ui/trans';

import { CreateEventDialog } from './create-event-dialog';

export function EventsHeader({
  accountId,
  canManageEvents,
}: {
  accountId: string;
  canManageEvents: boolean;
}) {
  return (
    <PageHeader
      title={<Trans i18nKey="payroll-events:pageTitle" defaults="Eventos de Folha" />}
      description={
        <Trans 
          i18nKey="payroll-events:pageDescription" 
          defaults="Gerencie os eventos de folha de pagamento da sua equipe"
        />
      }
    >
      {canManageEvents && (
        <CreateEventDialog accountId={accountId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <Trans i18nKey="payroll-events:createEvent" defaults="Criar Evento" />
          </Button>
        </CreateEventDialog>
      )}
    </PageHeader>
  );
} 