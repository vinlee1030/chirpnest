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
    const { text, parentId, images } = body;

    // At least text or images required
    if ((!text || !text.trim()) && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: 'Post must have text or images' },
        { status: 400 }
      );
    }

    // Validate post length if text provided
    if (text && !isValidPostLength(text)) {
      return NextResponse.json(
        { error: 'Post exceeds 280 character limit' },
        { status: 400 }
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

    const db = await getDb();
    const postsCollection = db.collection(Collections.POSTS);
    const usersCollection = db.collection(Collections.USERS);

    // Resolve mentions to user IDs
    const mentionUserIds: ObjectId[] = [];
    if (mentions.length > 0) {
      const mentionedUsers = await usersCollection
        .find({ userID: { $in: mentions } })
        .toArray();
      mentionUserIds.push(...mentionedUsers.map(u => u._id));
    }

    // Create post
    const postData: any = {
      authorId: new ObjectId(session.user.id),
      text: text || '',
      urls: regularUrls, // Store non-YouTube URLs
      videoUrls: videoUrls, // Store YouTube URLs separately
      hashtags,
      mentions: mentionUserIds,
      images: images || [],
      likesCount: 0,
      repliesCount: 0,
      repostsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      try {
        const parentObjectId = new ObjectId(parentId);
        const parentPost = await postsCollection.findOne({ _id: parentObjectId });
        
        if (!parentPost) {
          return NextResponse.json(
            { error: 'Parent post not found' },
            { status: 404 }
          );
        }

        postData.parentId = parentObjectId;

        // Increment reply count on parent
        await postsCollection.updateOne(
          { _id: parentObjectId },
          { $inc: { repliesCount: 1 } }
        );

        // Trigger Pusher update for parent post
        const { triggerPostUpdate } = await import('@/lib/pusher');
        await triggerPostUpdate(parentId, {
          likesCount: parentPost.likesCount,
          repliesCount: parentPost.repliesCount + 1,
          repostsCount: parentPost.repostsCount,
        });
      } catch {
        return NextResponse.json(
          { error: 'Invalid parent post ID' },
          { status: 400 }
        );
      }
    }

    const result = await postsCollection.insertOne(postData);

    return NextResponse.json({
      success: true,
      postId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

