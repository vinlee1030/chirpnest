import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import FeedTabs from '@/components/FeedTabs';
import PostComposerInline from '@/components/PostComposerInline';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const db = await getDb();
  const postsCollection = db.collection(Collections.POSTS);
  const usersCollection = db.collection(Collections.USERS);
  const likesCollection = db.collection(Collections.LIKES);
  const followsCollection = db.collection(Collections.FOLLOWS);

  const tab = searchParams.tab || 'all';
  const userId = new ObjectId(session.user.id);

  let query: any = { parentId: { $exists: false } };

  if (tab === 'following') {
    // Get list of users I'm following
    const following = await followsCollection
      .find({ followerId: userId })
      .toArray();
    
    const followingIds = following.map(f => f.followeeId);
    
    // Only show posts from people I follow (and myself)
    if (followingIds.length === 0) {
      // If not following anyone, only show own posts
      query.authorId = userId;
    } else {
      query.authorId = { $in: [...followingIds, userId] };
    }
  }

  // Fetch posts
  const posts = await postsCollection
    .find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  // Get author info for all posts
  const authorIds = [...new Set(posts.map(p => p.authorId))];
  const authors = await usersCollection
    .find({ _id: { $in: authorIds } })
    .toArray();

  const authorsMap = new Map(authors.map(a => [a._id.toString(), a]));

  // Check which posts are liked by current user and get reaction types
  const postIds = posts.map(p => p._id);
  const userLikes = await likesCollection
    .find({ userId, postId: { $in: postIds } })
    .toArray();

  const likedPostIds = new Set(userLikes.map(l => l.postId.toString()));
  // Map of postId -> reactionType (default to 'like' for backward compatibility)
  const userReactionsMap = new Map(
    userLikes.map(l => [
      l.postId.toString(),
      (l.reactionType || 'like') as 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
    ])
  );

  // Check which posts are bookmarked by current user
  const bookmarksCollection = db.collection('bookmarks');
  const userBookmarks = await bookmarksCollection
    .find({ userId, postId: { $in: postIds } })
    .toArray();

  const bookmarkedPostIds = new Set(userBookmarks.map(b => b.postId.toString()));

  // Check which posts are reposted by current user
  const userReposts = await postsCollection
    .find({
      authorId: userId,
      isRepost: true,
      repostOf: { $in: postIds },
    })
    .toArray();

  const repostedPostIds = new Set(userReposts.map(r => r.repostOf?.toString()));

  // Handle reposts - get original post info
  const repostIds = posts
    .filter(p => p.isRepost && p.repostOf)
    .map(p => p.repostOf);

  let repostMap = new Map();
  if (repostIds.length > 0) {
    const originalPosts = await postsCollection
      .find({ _id: { $in: repostIds } })
      .toArray();

    const repostAuthorIds = originalPosts.map(p => p.authorId);
    const repostAuthors = await usersCollection
      .find({ _id: { $in: repostAuthorIds } })
      .toArray();

    const repostAuthorsMap = new Map(repostAuthors.map(a => [a._id.toString(), a]));

    repostMap = new Map(
      originalPosts.map(p => [
        p._id.toString(),
        {
          ...p,
          author: repostAuthorsMap.get(p.authorId.toString()),
        },
      ])
    );
  }

  // Collect IDs of posts that are being reposted in the current feed (for deduplication)
  const postsWithRepostsInFeed = new Set(
    posts
      .filter(p => p.isRepost && p.repostOf)
      .map(p => p.repostOf.toString())
  );

  // Format posts for display, excluding original posts that have reposts in the feed
  const formattedPosts = posts
    .filter(post => {
      // If this is a repost, always show it
      if (post.isRepost) return true;
      
      // If this is an original post that's been reposted in the current feed, hide it
      if (postsWithRepostsInFeed.has(post._id.toString())) return false;
      
      // Otherwise, show it
      return true;
    })
    .map(post => {
      const author = authorsMap.get(post.authorId.toString());
      
      let repostOf = null;
      if (post.isRepost && post.repostOf) {
        repostOf = repostMap.get(post.repostOf.toString());
      }

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
        images: post.images || [],
        videoUrls: post.videoUrls || [],
        isRepost: post.isRepost,
        repostOf: repostOf ? {
          ...repostOf,
          _id: repostOf._id.toString(),
          authorId: repostOf.authorId.toString(),
          author: {
            userID: repostOf.author?.userID || 'unknown',
            name: repostOf.author?.name || 'Unknown',
            displayName: repostOf.author?.displayName,
            avatarUrl: repostOf.author?.avatarUrl,
          },
          text: repostOf.text,
          images: repostOf.images || [],
          videoUrls: repostOf.videoUrls || [],
          createdAt: repostOf.createdAt.toISOString(),
        } : null,
        likesCount: post.likesCount,
        repliesCount: post.repliesCount,
        repostsCount: post.repostsCount,
        isLiked: likedPostIds.has(post._id.toString()),
        currentReaction: userReactionsMap.get(post._id.toString()) || null,
        isReposted: repostedPostIds.has(post._id.toString()),
        isBookmarked: bookmarkedPostIds.has(post._id.toString()),
        createdAt: post.createdAt.toISOString(),
      };
    });

  return (
    <div>
      <div className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700 animate-fadeIn">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Home
            </h1>
          </div>
          <SearchBar />
        </div>
        <FeedTabs />
      </div>

      <PostComposerInline />

      <div>
        {formattedPosts.length === 0 ? (
          <div className="p-12 text-center animate-fadeIn">
            <span className="text-6xl mb-4 block">
              {tab === 'following' ? '👥' : '🐦'}
            </span>
            <h2 className="text-xl font-bold mb-2">
              {tab === 'following' ? 'No posts from followed users' : 'No posts yet'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {tab === 'following' ? (
                <>Follow some users to see their posts here</>
              ) : (
                <>Be the first to post something!</>
              )}
            </p>
          </div>
        ) : (
          formattedPosts.map((post, index) => (
            <div
              key={post._id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

