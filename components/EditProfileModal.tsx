'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditProfileModalProps {
  user: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    bannerUrl?: string;
  };
  onClose: () => void;
}

export default function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(user.bannerUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty is okay
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const avatarUrlValid = isValidUrl(avatarUrl);
  const bannerUrlValid = isValidUrl(bannerUrl);

  const handleSave = async () => {
    // Validate URLs before saving
    if (!avatarUrlValid || !bannerUrlValid) {
      alert('Please enter valid image URLs (must start with http:// or https://)');
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          bio,
          avatarUrl,
          bannerUrl,
        }),
      });

      if (response.ok) {
        // Reload the page to ensure all components update with new data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl animate-scaleIn">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 text-gray-900 dark:text-gray-100"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h2>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white rounded-full font-bold disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Tell us about yourself"
                maxLength={160}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {bio.length} / 160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                  avatarUrl && !avatarUrlValid ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://example.com/avatar.jpg"
              />
              {avatarUrl && !avatarUrlValid && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  ⚠️ Please enter a valid URL (must start with http:// or https://)
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to use your initial
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banner URL
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                  bannerUrl && !bannerUrlValid ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://example.com/banner.jpg"
              />
              {bannerUrl && !bannerUrlValid && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  ⚠️ Please enter a valid URL (must start with http:// or https://)
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty for solid color background
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

