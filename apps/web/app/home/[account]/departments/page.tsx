import { use } from 'react';

import { Tables } from '@kit/supabase/database';
import { PageBody } from '@kit/ui/page';
import { PageHeader } from '@kit/ui/page-header';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { loadTeamWorkspace } from '../_lib/server/team-account-workspace.loader';
import { loadDepartments } from './_lib/server/departments.loader';
import { DepartmentsList } from './_components/departments-list';
import { CreateDepartmentDialog } from './_components/create-department-dialog';

type Department = Tables<'departments'>;

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
  const departments = use(loadDepartments(workspace.account.id));

  // Permissão customizada
  const canManageDepartments =
    (workspace.account.permissions as string[]).includes('departments.manage') ||
    workspace.account.role === 'owner';

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="departments:pageTitle" defaults="Departamentos" />}
        description={
          <Trans 
            i18nKey="departments:pageDescription" 
            defaults="Gerencie os departamentos da sua equipe"
          />
        }
      >
        {canManageDepartments && (
          <CreateDepartmentDialog accountId={workspace.account.id}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <Trans i18nKey="departments:createDepartment" defaults="Novo Departamento" />
            </Button>
          </CreateDepartmentDialog>
        )}
      </PageHeader>

      <PageBody>
        <DepartmentsList 
          departments={departments as Department[]}
          accountId={workspace.account.id}
          canManageDepartments={canManageDepartments}
        />
      </PageBody>
    </>
  );
}

export default withI18n(DepartmentsPage); 