'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function FeedTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';

  const setTab = (newTab: string) => {
    router.push(`/home?tab=${newTab}`);
  };

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setTab('all')}
        className={cn(
          'flex-1 py-4 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 relative',
          tab === 'all' && 'text-primary'
        )}
      >
        All
        {tab === 'all' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full animate-slideIn" />
        )}
      </button>
      <button
        onClick={() => setTab('following')}
        className={cn(
          'flex-1 py-4 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 relative',
          tab === 'following' && 'text-primary'
        )}
      >
        Following
        {tab === 'following' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full animate-slideIn" />
        )}
      </button>
    </div>
  );
}

