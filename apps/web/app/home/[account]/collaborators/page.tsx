import { use } from 'react';

import { PageBody } from '@kit/ui/page';

import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { CollaboratorsHeader } from './_components/collaborators-header';
import { CollaboratorsList } from './_components/collaborators-list';

export const generateMetadata = async () => {
  const title = "Colaboradores";

  return {
    title,
  };
};

function CollaboratorsPage({ params }: { params: Promise<{ account: string }> }) {
  const account = use(params).account;
  const workspace = use(loadTeamWorkspace(account));

  // Permissão customizada
  const canManageCollaborators =
    (workspace.account.permissions as string[]).includes('collaborators.manage') ||
    workspace.account.role === 'owner';

  return (
    <>
      <CollaboratorsHeader 
        accountId={workspace.account.id}
        canManageCollaborators={canManageCollaborators}
      />

      <PageBody>
        <CollaboratorsList />
      </PageBody>
    </>
  );
}

export default withI18n(CollaboratorsPage);
