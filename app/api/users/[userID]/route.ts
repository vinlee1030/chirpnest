import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userID: string } }
) {
  try {
    const db = await getDb();
    const usersCollection = db.collection(Collections.USERS);

    const user = await usersCollection.findOne(
      { userID: params.userID },
      {
        projection: {
          _id: 1,
          userID: 1,
          provider: 1,
          name: 1,
          displayName: 1,
          avatarUrl: 1,
          bannerUrl: 1,
          bio: 1,
          followersCount: 1,
          followingCount: 1,
          createdAt: 1,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: user._id.toString(),
      userID: user.userID,
      provider: user.provider,
      name: user.name,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

