import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
        } : null,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      };
    });

    return NextResponse.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

