import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const likesCollection = db.collection(Collections.LIKES);
    const postsCollection = db.collection(Collections.POSTS);
    const usersCollection = db.collection(Collections.USERS);

    // Get user's likes
    const likes = await likesCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const postIds = likes.map(l => l.postId);

    if (postIds.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    // Get posts
    const posts = await postsCollection
      .find({ _id: { $in: postIds } })
      .toArray();

    // Get authors
    const authorIds = [...new Set(posts.map(p => p.authorId))];
    const authors = await usersCollection
      .find({ _id: { $in: authorIds } })
      .toArray();

    const authorsMap = new Map(authors.map(a => [a._id.toString(), a]));

    // Sort posts by like time
    const postMap = new Map(posts.map(p => [p._id.toString(), p]));
    const sortedPosts = likes
      .map(l => postMap.get(l.postId.toString()))
      .filter(p => p);

    // Format posts
    const formattedPosts = sortedPosts.map((post: any) => {
      const author = authorsMap.get(post.authorId.toString());

      return {
        _id: post._id.toString(),
        authorId: post.authorId.toString(),
        author: {
          userID: author?.userID || 'unknown',
          name: author?.name || 'Unknown',
          displayName: author?.displayName,
          avatarUrl: author?.avatarUrl,
        },
        text: post.text,
        likesCount: post.likesCount,
        repliesCount: post.repliesCount,
        repostsCount: post.repostsCount,
        isLiked: true,
        createdAt: post.createdAt,
      };
    });

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

