import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = new ObjectId(session.user.id);
    const notificationId = new ObjectId(params.id);

    // Mark this specific notification as read
    const result = await notificationsCollection.updateOne(
      { 
        _id: notificationId,
        recipientId: userId,
        isRead: false 
      },
      { $set: { isRead: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Notification not found or already read' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

