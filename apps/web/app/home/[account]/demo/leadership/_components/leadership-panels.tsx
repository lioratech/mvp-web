'use client';

import dynamic from 'next/dynamic';

import { LoadingOverlay } from '@kit/ui/loading-overlay';

export const LeadershipPanels = dynamic(() => import('./leadership-charts'), {
  ssr: false,
  loading: () => (
    <LoadingOverlay
      fullPage={false}
      className={'flex flex-1 flex-col items-center justify-center'}
    />
  ),
});

