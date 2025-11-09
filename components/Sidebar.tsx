'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';

export default function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [badgeKey, setBadgeKey] = useState(0); // For triggering animation

  // Load unread count
  const loadCount = () => {
    fetch('/api/notifications/unread-count')
      .then(res => res.json())
      .then(data => {
        const newCount = data.count || 0;
        setUnreadCount(prev => {
          if (newCount > prev) {
            // Trigger pop animation for new notifications
            setBadgeKey(badgeKey => badgeKey + 1);
          }
          return newCount;
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    // Load initial unread count
    loadCount();

    // Refresh count periodically (every 10 seconds)
    const interval = setInterval(loadCount, 10000);

    return () => clearInterval(interval);
  }, []);

  // Update count when entering notifications page
  useEffect(() => {
    if (pathname === '/notifications') {
      loadCount();
    }
  }, [pathname]);

  useEffect(() => {
    // Listen for real-time notification updates (new notifications)
    const handleNotificationReceived = () => {
      loadCount();
    };

    // Listen for when notifications are marked as read
    const handleNotificationsRead = () => {
      loadCount();
    };

    window.addEventListener('notificationReceived', handleNotificationReceived);
    window.addEventListener('notificationsRead', handleNotificationsRead);
    
    return () => {
      window.removeEventListener('notificationReceived', handleNotificationReceived);
      window.removeEventListener('notificationsRead', handleNotificationsRead);
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '/home', icon: '🏠', badge: null },
    { name: 'Notifications', href: '/notifications', icon: '🔔', badge: unreadCount },
    { name: 'Bookmarks', href: '/bookmarks', icon: '🔖', badge: null },
    { name: 'Profile', href: '/profile', icon: '👤', badge: null },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="p-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          ChirpNest
        </h1>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-full text-lg transition-all duration-300 relative group',
              pathname.startsWith(item.href)
                ? 'font-bold bg-primary/10 dark:bg-primary/20 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
            )}
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
              {item.icon}
            </span>
            <span>{item.name}</span>
            {item.badge !== null && item.badge > 0 && (
              <span
                key={`${item.name}-${badgeKey}`}
                className="absolute right-4 top-2 bg-gradient-to-r from-danger to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-popBadge"
              >
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </Link>
        ))}

        <button
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          onClick={() => {
            const event = new CustomEvent('openPostModal');
            window.dispatchEvent(event);
          }}
        >
          Post
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <UserMenu />
      </div>
    </div>
  );
}


