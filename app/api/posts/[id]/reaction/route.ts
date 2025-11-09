import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { triggerPostUpdate } from '@/lib/pusher';
import { createNotification } from '@/lib/notifications';

type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';

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

    const body = await request.json();
    const { reactionType }: { reactionType: ReactionType } = body;

    if (!reactionType || !['like', 'love', 'laugh', 'wow', 'sad', 'angry'].includes(reactionType)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
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

    // Check if user already has a reaction on this post
    const existingReaction = await likesCollection.findOne({
      userId,
      postId,
    });

    if (existingReaction) {
      // Update existing reaction
      await likesCollection.updateOne(
        { userId, postId },
        { $set: { reactionType, updatedAt: new Date() } }
      );
    } else {
      // Create new reaction
      await likesCollection.insertOne({
        userId,
        postId,
        reactionType,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Increment like count (we use likesCount for all reactions)
      await postsCollection.updateOne(
        { _id: postId },
        { $inc: { likesCount: 1 } }
      );
    }

    // Trigger Pusher update
    const updatedPost = await postsCollection.findOne({ _id: postId });
    if (updatedPost) {
      await triggerPostUpdate(params.id, {
        likesCount: updatedPost.likesCount,
        repliesCount: updatedPost.repliesCount,
        repostsCount: updatedPost.repostsCount,
      });
    }

    // Create notification for post author (only if it's a new reaction)
    if (!existingReaction) {
      await createNotification(
        post.authorId.toString(),
        session.user.id,
        'like',
        params.id
      );
    }

    return NextResponse.json({ success: true, reactionType });
  } catch (error) {
    console.error('Add reaction error:', error);
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

    // Delete reaction
    const result = await likesCollection.deleteOne({
      userId,
      postId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'No reaction found' },
        { status: 404 }
      );
    }

    // Decrement like count
    await postsCollection.updateOne(
      { _id: postId },
      { $inc: { likesCount: -1 } }
    );

    // Trigger Pusher update
    const updatedPost = await postsCollection.findOne({ _id: postId });
    if (updatedPost) {
      await triggerPostUpdate(params.id, {
        likesCount: updatedPost.likesCount,
        repliesCount: updatedPost.repliesCount,
        repostsCount: updatedPost.repostsCount,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove reaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

