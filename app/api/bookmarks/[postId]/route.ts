import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
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
    const bookmarksCollection = db.collection('bookmarks');
    const postsCollection = db.collection('posts');

    let postId: ObjectId;
    try {
      postId = new ObjectId(params.postId);
    } catch {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await postsCollection.findOne({ _id: postId });
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userId = new ObjectId(session.user.id);

    // Check if already bookmarked
    const existing = await bookmarksCollection.findOne({
      userId,
      postId,
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already bookmarked' },
        { status: 400 }
      );
    }

    // Create bookmark
    await bookmarksCollection.insertOne({
      userId,
      postId,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
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
    const bookmarksCollection = db.collection('bookmarks');

    let postId: ObjectId;
    try {
      postId = new ObjectId(params.postId);
    } catch {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const userId = new ObjectId(session.user.id);

    // Delete bookmark
    const result = await bookmarksCollection.deleteOne({
      userId,
      postId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

