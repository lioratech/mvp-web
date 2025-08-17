import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { UploadsHeader } from './_components/uploads-header';
import { UploadsContent } from './_components/uploads-content';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('uploads:page.title');

  return {
    title,
  };
};

function UploadsPage() {
  return (
    <>
      <UploadsHeader
        title={<Trans i18nKey={'uploads:page.title'} />}
        description={<Trans i18nKey={'uploads:page.description'} />}
      />

      <PageBody>
        <UploadsContent />
      </PageBody>
    </>
  );
}

export default withI18n(UploadsPage); 