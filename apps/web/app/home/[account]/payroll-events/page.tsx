import { use } from 'react';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { EventsHeader } from './_components/events-header';
import { EventsList } from './_components/events-list';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('payroll-events:pageTitle');

  return {
    title,
  };
};

function EventsPage({ params }: { params: Promise<{ account: string }> }) {
  const account = use(params).account;
  const workspace = use(loadTeamWorkspace(account));

  return (
    <>
      <EventsHeader
        title={<Trans i18nKey={'payroll-events:pageTitle'} />}
        description={<Trans i18nKey={'payroll-events:pageDescription'} />}
        accountId={workspace.account.id}
      />

      <PageBody>
        <EventsList accountId={workspace.account.id} />
      </PageBody>
    </>
  );
}

export default withI18n(EventsPage); 