import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || !query.trim()) {
      return NextResponse.json({ users: [], posts: [] });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');
    const postsCollection = db.collection('posts');

    // Search users by userID, name, or displayName
    const users = await usersCollection
      .find({
        $or: [
          { userID: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(5)
      .toArray();

    // Search posts by text content
    const posts = await postsCollection
      .find({
        text: { $regex: query, $options: 'i' },
        parentId: { $exists: false }, // Only top-level posts
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get post authors
    const authorIds = [...new Set(posts.map(p => p.authorId))];
    const authors = await usersCollection
      .find({ _id: { $in: authorIds } })
      .toArray();

    const authorsMap = new Map(authors.map(a => [a._id.toString(), a]));

    // Format results
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      userID: user.userID,
      name: user.name,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    }));

    const formattedPosts = posts.map(post => {
      const author = authorsMap.get(post.authorId.toString());
      return {
        _id: post._id.toString(),
        text: post.text,
        author: {
          userID: author?.userID || 'unknown',
          name: author?.name || 'Unknown',
          avatarUrl: author?.avatarUrl,
        },
      };
    });

    return NextResponse.json({
      users: formattedUsers,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

