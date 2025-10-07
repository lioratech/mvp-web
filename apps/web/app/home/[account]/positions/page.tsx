import { use } from 'react';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { PositionsHeader } from './_components/positions-header';
import { PositionsList } from './_components/positions-list';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('positions:pageTitle');

  return {
    title,
  };
};

function PositionsPage({ params }: { params: Promise<{ account: string }> }) {
  const account = use(params).account;
  const workspace = use(loadTeamWorkspace(account));

  // Permissão customizada
  const canManagePositions =
    (workspace.account.permissions as string[]).includes('positions.manage') ||
    workspace.account.role === 'owner';

  return (
    <>
      <PositionsHeader 
        accountId={workspace.account.id}
        canManagePositions={canManagePositions}
      />

      <PageBody>
        <PositionsList 
          accountId={workspace.account.id}
          canManagePositions={canManagePositions}
        />
      </PageBody>
    </>
  );
}

export default withI18n(PositionsPage);

