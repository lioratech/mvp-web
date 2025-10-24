import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { LaborLiabilitiesPanels } from './_components/labor-liabilities-panels';

interface LaborLiabilitiesPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();

  return {
    title: 'Passivos Trabalhistas',
  };
};

function LaborLiabilitiesPage({ params }: LaborLiabilitiesPageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Passivos Trabalhistas"
        description={
          <AppBreadcrumbs values={{ 'labor-liabilities': 'Passivos Trabalhistas' }} />
        }
      />

      <PageBody>
        <LaborLiabilitiesPanels />
      </PageBody>
    </>
  );
}

export default withI18n(LaborLiabilitiesPage);

