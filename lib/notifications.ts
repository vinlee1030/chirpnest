import { getDb } from './db';
import { ObjectId } from 'mongodb';
import { pusherServer } from './pusher';

type NotificationType = 'like' | 'reply' | 'repost' | 'follow' | 'mention';

export async function createNotification(
  recipientId: string,
  actorId: string,
  type: NotificationType,
  postId?: string
) {
  try {
    // Don't notify yourself
    if (recipientId === actorId) return;

    const db = await getDb();
    const notificationsCollection = db.collection('notifications');
    const usersCollection = db.collection('users');

    // Get actor info for the notification
    const actor = await usersCollection.findOne({ _id: new ObjectId(actorId) });

    if (!actor) return;

    const notification = {
      recipientId: new ObjectId(recipientId),
      actorId: new ObjectId(actorId),
      type,
      postId: postId ? new ObjectId(postId) : undefined,
      isRead: false,
      createdAt: new Date(),
    };

    await notificationsCollection.insertOne(notification);

    // Trigger Pusher event for real-time notification with actor info
    await pusherServer.trigger(
      `user-${recipientId}`,
      'notification',
      {
        type,
        actor: {
          name: actor.displayName || actor.name,
          userID: actor.userID,
          avatarUrl: actor.avatarUrl,
        },
        postId,
      }
    );
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

