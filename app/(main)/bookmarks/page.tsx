import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import PostCard from '@/components/PostCard';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const db = await getDb();
  const bookmarksCollection = db.collection('bookmarks');
  const postsCollection = db.collection('posts');
  const usersCollection = db.collection('users');
  const likesCollection = db.collection('likes');

  const userId = new ObjectId(session.user.id);

  // Get bookmarks
  const bookmarks = await bookmarksCollection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  const postIds = bookmarks.map(b => b.postId);

  let formattedPosts: any[] = [];

  if (postIds.length > 0) {
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

    // Check which posts are liked
    const userLikes = await likesCollection
      .find({ userId, postId: { $in: postIds } })
      .toArray();

    const likedPostIds = new Set(userLikes.map(l => l.postId.toString()));

    // Check which posts are reposted
    const reposts = await postsCollection
      .find({
        authorId: userId,
        isRepost: true,
        repostOf: { $in: postIds },
      })
      .toArray();

    const repostedPostIds = new Set(reposts.map(r => r.repostOf?.toString()));

    // Sort by bookmark time
    const postMap = new Map(posts.map(p => [p._id.toString(), p]));
    const sortedPosts = bookmarks
      .map(b => postMap.get(b.postId.toString()))
      .filter(p => p);

    formattedPosts = sortedPosts.map((post: any) => {
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
        images: post.images || [],
        videoUrls: post.videoUrls || [],
        likesCount: post.likesCount,
        repliesCount: post.repliesCount,
        repostsCount: post.repostsCount,
        isLiked: likedPostIds.has(post._id.toString()),
        isReposted: repostedPostIds.has(post._id.toString()),
        isBookmarked: true,
        createdAt: post.createdAt.toISOString(),
      };
    });
  }

  return (
    <div>
      <div className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700 p-4 animate-fadeIn">
        <h1 className="text-xl font-bold">Bookmarks</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formattedPosts.length} saved {formattedPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      <div>
        {formattedPosts.length === 0 ? (
          <div className="p-12 text-center animate-fadeIn">
            <span className="text-6xl mb-4 block">🔖</span>
            <h2 className="text-xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Save posts to read them later
            </p>
          </div>
        ) : (
          formattedPosts.map((post, index) => (
            <div
              key={post._id}
              className="animate-fadeIn"
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

