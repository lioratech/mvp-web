import { use } from 'react';

import { PageBody } from '@kit/ui/page';
import { PageHeader } from '@kit/ui/page-header';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { CollaboratorStatusList } from './_components/collaborator-status-list';
import { CreateStatusDialog } from './_components/create-status-dialog';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('collaborator-status:pageTitle');

  return {
    title,
  };
};

function CollaboratorStatusPage({ params }: { params: Promise<{ account: string }> }) {
  const account = use(params).account;
  const workspace = use(loadTeamWorkspace(account));

  // Permissão customizada
  const canManageStatus =
    (workspace.account.permissions as string[]).includes('collaborator-status.manage') ||
    workspace.account.role === 'owner';

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="collaborator-status:pageTitle" defaults="Status de Colaboradores" />}
        description={
          <Trans 
            i18nKey="collaborator-status:pageDescription" 
            defaults="Gerencie os status dos colaboradores da sua equipe"
          />
        }
      >
        {canManageStatus && (
          <CreateStatusDialog accountId={workspace.account.id}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <Trans i18nKey="collaborator-status:createStatus" defaults="Novo Status" />
            </Button>
          </CreateStatusDialog>
        )}
      </PageHeader>

      <PageBody>
        <CollaboratorStatusList 
          accountId={workspace.account.id}
          canManageStatus={canManageStatus}
        />
      </PageBody>
    </>
  );
}

export default withI18n(CollaboratorStatusPage);
