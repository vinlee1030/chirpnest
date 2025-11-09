'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getPusherClient } from '@/lib/pusher';
import Avatar from './Avatar';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'like' | 'reply' | 'repost' | 'follow';
  actor: {
    name: string;
    userID: string;
    avatarUrl?: string;
  };
  postId?: string;
}

export default function NotificationToast() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${session.user.id}`);

    channel.bind('notification', (data: any) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: data.type,
        actor: data.actor,
        postId: data.postId,
      };

      setNotifications(prev => [notification, ...prev]);

      // Trigger sidebar badge update
      window.dispatchEvent(new CustomEvent('notificationReceived'));

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id]);

  const getNotificationText = (type: string) => {
    switch (type) {
      case 'like':
        return 'liked your post';
      case 'reply':
        return 'replied to your post';
      case 'repost':
        return 'reposted your post';
      case 'follow':
        return 'followed you';
      default:
        return 'interacted with you';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'reply':
        return '💬';
      case 'repost':
        return '🔁';
      case 'follow':
        return '👤';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'from-pink-500 to-red-500';
      case 'reply':
        return 'from-blue-500 to-cyan-500';
      case 'repost':
        return 'from-green-500 to-emerald-500';
      case 'follow':
        return 'from-purple-500 to-indigo-500';
      default:
        return 'from-primary to-blue-600';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification, index) => (
        <Link
          key={notification.id}
          href={notification.postId ? `/post/${notification.postId}` : `/profile/${notification.actor.userID}`}
          className="pointer-events-auto"
        >
          <div
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 max-w-sm animate-slideInRight hover:scale-105 transition-transform duration-300 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              {/* Animated Icon */}
              <div className={`relative animate-bounce-slow`}>
                <Avatar
                  src={notification.actor.avatarUrl}
                  alt={notification.actor.name}
                  size="md"
                />
                <span className="absolute -bottom-1 -right-1 text-2xl animate-pulse">
                  {getNotificationIcon(notification.type)}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  <span className={`font-bold bg-gradient-to-r ${getNotificationColor(notification.type)} bg-clip-text text-transparent`}>
                    {notification.actor.name}
                  </span>
                  {' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    {getNotificationText(notification.type)}
                  </span>
                </p>
              </div>

              {/* Sparkle Effect */}
              <span className="text-2xl animate-spin-slow">✨</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getNotificationColor(notification.type)} animate-shrink`}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

