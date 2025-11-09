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

    // Check if already reposted
    const existingRepost = await postsCollection.findOne({
      authorId: userId,
      isRepost: true,
      repostOf: postId,
    });

    if (existingRepost) {
      return NextResponse.json(
        { error: 'Already reposted' },
        { status: 400 }
      );
    }

    // Create repost
    await postsCollection.insertOne({
      authorId: userId,
      text: post.text,
      urls: post.urls || [],
      hashtags: post.hashtags || [],
      mentions: post.mentions || [],
      isRepost: true,
      repostOf: postId,
      likesCount: 0,
      repliesCount: 0,
      repostsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Increment repost count
    await postsCollection.updateOne(
      { _id: postId },
      { $inc: { repostsCount: 1 } }
    );

    // Trigger Pusher update
    await triggerPostUpdate(params.id, {
      likesCount: post.likesCount,
      repliesCount: post.repliesCount,
      repostsCount: post.repostsCount + 1,
    });

    // Create notification for post author
    await createNotification(
      post.authorId.toString(),
      session.user.id,
      'repost',
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Repost error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

