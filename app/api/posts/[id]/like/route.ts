import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { triggerPostUpdate } from '@/lib/pusher';
import { createNotification } from '@/lib/notifications';

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
    const postsCollection = db.collection(Collections.POSTS);
    const likesCollection = db.collection(Collections.LIKES);

    let postId: ObjectId;
    try {
      postId = new ObjectId(params.id);
    } catch {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await postsCollection.findOne({ _id: postId });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userId = new ObjectId(session.user.id);

    // Check if already liked
    const existingLike = await likesCollection.findOne({
      userId,
      postId,
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      );
    }

    // Create like
    await likesCollection.insertOne({
      userId,
      postId,
      createdAt: new Date(),
    });

    // Increment like count
    await postsCollection.updateOne(
      { _id: postId },
      { $inc: { likesCount: 1 } }
    );

    // Trigger Pusher update
    await triggerPostUpdate(params.id, {
      likesCount: post.likesCount + 1,
      repliesCount: post.repliesCount,
      repostsCount: post.repostsCount,
    });

    // Create notification for post author
    await createNotification(
      post.authorId.toString(),
      session.user.id,
      'like',
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Like post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const postsCollection = db.collection(Collections.POSTS);
    const likesCollection = db.collection(Collections.LIKES);

    let postId: ObjectId;
    try {
      postId = new ObjectId(params.id);
    } catch {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await postsCollection.findOne({ _id: postId });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userId = new ObjectId(session.user.id);

    // Delete like
    const result = await likesCollection.deleteOne({
      userId,
      postId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Not liked' },
        { status: 400 }
      );
    }

    // Decrement like count
    await postsCollection.updateOne(
      { _id: postId },
      { $inc: { likesCount: -1 } }
    );

    // Trigger Pusher update
    await triggerPostUpdate(params.id, {
      likesCount: Math.max(0, post.likesCount - 1),
      repliesCount: post.repliesCount,
      repostsCount: post.repostsCount,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unlike post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

