import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { PanelsGlobalFilters } from '../../_components/panels-global-filters';
import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { PanelsFiltersProvider } from '../../_contexts/panels-filters-context';
import { ExecutivePanelContent } from './_components/executive-panel-content';

interface ExecutivePanelPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('teams:executivePanel.pageTitle');

  return {
    title,
  };
};

function ExecutivePanelPage({ params }: ExecutivePanelPageProps) {
  const account = use(params).account;

  return (
    <PanelsFiltersProvider accountId={account}>
      <TeamAccountLayoutPageHeader
        account={account}
        title={<Trans i18nKey={'common:routes.executivePanel'} />}
        description={<AppBreadcrumbs />}
      >
        <PanelsGlobalFilters />
      </TeamAccountLayoutPageHeader>

      <PageBody>
        <ExecutivePanelContent />
      </PageBody>
    </PanelsFiltersProvider>
  );
}

export default withI18n(ExecutivePanelPage);
