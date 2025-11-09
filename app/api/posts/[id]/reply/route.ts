import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import {
  extractUrlsHashtagsMentions,
  isValidPostLength,
  isYouTubeUrl,
} from '@/lib/validators';
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

    const body = await request.json();
    const { text, images } = body;

    // At least text or images required
    if ((!text || !text.trim()) && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: 'Reply must have text or images' },
        { status: 400 }
      );
    }

    // Validate post length if text provided
    if (text && !isValidPostLength(text)) {
      return NextResponse.json(
        { error: 'Reply exceeds 280 character limit' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const postsCollection = db.collection(Collections.POSTS);
    const usersCollection = db.collection(Collections.USERS);

    let parentId: ObjectId;
    try {
      parentId = new ObjectId(params.id);
    } catch {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const parentPost = await postsCollection.findOne({ _id: parentId });

    if (!parentPost) {
      return NextResponse.json(
        { error: 'Parent post not found' },
        { status: 404 }
      );
    }

    // Extract content
    const { urls, hashtags, mentions } = extractUrlsHashtagsMentions(text || '');

    // Separate YouTube URLs from regular URLs
    const videoUrls: string[] = [];
    const regularUrls: string[] = [];
    
    urls.forEach(url => {
      if (isYouTubeUrl(url)) {
        videoUrls.push(url);
      } else {
        regularUrls.push(url);
      }
    });

    // Resolve mentions to user IDs
    const mentionUserIds: ObjectId[] = [];
    if (mentions.length > 0) {
      const mentionedUsers = await usersCollection
        .find({ userID: { $in: mentions } })
        .toArray();
      mentionUserIds.push(...mentionedUsers.map(u => u._id));
    }

    // Create reply
    const result = await postsCollection.insertOne({
      authorId: new ObjectId(session.user.id),
      text: text || '',
      urls: regularUrls, // Store non-YouTube URLs
      videoUrls: videoUrls, // Store YouTube URLs separately
      hashtags,
      mentions: mentionUserIds,
      images: images || [],
      parentId,
      likesCount: 0,
      repliesCount: 0,
      repostsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Increment reply count on parent
    await postsCollection.updateOne(
      { _id: parentId },
      { $inc: { repliesCount: 1 } }
    );

    // Trigger Pusher update
    await triggerPostUpdate(params.id, {
      likesCount: parentPost.likesCount,
      repliesCount: parentPost.repliesCount + 1,
      repostsCount: parentPost.repostsCount,
    });

    // Create notification for post author
    await createNotification(
      parentPost.authorId.toString(),
      session.user.id,
      'reply',
      params.id
    );

    return NextResponse.json({
      success: true,
      replyId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

