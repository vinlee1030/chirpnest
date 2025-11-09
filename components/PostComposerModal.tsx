'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Avatar from './Avatar';
import { calcPostLength } from '@/lib/validators';
import { useRouter } from 'next/navigation';

interface Draft {
  _id: string;
  text: string;
  updatedAt: string;
}

export default function PostComposerModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('openPostModal', handleOpenModal);
    return () => window.removeEventListener('openPostModal', handleOpenModal);
  }, []);

  useEffect(() => {
    if (showDrafts) {
      loadDrafts();
    }
  }, [showDrafts]);

  const loadDrafts = async () => {
    try {
      const response = await fetch('/api/me/drafts');
      if (response.ok) {
        const data = await response.json();
        setDrafts(data.drafts);
      }
    } catch (error) {
      console.error('Load drafts error:', error);
    }
  };

  const saveDraft = async () => {
    if (!text.trim()) return;

    try {
      await fetch('/api/me/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      setText('');
      setIsOpen(false);
      setShowSavePrompt(false);
    } catch (error) {
      console.error('Save draft error:', error);
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      await fetch(`/api/me/drafts/${id}`, { method: 'DELETE' });
      setDrafts(drafts.filter(d => d._id !== id));
    } catch (error) {
      console.error('Delete draft error:', error);
    }
  };

  const loadDraft = (draft: Draft) => {
    setText(draft.text);
    setShowDrafts(false);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, 4 - images.length); i++) {
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
        }
      }

      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
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

  const handleClose = () => {
    if (text.trim() || images.length > 0) {
      setShowSavePrompt(true);
    } else {
      setIsOpen(false);
    }
  };

  const handlePost = async () => {
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
        setIsOpen(false);
        window.location.href = '/home';
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post');
      }
    } catch (error) {
      console.error('Post error:', error);
      alert('Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  if (!session?.user || !isOpen) return null;

  const { total } = calcPostLength(text);
  const isOverLimit = total > 280;
  const remaining = 280 - total;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl animate-scaleIn">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 text-gray-900 dark:text-gray-100"
            >
              ✕
            </button>
            <button
              onClick={() => setShowDrafts(!showDrafts)}
              className="px-4 py-2 text-primary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full font-bold transition-all duration-300"
            >
              {showDrafts ? 'Back' : 'Drafts'}
            </button>
          </div>

          {/* Content */}
          {showDrafts ? (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Drafts</h2>
              {drafts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No drafts saved</p>
              ) : (
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300"
                      onClick={() => loadDraft(draft)}
                    >
                      <p className="line-clamp-2 text-gray-900 dark:text-gray-100">{draft.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(draft.updatedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDraft(draft._id);
                          }}
                          className="text-danger hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex gap-3">
                <Avatar src={session.user.avatarUrl} alt={session.user.name} size="md" />
                <div className="flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full min-h-[200px] text-lg border-none focus:ring-0 resize-none placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-gray-100"
                    autoFocus
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

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                        className="text-primary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-full transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                        title="Add images (max 4)"
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
                      onClick={handlePost}
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save draft prompt */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm shadow-2xl animate-scaleIn">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Save draft?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You can save this to finish later</p>
            <div className="space-y-2">
              <button
                onClick={saveDraft}
                className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105"
              >
                Save Draft
              </button>
              <button
                onClick={() => {
                  setText('');
                  setIsOpen(false);
                  setShowSavePrompt(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-danger to-red-600 hover:from-danger-hover hover:to-red-700 text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105"
              >
                Discard
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                className="w-full py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-bold transition-all duration-300 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

