import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../_components/team-account-layout-page-header';
import { ForecastsPanels } from './components/forecasts-panels';

interface ForecastsPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();
  
  return {
    title: 'Previsões e Projeções',
  };
};

function ForecastsPage({ params }: ForecastsPageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Forecasts"
        description={
          <AppBreadcrumbs values={{ forecasts: 'Previsões' }} />
        }
      />

      <PageBody>
        <ForecastsPanels />
      </PageBody>
    </>
  );
}

export default withI18n(ForecastsPage);

