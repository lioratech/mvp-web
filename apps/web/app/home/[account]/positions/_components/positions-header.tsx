import { PageHeader } from '@kit/ui/page-header';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@kit/ui/trans';

import { CreatePositionDialog } from './create-position-dialog';

export function PositionsHeader({
  accountId,
  canManagePositions,
}: {
  accountId: string;
  canManagePositions: boolean;
}) {
  return (
    <PageHeader
      title={<Trans i18nKey="positions:pageTitle" defaults="Cargos" />}
      description={
        <Trans 
          i18nKey="positions:pageDescription" 
          defaults="Gerencie os cargos e funções da sua equipe"
        />
      }
    >
      {canManagePositions && (
        <CreatePositionDialog accountId={accountId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <Trans i18nKey="positions:createPosition" defaults="Criar Cargo" />
          </Button>
        </CreatePositionDialog>
      )}
    </PageHeader>
  );
}

