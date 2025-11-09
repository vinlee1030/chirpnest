import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { getDb, Collections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs from '@/components/ProfileTabs';
import PostCard from '@/components/PostCard';

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: { userID: string };
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const db = await getDb();
  const usersCollection = db.collection(Collections.USERS);
  const postsCollection = db.collection(Collections.POSTS);
  const likesCollection = db.collection(Collections.LIKES);
  const followsCollection = db.collection(Collections.FOLLOWS);

  // Get profile user
  const profileUser = await usersCollection.findOne({ userID: params.userID });

  if (!profileUser) {
    redirect('/home');
  }

  const isOwnProfile = session.user.userID === params.userID;
  const tab = searchParams.tab || 'posts';

  // Check if current user is following this profile
  let isFollowing = false;
  if (!isOwnProfile) {
    const follow = await followsCollection.findOne({
      followerId: new ObjectId(session.user.id),
      followeeId: profileUser._id,
    });
    isFollowing = !!follow;
  }

  // Get total posts count for this user
  const totalPostsCount = await postsCollection.countDocuments({
    authorId: profileUser._id,
    parentId: { $exists: false }, // Only count top-level posts
  });

  let posts: any[] = [];

  if (tab === 'posts') {
    // Get user's posts (including reposts)
    posts = await postsCollection
      .find({
        authorId: profileUser._id,
        parentId: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
  } else if (tab === 'likes' && isOwnProfile) {
    // Get user's liked posts
    const likes = await likesCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const likedPostIds = likes.map(l => l.postId);
    posts = await postsCollection
      .find({ _id: { $in: likedPostIds } })
      .toArray();

    // Sort by like time
    const postMap = new Map(posts.map(p => [p._id.toString(), p]));
    posts = likes
      .map(l => postMap.get(l.postId.toString()))
      .filter(p => p);
  }

  // Get author info for all posts
  const authorIds = [...new Set(posts.map((p: any) => p.authorId))];
  const authors = await usersCollection
    .find({ _id: { $in: authorIds } })
    .toArray();

  const authorsMap = new Map(authors.map(a => [a._id.toString(), a]));

  // Check which posts are liked by current user
  const postIds = posts.map((p: any) => p._id);
  const userLikes = await likesCollection
    .find({
      userId: new ObjectId(session.user.id),
      postId: { $in: postIds },
    })
    .toArray();

  const likedPostIds = new Set(userLikes.map(l => l.postId.toString()));
  const userReactionsMap = new Map(
    userLikes.map(l => [
      l.postId.toString(),
      (l.reactionType || 'like') as 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
    ])
  );

  // Check bookmarks and reposts
  const bookmarksCollection = db.collection('bookmarks');
  const userBookmarks = await bookmarksCollection
    .find({ userId: new ObjectId(session.user.id), postId: { $in: postIds } })
    .toArray();

  const bookmarkedPostIds = new Set(userBookmarks.map(b => b.postId.toString()));

  const userReposts = await postsCollection
    .find({
      authorId: new ObjectId(session.user.id),
      isRepost: true,
      repostOf: { $in: postIds },
    })
    .toArray();

  const repostedPostIds = new Set(userReposts.map(r => r.repostOf?.toString()));

  // Handle reposts
  const repostIds = posts
    .filter((p: any) => p.isRepost && p.repostOf)
    .map((p: any) => p.repostOf);

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
      .filter((p: any) => p.isRepost && p.repostOf)
      .map((p: any) => p.repostOf.toString())
  );

  // Format posts, excluding original posts that have reposts in the feed
  const formattedPosts = posts
    .filter((post: any) => {
      // If this is a repost, always show it
      if (post.isRepost) return true;
      
      // If this is an original post that's been reposted in the current feed, hide it
      if (postsWithRepostsInFeed.has(post._id.toString())) return false;
      
      // Otherwise, show it
      return true;
    })
    .map((post: any) => {
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
      <div className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 animate-fadeIn">
        <Link href="/home" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-all duration-300 text-gray-900 dark:text-gray-100 transform hover:scale-110">
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profileUser.displayName || profileUser.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{totalPostsCount} posts</p>
        </div>
      </div>

      <ProfileHeader
        user={{
          _id: profileUser._id.toString(),
          userID: profileUser.userID,
          name: profileUser.name,
          displayName: profileUser.displayName,
          avatarUrl: profileUser.avatarUrl,
          bannerUrl: profileUser.bannerUrl,
          bio: profileUser.bio,
          followersCount: profileUser.followersCount,
          followingCount: profileUser.followingCount,
        }}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        postsCount={totalPostsCount}
      />

      <ProfileTabs userID={params.userID} showLikes={isOwnProfile} />

      <div>
        {formattedPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No posts yet</p>
          </div>
        ) : (
          formattedPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

