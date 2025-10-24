import { use } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TeamAccountLayoutPageHeader } from '../../_components/team-account-layout-page-header';
import { TurnoverPanels } from './_components/turnover-panels';

interface TurnoverPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  await createI18nServerInstance();

  return {
    title: 'Rotatividade e Estabilidade',
  };
};

function TurnoverPage({ params }: TurnoverPageProps) {
  const account = use(params).account;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account}
        title="Rotatividade e Estabilidade"
        description={
          <AppBreadcrumbs values={{ turnover: 'Rotatividade' }} />
        }
      />

      <PageBody>
        <TurnoverPanels />
      </PageBody>
    </>
  );
}

export default withI18n(TurnoverPage);

