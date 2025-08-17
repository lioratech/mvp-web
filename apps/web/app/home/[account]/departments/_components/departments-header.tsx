import { PageHeader } from '@kit/ui/page';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { Trans } from '@kit/ui/trans';

import { CreateDepartmentDialog } from './create-department-dialog';

export function DepartmentsHeader({
  accountId,
  canManageDepartments,
}: {
  accountId: string;
  canManageDepartments: boolean;
}) {
  return (
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
        <CreateDepartmentDialog accountId={accountId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <Trans i18nKey="departments:createDepartment" defaults="Novo Departamento" />
          </Button>
        </CreateDepartmentDialog>
      )}
    </PageHeader>
  );
} 