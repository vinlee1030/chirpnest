import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ count: 0 });
    }

    const db = await getDb();
    const notificationsCollection = db.collection('notifications');

    const userId = new ObjectId(session.user.id);

    const count = await notificationsCollection.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    return NextResponse.json({ count: 0 });
  }
}

