import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import MarkAsReadButton from '@/components/MarkAsReadButton';
import NotificationItem from '@/components/NotificationItem';

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const db = await getDb();
  const notificationsCollection = db.collection('notifications');
  const usersCollection = db.collection('users');
  const postsCollection = db.collection('posts');

  const userId = new ObjectId(session.user.id);

  // Get notifications
  const notifications = await notificationsCollection
    .find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  // Get related users
  const actorIds = [...new Set(notifications.map(n => n.actorId))];
  const actors = await usersCollection
    .find({ _id: { $in: actorIds } })
    .toArray();

  const actorsMap = new Map(actors.map(a => [a._id.toString(), a]));

  // Get related posts
  const postIds = notifications
    .filter(n => n.postId)
    .map(n => n.postId);
  
  const posts = postIds.length > 0
    ? await postsCollection.find({ _id: { $in: postIds } }).toArray()
    : [];

  const postsMap = new Map(posts.map(p => [p._id.toString(), p]));

  // Format notifications
  const formattedNotifications = notifications.map(notification => {
    const actor = actorsMap.get(notification.actorId.toString());
    const post = notification.postId ? postsMap.get(notification.postId.toString()) : null;

    return {
      _id: notification._id.toString(),
      type: notification.type,
      actor: {
        userID: actor?.userID || 'unknown',
        name: actor?.name || 'Unknown',
        displayName: actor?.displayName,
        avatarUrl: actor?.avatarUrl,
      },
          post: post ? {
            _id: post._id.toString(),
            text: post.text,
          } : undefined,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  });

  const unreadCount = formattedNotifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-primary dark:text-blue-400">
                {unreadCount} new {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          {unreadCount > 0 && <MarkAsReadButton />}
        </div>
      </div>

      <div>
        {formattedNotifications.length === 0 ? (
          <div className="p-12 text-center animate-fadeIn">
            <span className="text-6xl mb-4 block">🔔</span>
            <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
            <p className="text-gray-500 dark:text-gray-400">
              When someone likes, replies, or follows you, it&apos;ll show up here
            </p>
          </div>
        ) : (
          formattedNotifications.map((notification, index) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}

