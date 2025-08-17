import { use } from 'react';
import { Tables } from '@kit/supabase/database';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { loadDepartments } from './_lib/server/departments.loader';
import { DepartmentsHeader } from './_components/departments-header';
import { DepartmentsList } from './_components/departments-list';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('departments:pageTitle');

  return {
    title,
  };
};

function DepartmentsPage({ params }: { params: Promise<{ account: string }> }) {
  const account = use(params).account;
  const workspace = use(loadTeamWorkspace(account));
  const departmentsRaw = use(loadDepartments(workspace.account.id));
  const departments = Array.isArray(departmentsRaw) ? departmentsRaw : [];

  // Permissão customizada
  const canManageDepartments =
    (workspace.account.permissions as string[]).includes('departments.manage') ||
    workspace.account.role === 'owner';

  return (
    <>
      <DepartmentsHeader 
        accountId={workspace.account.id}
        canManageDepartments={canManageDepartments}
      />

      <PageBody>
        <DepartmentsList 
          departments={departments}
          accountId={workspace.account.id}
          canManageDepartments={canManageDepartments}
        />
      </PageBody>
    </>
  );
}

export default withI18n(DepartmentsPage); 