import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { createNotification } from '@/lib/notifications';

export async function POST(
  request: NextRequest,
  { params }: { params: { userID: string } }
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
    const usersCollection = db.collection(Collections.USERS);
    const followsCollection = db.collection(Collections.FOLLOWS);

    // Get target user
    const targetUser = await usersCollection.findOne({ userID: params.userID });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Can't follow yourself
    if (targetUser._id.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    const followerId = new ObjectId(session.user.id);
    const followeeId = targetUser._id;

    // Check if already following
    const existingFollow = await followsCollection.findOne({
      followerId,
      followeeId,
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following' },
        { status: 400 }
      );
    }

    // Create follow
    await followsCollection.insertOne({
      followerId,
      followeeId,
      createdAt: new Date(),
    });

    // Update counts
    await usersCollection.updateOne(
      { _id: followerId },
      { $inc: { followingCount: 1 } }
    );

    await usersCollection.updateOne(
      { _id: followeeId },
      { $inc: { followersCount: 1 } }
    );

    // Create notification
    await createNotification(
      followeeId.toString(),
      session.user.id,
      'follow'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userID: string } }
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
    const usersCollection = db.collection(Collections.USERS);
    const followsCollection = db.collection(Collections.FOLLOWS);

    // Get target user
    const targetUser = await usersCollection.findOne({ userID: params.userID });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const followerId = new ObjectId(session.user.id);
    const followeeId = targetUser._id;

    // Delete follow
    const result = await followsCollection.deleteOne({
      followerId,
      followeeId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Not following' },
        { status: 400 }
      );
    }

    // Update counts
    await usersCollection.updateOne(
      { _id: followerId },
      { $inc: { followingCount: -1 } }
    );

    await usersCollection.updateOne(
      { _id: followeeId },
      { $inc: { followersCount: -1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

