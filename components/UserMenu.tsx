'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Avatar from './Avatar';

export default function UserMenu() {
  const { data: session } = useSession();
  const [showLogout, setShowLogout] = useState(false);

  if (!session?.user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowLogout(!showLogout)}
        className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
      >
        <Avatar src={session.user.avatarUrl} alt={session.user.name} size="md" />
        <div className="flex-1 text-left overflow-hidden">
          <div className="font-bold truncate">{session.user.displayName || session.user.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">@{session.user.userID}</div>
        </div>
        <span className="text-gray-500 dark:text-gray-400">⋯</span>
      </button>

      {showLogout && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowLogout(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 animate-scaleIn">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-bold transition-all duration-300"
            >
              Log out @{session.user.userID}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

