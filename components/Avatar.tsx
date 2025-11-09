import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-24 h-24',
};

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

export default function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const validSrc = isValidImageUrl(src);

  return (
    <div className={cn('relative rounded-full overflow-hidden bg-gray-300', sizeClasses[size], className)}>
      {validSrc && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

