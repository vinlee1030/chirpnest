import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { triggerPostUpdate } from '@/lib/pusher';

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

    // Find the user's repost of this post
    const repost = await postsCollection.findOne({
      authorId: userId,
      isRepost: true,
      repostOf: postId,
    });

    if (!repost) {
      return NextResponse.json(
        { error: 'Repost not found' },
        { status: 404 }
      );
    }

    // Delete the repost
    await postsCollection.deleteOne({ _id: repost._id });

    // Decrement repost count
    await postsCollection.updateOne(
      { _id: postId },
      { $inc: { repostsCount: -1 } }
    );

    // Trigger Pusher update
    await triggerPostUpdate(params.id, {
      likesCount: post.likesCount,
      repliesCount: post.repliesCount,
      repostsCount: Math.max(0, post.repostsCount - 1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unrepost error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

