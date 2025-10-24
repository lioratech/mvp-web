import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { WorkforceCostsPanels } from './_components/workforce-costs-panels';

interface WorkforceCostsPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();

  return {
    title: 'Custos da Folha',
  };
};

function WorkforceCostsPage({ params }: WorkforceCostsPageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Custos da Folha"
        description={
          <AppBreadcrumbs values={{ 'workforce-costs': 'Custos da Folha' }} />
        }
      />

      <PageBody>
        <WorkforceCostsPanels />
      </PageBody>
    </>
  );
}

export default withI18n(WorkforceCostsPage);

