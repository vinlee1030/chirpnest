'use client';

import Link from 'next/link';
import Image from 'next/image';
import Avatar from './Avatar';
import PostActions from './PostActions';
import { formatRelativeTime } from '@/lib/utils';
import { formatPostContent } from '@/lib/validators';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import YouTubeEmbed from './YouTubeEmbed';

interface PostCardProps {
  post: {
    _id: string;
    authorId: string;
    author: {
      userID: string;
      name: string;
      displayName?: string;
      avatarUrl?: string;
    };
    text: string;
    images?: string[];
    videoUrls?: string[];
    isRepost?: boolean;
    repostOf?: any;
    likesCount: number;
    repliesCount: number;
    repostsCount: number;
    isLiked?: boolean;
    currentReaction?: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | null;
    isReposted?: boolean;
    isBookmarked?: boolean;
    createdAt: string;
  };
  showActions?: boolean;
}

export default function PostCard({ post, showActions = true }: PostCardProps) {
  const displayPost = post.isRepost && post.repostOf ? post.repostOf : post;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 animate-fadeIn">
      {post.isRepost && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400 animate-slideIn">
          <span className="text-success">🔁</span>
          <Link href={`/profile/${post.author.userID}`} className="font-bold hover:underline">
            {post.author.displayName || post.author.name}
          </Link>
          <span>reposted</span>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/profile/${displayPost.author.userID}`} className="transition-transform duration-300 hover:scale-110">
          <Avatar
            src={displayPost.author.avatarUrl}
            alt={displayPost.author.name}
            size="md"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${displayPost.author.userID}`}
              className="font-bold hover:underline transition-colors duration-300"
            >
              {displayPost.author.displayName || displayPost.author.name}
            </Link>
            <Link
              href={`/profile/${displayPost.author.userID}`}
              className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors duration-300"
            >
              @{displayPost.author.userID}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <Link
              href={`/post/${displayPost._id}`}
              className="text-gray-500 dark:text-gray-400 hover:underline transition-colors duration-300"
            >
              {formatRelativeTime(displayPost.createdAt)}
            </Link>
          </div>

          <div>
            <Link href={`/post/${displayPost._id}`}>
              {displayPost.text && (
                <div
                  className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: formatPostContent(displayPost.text, displayPost.videoUrls || []) }}
                />
              )}
            </Link>

            {/* Display YouTube videos */}
            {displayPost.videoUrls && displayPost.videoUrls.length > 0 && (
              <div className="mt-3 space-y-3">
                {displayPost.videoUrls.map((videoUrl: string, index: number) => (
                  <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <YouTubeEmbed url={videoUrl} className="w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Display images */}
            <Link href={`/post/${displayPost._id}`}>
              {displayPost.images && displayPost.images.length > 0 && (
                <div className={`mt-3 grid gap-2 ${
                  displayPost.images.length === 1 ? 'grid-cols-1' :
                  displayPost.images.length === 2 ? 'grid-cols-2' :
                  displayPost.images.length === 3 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`}>
                  {displayPost.images.map((imageUrl: string, index: number) => (
                    <div
                      key={index}
                      className={`relative ${
                        displayPost.images!.length === 3 && index === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full h-auto max-h-96"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Link>
          </div>

          {showActions && (
            <PostActions
              postId={displayPost._id}
              authorId={displayPost.authorId}
              likesCount={displayPost.likesCount}
              repliesCount={displayPost.repliesCount}
              repostsCount={displayPost.repostsCount}
              isLiked={displayPost.isLiked}
              currentReaction={displayPost.currentReaction}
              isReposted={displayPost.isReposted}
              isBookmarked={displayPost.isBookmarked}
            />
          )}
        </div>
      </div>
    </div>
  );
}

