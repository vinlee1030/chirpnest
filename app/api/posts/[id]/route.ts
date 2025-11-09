import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const postsCollection = db.collection(Collections.POSTS);
    const usersCollection = db.collection(Collections.USERS);

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

    const author = await usersCollection.findOne({ _id: post.authorId });

    return NextResponse.json({
      _id: post._id.toString(),
      authorId: post.authorId.toString(),
      author: {
        userID: author?.userID,
        name: author?.name,
        displayName: author?.displayName,
        avatarUrl: author?.avatarUrl,
      },
      text: post.text,
      urls: post.urls,
      hashtags: post.hashtags,
      mentions: post.mentions,
      likesCount: post.likesCount,
      repliesCount: post.repliesCount,
      repostsCount: post.repostsCount,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error('Get post error:', error);
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

    // Check ownership
    if (post.authorId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this post' },
        { status: 403 }
      );
    }

    // Can't delete reposts
    if (post.isRepost) {
      return NextResponse.json(
        { error: 'Cannot delete repost' },
        { status: 400 }
      );
    }

    await postsCollection.deleteOne({ _id: postId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

