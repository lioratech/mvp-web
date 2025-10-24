import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { WorkforcePanels } from './_components/workforce-panels';

interface TeamAccountHomePageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();

  return {
    title: 'Painel de Força de Trabalho',
  };
};

function TeamAccountHomePage({ params }: TeamAccountHomePageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Força de Trabalho"
        description={
          <AppBreadcrumbs values={{ workforce: 'Força Trabalho' }} />
        }
      />

      <PageBody>
        <WorkforcePanels />
      </PageBody>
    </>
  );
}

export default withI18n(TeamAccountHomePage);

