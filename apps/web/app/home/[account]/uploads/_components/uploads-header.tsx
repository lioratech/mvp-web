import { PageHeader } from '@kit/ui/page-header';

export function UploadsHeader({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <PageHeader
      title={title}
      description={description}
    />
  );
} 