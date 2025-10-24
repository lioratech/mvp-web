import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { PanelsFiltersProvider } from '../../_contexts/panels-filters-context';
import { PanelsGlobalFilters } from '../../_components/panels-global-filters';
import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { LaborLiabilitiesPanelContent } from './_components/labor-liabilities-panel-content';

interface LaborLiabilitiesPanelPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('teams:laborLiabilitiesPanel.pageTitle');

  return {
    title,
  };
};

function LaborLiabilitiesPanelPage({
  params,
}: LaborLiabilitiesPanelPageProps) {
  const account = use(params).account;

  return (
    <PanelsFiltersProvider accountId={account}>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'common:routes.laborLiabilitiesPanel'} />}
        description={<AppBreadcrumbs />}
      >
        <PanelsGlobalFilters />
      </TeamAccountLayoutPageHeader>

      <PageBody>
        <LaborLiabilitiesPanelContent />
      </PageBody>
    </PanelsFiltersProvider>
  );
}

export default withI18n(LaborLiabilitiesPanelPage);

