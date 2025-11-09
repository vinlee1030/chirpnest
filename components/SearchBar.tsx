'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Avatar from './Avatar';
import { debounce } from '@/lib/utils';

interface SearchResult {
  users: Array<{
    _id: string;
    userID: string;
    name: string;
    displayName?: string;
    avatarUrl?: string;
  }>;
  posts: Array<{
    _id: string;
    text: string;
    author: {
      userID: string;
      name: string;
      avatarUrl?: string;
    };
  }>;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchDebounced = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleSearch = (value: string) => {
    setQuery(value);
    searchDebounced(value);
  };

  const handleResultClick = () => {
    setQuery('');
    setResults(null);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search ChirpNest..."
          className="w-full px-5 py-3 pl-12 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
          {isSearching ? <span className="animate-spin">🔍</span> : '🔍'}
        </span>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results && (query.trim()) && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-h-96 overflow-y-auto animate-scaleIn z-50">
          {/* Users */}
          {results.users.length > 0 && (
            <div className="p-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 px-3 mb-2">USERS</h3>
              {results.users.map((user) => (
                <Link
                  key={user._id}
                  href={`/profile/${user.userID}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-gray-100 truncate">
                      {user.displayName || user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{user.userID}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Posts */}
          {results.posts.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 px-3 mb-2">POSTS</h3>
              {results.posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  onClick={handleResultClick}
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <Avatar src={post.author.avatarUrl} alt={post.author.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{post.author.userID}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 ml-10">
                    {post.text}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {results.users.length === 0 && results.posts.length === 0 && (
            <div className="p-8 text-center">
              <span className="text-4xl mb-2 block">🔍</span>
              <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

