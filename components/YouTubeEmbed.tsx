'use client';

import { getYouTubeEmbedUrl } from '@/lib/validators';
import { cn } from '@/lib/utils';

interface YouTubeEmbedProps {
  url: string;
  className?: string;
}

export default function YouTubeEmbed({ url, className }: YouTubeEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={cn("p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", className)}>
        <p className="text-sm text-gray-600 dark:text-gray-400">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg bg-black shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeIn", className)}>
      <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
        <iframe
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}

