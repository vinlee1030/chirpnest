'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatNumber } from '@/lib/utils';
import { getPusherClient } from '@/lib/pusher';
import EmojiReactionPicker, { ReactionType } from './EmojiReactionPicker';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  postId: string;
  authorId: string;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  isLiked?: boolean;
  currentReaction?: ReactionType; // New prop for reaction type
  isReposted?: boolean;
  isBookmarked?: boolean;
}

export default function PostActions({
  postId,
  authorId,
  likesCount: initialLikes,
  repliesCount: initialReplies,
  repostsCount: initialReposts,
  isLiked: initialIsLiked,
  currentReaction: initialReaction,
  isReposted: initialIsReposted,
  isBookmarked: initialIsBookmarked,
}: PostActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [repliesCount, setRepliesCount] = useState(initialReplies);
  const [repostsCount, setRepostsCount] = useState(initialReposts);
  const [currentReaction, setCurrentReaction] = useState<ReactionType>(
    initialReaction || (initialIsLiked ? 'like' : null)
  );
  const [isReposted, setIsReposted] = useState(initialIsReposted);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isReacting, setIsReacting] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRepostMenu, setShowRepostMenu] = useState(false);

  const isOwnPost = session?.user?.id === authorId;

  useEffect(() => {
    // Subscribe to Pusher updates for this post
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`post-${postId}`);

    channel.bind('updated', (data: any) => {
      setLikesCount(data.likesCount);
      setRepliesCount(data.repliesCount);
      setRepostsCount(data.repostsCount);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [postId]);

  const handleReaction = async (reaction: ReactionType) => {
    if (isReacting) return;

    setIsReacting(true);
    const previousReaction = currentReaction;
    const hadReaction = previousReaction !== null;

    // Optimistic update
    setCurrentReaction(reaction);
    if (reaction && !hadReaction) {
      // Adding new reaction
      setLikesCount(prev => prev + 1);
    } else if (!reaction && hadReaction) {
      // Removing reaction
      setLikesCount(prev => Math.max(0, prev - 1));
    }

    try {
      if (reaction) {
        // Add or update reaction
        const response = await fetch(`/api/posts/${postId}/reaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reactionType: reaction }),
        });

        if (!response.ok) {
          // Revert on error
          setCurrentReaction(previousReaction);
          if (reaction && !hadReaction) {
            setLikesCount(prev => Math.max(0, prev - 1));
          } else if (!reaction && hadReaction) {
            setLikesCount(prev => prev + 1);
          }
        }
      } else {
        // Remove reaction
        const response = await fetch(`/api/posts/${postId}/reaction`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // Revert on error
          setCurrentReaction(previousReaction);
          setLikesCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Reaction error:', error);
      // Revert on error
      setCurrentReaction(previousReaction);
      if (reaction && !hadReaction) {
        setLikesCount(prev => Math.max(0, prev - 1));
      } else if (!reaction && hadReaction) {
        setLikesCount(prev => prev + 1);
      }
    } finally {
      setIsReacting(false);
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isReposting) return;

    // If already reposted, show confirmation
    if (isReposted) {
      setShowRepostMenu(false);
      if (!confirm('Undo repost?')) return;

      setIsReposting(true);
      try {
        const response = await fetch(`/api/posts/${postId}/unrepost`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsReposted(false);
          setRepostsCount(prev => Math.max(0, prev - 1));
          setTimeout(() => router.refresh(), 500);
        } else {
          alert('Failed to undo repost');
        }
      } catch (error) {
        console.error('Unrepost error:', error);
        alert('Failed to undo repost');
      } finally {
        setIsReposting(false);
      }
      return;
    }

    // New repost
    setIsReposting(true);
    setIsReposted(true);
    setRepostsCount(prev => prev + 1);

    try {
      const response = await fetch(`/api/posts/${postId}/repost`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setIsReposted(false);
        setRepostsCount(prev => Math.max(0, prev - 1));
        const error = await response.json();
        alert(error.error || 'Failed to repost');
      } else {
        setTimeout(() => router.refresh(), 500);
      }
    } catch (error) {
      console.error('Repost error:', error);
      setIsReposted(false);
      setRepostsCount(prev => Math.max(0, prev - 1));
      alert('Failed to repost');
    } finally {
      setIsReposting(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBookmarking) return;

    setIsBookmarking(true);
    const wasBookmarked = isBookmarked;
    
    // Optimistic update
    setIsBookmarked(!wasBookmarked);

    try {
      const response = await fetch(`/api/bookmarks/${postId}`, {
        method: wasBookmarked ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setIsBookmarked(wasBookmarked);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      // Revert on error
      setIsBookmarked(wasBookmarked);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Delete this post?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/post/${postId}`);
  };

  return (
    <div className="flex items-center gap-4 mt-3 text-gray-500 dark:text-gray-400">
      {/* Reply */}
      <button
        onClick={handleReply}
        className="flex items-center gap-1 hover:text-primary dark:hover:text-primary group transition-all duration-300"
      >
        <span className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 rounded-full p-2 transition-all duration-300 group-hover:scale-110 group-active:scale-95">
          💬
        </span>
        <span className="text-sm font-medium">{formatNumber(repliesCount)}</span>
      </button>

      {/* Repost */}
      <div className="relative">
        <button
          onClick={handleRepost}
          disabled={isReposting}
          className={`flex items-center gap-1 group transition-all duration-300 disabled:opacity-50 ${
            isReposted ? 'text-success dark:text-success' : 'hover:text-success'
          }`}
        >
          <span className={`rounded-full p-2 transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
            isReposted
              ? 'bg-success/20 dark:bg-success/30'
              : 'group-hover:bg-green-50 dark:group-hover:bg-green-900/30'
          }`}>
            {isReposting ? (
              <span className="animate-spin">🔄</span>
            ) : (
              '🔁'
            )}
          </span>
          <span className="text-sm font-medium">{formatNumber(repostsCount)}</span>
        </button>
      </div>

      {/* Emoji Reaction Picker */}
      <div onClick={(e) => e.stopPropagation()}>
        <EmojiReactionPicker
          currentReaction={currentReaction}
          onReactionSelect={handleReaction}
          likesCount={likesCount}
          disabled={isReacting}
        />
      </div>

      {/* Bookmark */}
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={`flex items-center gap-1 group transition-all duration-300 disabled:opacity-50 ${
          isBookmarked ? 'text-yellow-600 dark:text-yellow-500' : 'hover:text-yellow-600 dark:hover:text-yellow-500'
        }`}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <span className={`rounded-full p-2 transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
          isBookmarked ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/30'
        }`}>
          {isBookmarked ? '🔖' : '📑'}
        </span>
      </button>

      {/* Delete (for own posts) */}
      {isOwnPost && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1 hover:text-danger dark:hover:text-danger group transition-all duration-300 disabled:opacity-50 ml-auto"
          title="Delete post"
        >
          <span className="group-hover:bg-red-50 dark:group-hover:bg-red-900/30 rounded-full p-2 transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-hover:rotate-12">
            {isDeleting ? '⏳' : '🗑️'}
          </span>
        </button>
      )}
    </div>
  );
}
