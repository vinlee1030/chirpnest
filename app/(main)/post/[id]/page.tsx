import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import PostComposerInline from '@/components/PostComposerInline';
import ReplyComposer from '@/components/ReplyComposer';

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const db = await getDb();
  const postsCollection = db.collection(Collections.POSTS);
  const usersCollection = db.collection(Collections.USERS);
  const likesCollection = db.collection(Collections.LIKES);

  let postId: ObjectId;
  try {
    postId = new ObjectId(params.id);
  } catch {
    redirect('/home');
  }

  // Get the main post
  const post = await postsCollection.findOne({ _id: postId });

  if (!post) {
    redirect('/home');
  }

  // Get author
  const author = await usersCollection.findOne({ _id: post.authorId });

  // Check if liked
  const isLiked = await likesCollection.findOne({
    userId: new ObjectId(session.user.id),
    postId: post._id,
  });

  // Get replies
  const replies = await postsCollection
    .find({ parentId: post._id })
    .sort({ createdAt: -1 })
    .toArray();

  // Get reply authors
  const replyAuthorIds = [...new Set(replies.map(r => r.authorId))];
  const replyAuthors = await usersCollection
    .find({ _id: { $in: replyAuthorIds } })
    .toArray();

  const replyAuthorsMap = new Map(replyAuthors.map(a => [a._id.toString(), a]));

  // Check which replies are liked
  const replyIds = replies.map(r => r._id);
  const userLikes = await likesCollection
    .find({
      userId: new ObjectId(session.user.id),
      postId: { $in: replyIds },
    })
    .toArray();

  const likedReplyIds = new Set(userLikes.map(l => l.postId.toString()));
  const userReactionsMap = new Map(
    userLikes.map(l => [
      l.postId.toString(),
      (l.reactionType || 'like') as 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
    ])
  );

  // Check which posts/replies are bookmarked and reposted
  const allPostIds = [post._id, ...replyIds];
  const bookmarksCollection = db.collection('bookmarks');
  const userBookmarks = await bookmarksCollection
    .find({ userId: new ObjectId(session.user.id), postId: { $in: allPostIds } })
    .toArray();

  const bookmarkedPostIds = new Set(userBookmarks.map(b => b.postId.toString()));

  const userReposts = await postsCollection
    .find({
      authorId: new ObjectId(session.user.id),
      isRepost: true,
      repostOf: { $in: allPostIds },
    })
    .toArray();

  const repostedPostIds = new Set(userReposts.map(r => r.repostOf?.toString()));

  // Format main post
  const formattedPost = {
    _id: post._id.toString(),
    authorId: post.authorId.toString(),
    author: {
      userID: author?.userID || 'unknown',
      name: author?.name || 'Unknown',
      displayName: author?.displayName,
      avatarUrl: author?.avatarUrl,
    },
    text: post.text,
    images: post.images || [],
    videoUrls: post.videoUrls || [],
    likesCount: post.likesCount,
    repliesCount: post.repliesCount,
    repostsCount: post.repostsCount,
    isLiked: !!isLiked,
    currentReaction: userReactionsMap.get(post._id.toString()) || null,
    isReposted: repostedPostIds.has(post._id.toString()),
    isBookmarked: bookmarkedPostIds.has(post._id.toString()),
    createdAt: post.createdAt.toISOString(),
  };

  // Format replies
  const formattedReplies = replies.map(reply => {
    const replyAuthor = replyAuthorsMap.get(reply.authorId.toString());

    return {
      _id: reply._id.toString(),
      authorId: reply.authorId.toString(),
      author: {
        userID: replyAuthor?.userID || 'unknown',
        name: replyAuthor?.name || 'Unknown',
        displayName: replyAuthor?.displayName,
        avatarUrl: replyAuthor?.avatarUrl,
      },
      text: reply.text,
      images: reply.images || [],
      videoUrls: reply.videoUrls || [],
      likesCount: reply.likesCount,
      repliesCount: reply.repliesCount,
      repostsCount: reply.repostsCount,
      isLiked: likedReplyIds.has(reply._id.toString()),
      currentReaction: userReactionsMap.get(reply._id.toString()) || null,
      isReposted: repostedPostIds.has(reply._id.toString()),
      isBookmarked: bookmarkedPostIds.has(reply._id.toString()),
      createdAt: reply.createdAt.toISOString(),
    };
  });

  return (
    <div>
      <div className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 animate-fadeIn">
        <Link href="/home" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-all duration-300 text-gray-900 dark:text-gray-100 text-xl transform hover:scale-110">
          ← 
        </Link>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Post</h1>
      </div>

      <PostCard post={formattedPost} />

      {/* Reply composer */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <ReplyComposer postId={params.id} />
      </div>

      {/* Replies */}
      <div>
        {formattedReplies.length === 0 ? (
          <div className="p-12 text-center animate-fadeIn">
            <span className="text-6xl mb-4 block">💬</span>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">No replies yet</h2>
            <p className="text-gray-500 dark:text-gray-400">Be the first to reply!</p>
          </div>
        ) : (
          formattedReplies.map(reply => (
            <PostCard key={reply._id} post={reply} />
          ))
        )}
      </div>
    </div>
  );
}


