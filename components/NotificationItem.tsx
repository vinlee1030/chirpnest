'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';
import { formatRelativeTime } from '@/lib/utils';

interface NotificationItemProps {
  notification: {
    _id: string;
    type: string;
    actor: {
      userID: string;
      name: string;
      displayName?: string;
      avatarUrl?: string;
    };
    post?: {
      _id: string;
      text: string;
    };
    isRead: boolean;
    createdAt: string;
  };
  index: number;
}

// Helper functions moved inside the component
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
    case 'mention':
      return 'mentioned you in a post';
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
    case 'mention':
      return '@';
    default:
      return '🔔';
  }
};

export default function NotificationItem({
  notification,
  index,
}: NotificationItemProps) {
  const router = useRouter();

  const handleClick = async () => {
    // If notification is unread, mark it as read
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification._id}/mark-read`, {
          method: 'POST',
        });
        
        // Trigger event to update Sidebar badge count
        window.dispatchEvent(new CustomEvent('notificationsRead'));
        
        // Refresh the page to update the UI
        router.refresh();
      } catch (error) {
        console.error('Mark notification read error:', error);
      }
    }
  };

  return (
    <Link
      href={notification.post ? `/post/${notification.post._id}` : `/profile/${notification.actor.userID}`}
      onClick={handleClick}
      className={`block border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 animate-fadeIn ${
        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar
            src={notification.actor.avatarUrl}
            alt={notification.actor.name}
            size="md"
          />
          <span className="absolute -bottom-1 -right-1 text-lg">
            {getNotificationIcon(notification.type)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {notification.actor.displayName || notification.actor.name}
            </span>
            {' '}
            <span className="text-gray-600 dark:text-gray-400">
              {getNotificationText(notification.type)}
            </span>
          </p>

          {notification.post && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {notification.post.text}
            </p>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>

        {!notification.isRead && (
          <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse" />
        )}
      </div>
    </Link>
  );
}

