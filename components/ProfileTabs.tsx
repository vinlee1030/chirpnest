'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProfileTabsProps {
  userID: string;
  showLikes: boolean;
}

export default function ProfileTabs({ userID, showLikes }: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'posts';

  const setTab = (newTab: string) => {
    router.push(`/profile/${userID}?tab=${newTab}`);
  };

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setTab('posts')}
        className={cn(
          'flex-1 py-4 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 relative',
          tab === 'posts' && 'text-primary'
        )}
      >
        Posts
        {tab === 'posts' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full animate-slideIn" />
        )}
      </button>
      
      {showLikes && (
        <button
          onClick={() => setTab('likes')}
          className={cn(
            'flex-1 py-4 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 relative',
            tab === 'likes' && 'text-primary'
          )}
        >
          Likes
          {tab === 'likes' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full animate-slideIn" />
          )}
        </button>
      )}
    </div>
  );
}

