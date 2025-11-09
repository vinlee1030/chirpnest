'use client';

import { useState } from 'react';
import Image from 'next/image';
import Avatar from './Avatar';
import EditProfileModal from './EditProfileModal';
import { formatNumber } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  user: {
    _id: string;
    userID: string;
    name: string;
    displayName?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
  };
  isOwnProfile: boolean;
  isFollowing?: boolean;
  postsCount?: number;
}

export default function ProfileHeader({ user, isOwnProfile, isFollowing: initialIsFollowing, postsCount = 0 }: ProfileHeaderProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Validate if URL is a valid image URL
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleFollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    const wasFollowing = isFollowing;
    
    // Optimistic update
    setIsFollowing(!wasFollowing);

    try {
      const response = await fetch(`/api/follow/${user.userID}`, {
        method: wasFollowing ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setIsFollowing(wasFollowing);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Follow error:', error);
      // Revert on error
      setIsFollowing(wasFollowing);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-gray-300 relative">
        {isValidImageUrl(user.bannerUrl) && (
          <Image
            src={user.bannerUrl!}
            alt="Banner"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="-mt-16">
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              size="xl"
              className="border-4 border-white"
            />
          </div>

          {isOwnProfile ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="mt-3 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-gray-900 dark:text-gray-100"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              disabled={isFollowLoading}
              className={`mt-3 px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                isFollowing
                  ? 'bg-transparent border border-gray-300 dark:border-gray-600 hover:border-danger hover:text-danger text-gray-900 dark:text-gray-100'
                  : 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.displayName || user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{user.userID}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{postsCount} posts</p>
        </div>

        {user.bio && (
          <p className="mt-3 whitespace-pre-wrap text-gray-900 dark:text-gray-100">{user.bio}</p>
        )}

        <div className="flex gap-6 mt-3">
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100">{formatNumber(user.followingCount)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100">{formatNumber(user.followersCount)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

