'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | null;

interface EmojiReactionPickerProps {
  currentReaction: ReactionType;
  onReactionSelect: (reaction: ReactionType) => void;
  likesCount: number;
  disabled?: boolean;
}

const reactions: { type: ReactionType; emoji: string; label: string; color: string }[] = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'from-blue-500 to-blue-600' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'from-pink-500 to-red-600' },
  { type: 'laugh', emoji: '😂', label: 'Haha', color: 'from-yellow-400 to-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'from-yellow-300 to-yellow-400' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-400 to-blue-500' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-500 to-orange-600' },
];

export default function EmojiReactionPicker({
  currentReaction,
  onReactionSelect,
  likesCount,
  disabled = false,
}: EmojiReactionPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const currentReactionData = reactions.find(r => r.type === currentReaction);
  const displayEmoji = currentReactionData?.emoji || '🤍';
  const displayColor = currentReactionData?.color || '';

  const handleReactionClick = (reaction: ReactionType) => {
    if (currentReaction === reaction) {
      // If clicking the same reaction, remove it
      onReactionSelect(null);
    } else {
      // Select new reaction
      onReactionSelect(reaction);
    }
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) {
            setShowPicker(!showPicker);
          }
        }}
        onMouseEnter={() => {
          if (!showPicker && !disabled) {
            setShowPicker(true);
          }
        }}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1 group transition-all duration-300 disabled:opacity-50 relative",
          currentReaction ? 'text-pink-600 dark:text-pink-500' : 'hover:text-pink-600 dark:hover:text-pink-500'
        )}
      >
        <span
          className={cn(
            "rounded-full p-2 transition-all duration-300 group-hover:scale-125 group-active:scale-95 text-2xl",
            currentReaction
              ? 'bg-pink-50 dark:bg-pink-900/30 animate-bounce-slow'
              : 'group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30'
          )}
        >
          {displayEmoji}
        </span>
        <span className="text-sm font-medium">{likesCount}</span>
      </button>

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-1 z-50 animate-scaleIn backdrop-blur-sm"
          onMouseLeave={() => setShowPicker(false)}
        >
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReactionClick(reaction.type);
              }}
              onMouseEnter={() => setHoveredReaction(reaction.type)}
              className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all duration-300 transform hover:scale-150 hover:z-10",
                currentReaction === reaction.type
                  ? 'bg-gradient-to-r ' + reaction.color + ' scale-125 shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
              title={reaction.label}
            >
              <span
                className={cn(
                  "transition-all duration-300",
                  hoveredReaction === reaction.type && 'animate-bounce'
                )}
              >
                {reaction.emoji}
              </span>
              {currentReaction === reaction.type && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gradient-to-r rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

