'use client';

import dynamic from 'next/dynamic';

import { LoadingOverlay } from '@kit/ui/loading-overlay';

export const ExecutivePanels = dynamic(() => import('./excecutive-charts'), {
  ssr: false,
  loading: () => (
    <LoadingOverlay
      fullPage={false}
      className={'flex flex-1 flex-col items-center justify-center'}
    />
  ),
});
