'use client';

import ThemeToggle from './ThemeToggle';

export default function RightSidebar() {
  const features = [
    {
      icon: '🖼️',
      title: 'Image Uploads',
      description: 'Add up to 4 images to posts and replies'
    },
    {
      icon: '🎥',
      title: 'YouTube Videos',
      description: 'Paste a YouTube URL and it automatically embeds as a video player'
    },
    {
      icon: '😊',
      title: 'Emoji Reactions',
      description: 'React to posts with 6 different emojis (Like, Love, Haha, Wow, Sad, Angry)'
    },
    {
      icon: '🔔',
      title: 'Real-time Notifications',
      description: 'Get instant alerts for likes, replies, and new followers'
    },
    {
      icon: '🔖',
      title: 'Bookmarks',
      description: 'Save interesting posts for later reading'
    },
    {
      icon: '⚡',
      title: 'Live Updates',
      description: 'See likes and replies update in real-time with Pusher'
    },
    {
      icon: '#️⃣',
      title: 'Hashtags & Mentions',
      description: 'Use #hashtags and @mentions (don\'t count toward character limit)'
    },
    {
      icon: '🎨',
      title: 'Dark Mode',
      description: 'Switch between light and dark themes'
    },
  ];

  return (
    <div className="w-96 sticky top-0 p-4 space-y-4 max-h-screen overflow-y-auto scrollbar-hide">
      {/* Theme Toggle */}
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      {/* About Card */}
      <div className="card p-6 hover-lift animate-fadeIn">
        <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome to ChirpNest! 🐦
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A modern social platform built with Next.js, featuring real-time updates and rich media support.
        </p>
      </div>

      {/* Features Card */}
      <div className="card p-6 hover-lift animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-bold mb-4 text-lg">✨ Features</h3>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                {feature.icon}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Card */}
      <div className="card p-6 hover-lift animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-bold mb-4 text-lg">📊 Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {['Next.js', 'TypeScript', 'MongoDB', 'Pusher', 'TailwindCSS', 'NextAuth'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-semibold hover:scale-110 transition-transform duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Tips Card */}
      <div className="card p-6 hover-lift animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-bold mb-3 text-lg">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>URLs in posts count as 23 characters</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Hashtags and mentions are free!</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Press Ctrl/Cmd + Enter to post quickly</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Hover over images to remove them</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Paste YouTube URLs to embed videos automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Hover over the like button to see emoji reactions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

