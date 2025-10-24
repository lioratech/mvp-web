import { PageHeader } from '@kit/ui/page';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@kit/ui/trans';

import { CreateCollaboratorDialog } from './create-collaborator-dialog';

export function CollaboratorsHeader({
  accountId,
  canManageCollaborators,
}: {
  accountId: string;
  canManageCollaborators: boolean;
}) {
  return (
    <PageHeader
      title={<Trans i18nKey="collaborators:pageTitle2" defaults="Colaboradores" />}
      description={
        <Trans 
          i18nKey="collaborators:pageDescription" 
          defaults="Gerencie os colaboradores da sua empresa"
        />
      }
    >
      {canManageCollaborators && (
        <CreateCollaboratorDialog accountId={accountId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <Trans i18nKey="collaborators:createCollaborator" defaults="Novo Colaborador" />
          </Button>
        </CreateCollaboratorDialog>
      )}
    </PageHeader>
  );
}
