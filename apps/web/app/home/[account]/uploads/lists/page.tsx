import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { PageHeader } from '@kit/ui/page-header';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';
import { loadPayrolls } from './_lib/server/load-payrolls';
import { PayrollsList } from './_components/payrolls-list';

interface PageProps {
  params: Promise<{
    account: string;
  }>;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('uploads:lists.title', 'Folhas de Pagamento');

  return {
    title,
  };
};

async function PayrollsListPage({ params }: PageProps) {
  const { account } = await params;
  
  // Buscar o account_id a partir do slug
  const client = getSupabaseServerClient();
  
  const { data: accountData } = await client
    .from('accounts')
    .select('id')
    .eq('slug', account)
    .single();

  if (!accountData) {
    throw new Error('Account not found');
  }

  const payrolls = await loadPayrolls(accountData.id);

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="uploads:lists.title" defaults="Folhas de Pagamento" />}
        description={<Trans i18nKey="uploads:lists.description" defaults="Visualize todas as folhas de pagamento enviadas" />}
      />

      <PageBody>
        <PayrollsList payrolls={payrolls} />
      </PageBody>
    </>
  );
}

export default withI18n(PayrollsListPage);

