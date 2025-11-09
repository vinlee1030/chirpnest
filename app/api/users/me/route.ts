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
    const usersCollection = db.collection(Collections.USERS);

    const user = await usersCollection.findOne(
      { _id: new ObjectId(session.user.id) }
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
      name: user.name,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Validate if URL is a valid image URL
function isValidImageUrl(url?: string): boolean {
  if (!url || url.trim() === '') return true; // Empty is okay
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, bio, avatarUrl, bannerUrl } = body;

    // Validate URLs
    if (!isValidImageUrl(avatarUrl)) {
      return NextResponse.json(
        { error: 'Invalid avatar URL. Must be a valid http:// or https:// URL.' },
        { status: 400 }
      );
    }

    if (!isValidImageUrl(bannerUrl)) {
      return NextResponse.json(
        { error: 'Invalid banner URL. Must be a valid http:// or https:// URL.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection(Collections.USERS);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio.substring(0, 160);
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl.trim();
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl.trim();

    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

