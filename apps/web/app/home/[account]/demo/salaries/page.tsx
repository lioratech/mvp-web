import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { SalariesPanels } from './_components/salaries-panels';

interface SalariesPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();

  return {
    title: 'Remuneração',
  };
};

function SalariesPage({ params }: SalariesPageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Remuneração"
        description={
          <AppBreadcrumbs values={{ salaries: 'Remuneração' }} />
        }
      />

      <PageBody>
        <SalariesPanels />
      </PageBody>
    </>
  );
}

export default withI18n(SalariesPage);

