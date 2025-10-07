import { PageHeader } from '@kit/ui/page';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@kit/ui/trans';

import { CreateEmployeeDialog } from './create-employee-dialog';

export function EmployeesHeader({
  accountId,
  canManageEmployees,
}: {
  accountId: string;
  canManageEmployees: boolean;
}) {
  return (
    <PageHeader
      title={<Trans i18nKey="employees:pageTitle2" defaults="Colaboradores" />}
      description={
        <Trans 
          i18nKey="employees:pageDescription" 
          defaults="Gerencie os funcionários da sua empresa"
        />
      }
    >
      {canManageEmployees && (
        <CreateEmployeeDialog accountId={accountId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <Trans i18nKey="employees:createEmployee" defaults="Novo Funcionário" />
          </Button>
        </CreateEmployeeDialog>
      )}
    </PageHeader>
  );
}
