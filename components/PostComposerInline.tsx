'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from './Avatar';
import { calcPostLength } from '@/lib/validators';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PostComposerInline() {
  const { data: session } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!session?.user) return null;

  const { total } = calcPostLength(text);
  const isOverLimit = total > 280;
  const remaining = 280 - total;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, 4); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to upload image');
        }
      }

      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!text.trim() && images.length === 0) || isOverLimit || isPosting) return;

    setIsPosting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, images }),
      });

      if (response.ok) {
        setText('');
        setImages([]);
        // Force a hard refresh
        window.location.href = '/home';
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post');
        setIsPosting(false);
      }
    } catch (error) {
      console.error('Post error:', error);
      alert('Failed to post');
      setIsPosting(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <form onSubmit={handlePost} className="flex gap-3">
        <Avatar src={session.user.avatarUrl} alt={session.user.name} size="md" />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handlePost();
              }
            }}
            placeholder="What's happening?"
            className="w-full min-h-[80px] text-lg border-none focus:ring-0 resize-none placeholder-gray-500 dark:placeholder-gray-400 bg-transparent dark:text-gray-100"
            disabled={isPosting || isUploading}
          />

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 my-2">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover w-full h-40"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                disabled={isPosting || isUploading || images.length >= 4}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPosting || isUploading || images.length >= 4}
                className="text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-full transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                title="Add images"
              >
                🖼️
              </button>
              <div className={`text-sm ${isOverLimit ? 'text-danger' : 'text-gray-500 dark:text-gray-400'}`}>
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Uploading...
                  </span>
                ) : (
                  `${remaining} characters remaining`
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={(!text.trim() && images.length === 0) || isOverLimit || isPosting || isUploading}
              className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {isPosting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

