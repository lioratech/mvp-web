import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { LeadershipPanels } from './_components/leadership-panels';

interface LeadershipPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();

  return {
    title: 'Liderança e Gestão',
  };
};

function LeadershipPage({ params }: LeadershipPageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Liderança e Gestão"
        description={
          <AppBreadcrumbs values={{ leadership: 'Liderança' }} />
        }
      />

      <PageBody>
        <LeadershipPanels />
      </PageBody>
    </>
  );
}

export default withI18n(LeadershipPage);

