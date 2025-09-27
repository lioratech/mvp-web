import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { WorkforceCostsFilters } from '../_components/workforce-costs-filters';
import { WorkforceCostsPanels } from '../_components/workforce-costs-panels';

interface TeamAccountHomePageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('teams:home.pageTitle');

  return {
    title: 'Painel de custos da força de trabalho',
  };
};

function TeamAccountHomePage({ params }: TeamAccountHomePageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Turnover"
        description={
          <AppBreadcrumbs
            values={{ 'panel-workforce-costs': 'Custos folha' }}
          />
        }
      >
        <WorkforceCostsFilters />
      </TeamAccountLayoutPageHeader>

      <PageBody>
        <WorkforceCostsPanels />
      </PageBody>
    </>
  );
}

export default withI18n(TeamAccountHomePage);
