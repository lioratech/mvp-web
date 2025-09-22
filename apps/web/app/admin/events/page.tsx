
import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';
import { AdminEventsTable } from './components/admin-events-table'; 
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageHeader, PageBody } from '@kit/ui/page';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { Select } from '@kit/ui/select';
import { Input } from '@kit/ui/input';
import { CreateEventDialog } from './components/create-event-dialog';
import { UploadEventsDialog } from './components/upload-events-dialog';

interface SearchParams {
  description?: string;
  type?: 'provento' | 'desconto' | 'outro' | '';
}

interface EventsPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata = {
  title: `Eventos`,
};

async function EventsPage(props: EventsPageProps) {
  const client = getSupabaseServerClient();
  const searchParams = await props.searchParams;

  return (
    <>
      <PageHeader description={<AppBreadcrumbs />}>
        <div className="flex justify-end space-x-2">
          <CreateEventDialog />
          <UploadEventsDialog />
        </div>
      </PageHeader>

      <PageBody>
        <ServerDataLoader
          table={'main_events'}
          client={client}
          where={(queryBuilder) => {
            if (searchParams.description) {
              queryBuilder.ilike('description', `%${searchParams.description}%`);
            }
            if (searchParams.type) {
              queryBuilder.eq('type', searchParams.type);
            }
            return queryBuilder;
          }}
        >
          {({ data, page, pageSize, pageCount }) => {
            return (
              <AdminEventsTable
                page={page}
                pageSize={pageSize}
                pageCount={pageCount}
                data={data}
                filters={{
                  type: searchParams.type || 'all',
                  description: searchParams.description || '',
                }}
              />
            );
          }}
        </ServerDataLoader>
      </PageBody>
    </>
  );
}

export default AdminGuard(EventsPage);