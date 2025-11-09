/**
 * Validation utilities for user input and post content
 */

import { z } from 'zod';

// UserID validation: 3-15 characters, lowercase letters, numbers, and underscores
export const userIDSchema = z
  .string()
  .regex(/^[a-z0-9_]{3,15}$/, 'UserID must be 3-15 characters, lowercase letters, numbers, and underscores only');

export function isValidUserID(userID: string): boolean {
  return userIDSchema.safeParse(userID).success;
}

// URL regex pattern
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Hashtag pattern: #word
const HASHTAG_REGEX = /#(\w+)/g;

// Mention pattern: @userID
const MENTION_REGEX = /@([a-z0-9_]{3,15})/g;

export interface ExtractedContent {
  urls: string[];
  hashtags: string[];
  mentions: string[];
  cleanText: string; // Text without URLs, hashtags, mentions for length calculation
}

/**
 * Extract URLs, hashtags, and mentions from text
 */
export function extractUrlsHashtagsMentions(text: string): ExtractedContent {
  const urls: string[] = [];
  const hashtags: string[] = [];
  const mentions: string[] = [];

  // Extract URLs
  const urlMatches = text.match(URL_REGEX);
  if (urlMatches) {
    urls.push(...urlMatches);
  }

  // Extract hashtags (without #)
  const hashtagMatches = text.match(HASHTAG_REGEX);
  if (hashtagMatches) {
    hashtags.push(...hashtagMatches.map(tag => tag.substring(1)));
  }

  // Extract mentions (without @)
  const mentionMatches = text.match(MENTION_REGEX);
  if (mentionMatches) {
    mentions.push(...mentionMatches.map(mention => mention.substring(1)));
  }

  // Remove hashtags and mentions from text for length calculation
  let cleanText = text;
  cleanText = cleanText.replace(HASHTAG_REGEX, '');
  cleanText = cleanText.replace(MENTION_REGEX, '');
  // Keep URLs for now, they'll be counted separately

  return {
    urls: Array.from(new Set(urls)),
    hashtags: Array.from(new Set(hashtags)),
    mentions: Array.from(new Set(mentions)),
    cleanText,
  };
}

export interface PostLength {
  baseCount: number;
  urlCount: number;
  total: number;
}

/**
 * Calculate post length according to rules:
 * - Each URL counts as 23 characters regardless of actual length
 * - Hashtags and mentions don't count toward length
 * - Maximum total: 280 characters
 */
export function calcPostLength(text: string): PostLength {
  const { urls, cleanText } = extractUrlsHashtagsMentions(text);

  // Remove URLs from clean text to get base character count
  let textWithoutUrls = cleanText;
  urls.forEach(url => {
    textWithoutUrls = textWithoutUrls.replace(url, '');
  });

  const baseCount = textWithoutUrls.trim().length;
  const urlCount = urls.length;
  const total = baseCount + (urlCount * 23);

  return {
    baseCount,
    urlCount,
    total,
  };
}

/**
 * Check if post length is valid (≤ 280)
 */
export function isValidPostLength(text: string): boolean {
  const { total } = calcPostLength(text);
  return total <= 280;
}

/**
 * Check if a URL is a YouTube video URL
 */
export function isYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return (
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'youtu.be' ||
      hostname === 'm.youtube.com'
    );
  } catch {
    return false;
  }
}

/**
 * Extract YouTube video ID from URL
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Check for youtu.be format
    if (urlObj.hostname.toLowerCase() === 'youtu.be') {
      return urlObj.pathname.substring(1).split('?')[0];
    }
    
    // Check for youtube.com format
    if (urlObj.hostname.toLowerCase().includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Convert YouTube URL to embed URL
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Format extracted content for display
 * Converts URLs to links, highlights hashtags and mentions
 * Removes YouTube URLs from text (they'll be shown as embeds separately)
 */
export function formatPostContent(text: string, videoUrls: string[] = []): string {
  let formatted = text;

  // Remove YouTube URLs from text (they'll be displayed as embeds)
  if (videoUrls.length > 0) {
    videoUrls.forEach(videoUrl => {
      // Remove the YouTube URL from text, including any surrounding whitespace
      formatted = formatted.replace(new RegExp(`\\s*${videoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g'), ' ');
    });
    // Clean up multiple spaces
    formatted = formatted.replace(/\s+/g, ' ').trim();
  }

  // Convert remaining URLs to links
  formatted = formatted.replace(URL_REGEX, (match) => {
    return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${match}</a>`;
  });

  // Highlight hashtags
  formatted = formatted.replace(HASHTAG_REGEX, '<span class="text-primary">$&</span>');

  // Highlight and link mentions
  formatted = formatted.replace(MENTION_REGEX, '<a href="/profile/$1" class="text-primary hover:underline">$&</a>');

  return formatted;
}

