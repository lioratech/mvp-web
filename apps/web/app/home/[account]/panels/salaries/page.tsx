import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { PanelsFiltersProvider } from '../../_contexts/panels-filters-context';
import { PanelsGlobalFilters } from '../../_components/panels-global-filters';
import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { SalariesPanelContent } from './_components/salaries-panel-content';

interface SalariesPanelPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('teams:salariesPanel.pageTitle');

  return {
    title,
  };
};

function SalariesPanelPage({ params }: SalariesPanelPageProps) {
  const account = use(params).account;

  return (
    <PanelsFiltersProvider accountId={account}>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'common:routes.salariesPanel'} />}
        description={<AppBreadcrumbs />}
      >
        <PanelsGlobalFilters />
      </TeamAccountLayoutPageHeader>

      <PageBody>
        <SalariesPanelContent />
      </PageBody>
    </PanelsFiltersProvider>
  );
}

export default withI18n(SalariesPanelPage);

