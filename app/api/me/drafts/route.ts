import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { extractUrlsHashtagsMentions } from '@/lib/validators';

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
    const draftsCollection = db.collection(Collections.DRAFTS);

    const drafts = await draftsCollection
      .find({ authorId: new ObjectId(session.user.id) })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({
      drafts: drafts.map(d => ({
        _id: d._id.toString(),
        text: d.text,
        updatedAt: d.updatedAt,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get drafts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Draft text is required' },
        { status: 400 }
      );
    }

    // Extract content
    const { urls, hashtags, mentions } = extractUrlsHashtagsMentions(text);

    const db = await getDb();
    const draftsCollection = db.collection(Collections.DRAFTS);
    const usersCollection = db.collection(Collections.USERS);

    // Resolve mentions to user IDs
    const mentionUserIds: ObjectId[] = [];
    if (mentions.length > 0) {
      const mentionedUsers = await usersCollection
        .find({ userID: { $in: mentions } })
        .toArray();
      mentionUserIds.push(...mentionedUsers.map(u => u._id));
    }

    // Create draft
    const result = await draftsCollection.insertOne({
      authorId: new ObjectId(session.user.id),
      text,
      urls,
      hashtags,
      mentions: mentionUserIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      draftId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Create draft error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

