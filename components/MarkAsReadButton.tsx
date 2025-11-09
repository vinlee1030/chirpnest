'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MarkAsReadButton() {
  const router = useRouter();
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsRead = async () => {
    if (isMarking) return;

    setIsMarking(true);
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
      });

      if (response.ok) {
        // Trigger event to update Sidebar badge count
        window.dispatchEvent(new CustomEvent('notificationsRead'));
        router.refresh();
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <button
      onClick={handleMarkAsRead}
      disabled={isMarking}
      className="px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
    >
      {isMarking ? 'Marking...' : 'Mark all as read'}
    </button>
  );
}

