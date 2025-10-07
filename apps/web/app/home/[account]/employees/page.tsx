import { use } from 'react';

import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { loadEmployees } from './_lib/server/employees.loader';
import { EmployeesHeader } from './_components/employees-header';
import { EmployeesList } from './_components/employees-list';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = "Colaboradores";

  return {
    title,
  };
};

function EmployeesPage({ params }: { params: Promise<{ account: string }> }) {
  const account = use(params).account;
  const workspace = use(loadTeamWorkspace(account));
  const employeesRaw = use(loadEmployees(workspace.account.id));
  const employees = Array.isArray(employeesRaw) ? employeesRaw : [];

  // Permissão customizada
  const canManageEmployees =
    (workspace.account.permissions as string[]).includes('employees.manage') ||
    workspace.account.role === 'owner';

  return (
    <>
      <EmployeesHeader 
        accountId={workspace.account.id}
        canManageEmployees={canManageEmployees}
      />

      <PageBody>
        <EmployeesList 
          employees={employees}
          accountId={workspace.account.id}
          canManageEmployees={canManageEmployees}
        />
      </PageBody>
    </>
  );
}

export default withI18n(EmployeesPage);
