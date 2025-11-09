/**
 * Pusher Configuration (Real-time updates)
 * 
 * TODO(Setup): Create a Pusher account and app:
 * 1. Go to: https://pusher.com/
 * 2. Create a new Channels app
 * 3. Choose cluster closest to you (e.g., ap3 for Asia-Pacific)
 * 4. Copy these values to .env:
 *    - PUSHER_APP_ID
 *    - PUSHER_KEY
 *    - PUSHER_SECRET
 *    - PUSHER_CLUSTER
 */

import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance (lazy initialization)
let pusherServerInstance: Pusher | null = null;

export const getPusherServer = (): Pusher => {
  if (!pusherServerInstance) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER;

    if (!appId || !key || !secret || !cluster) {
      throw new Error('Missing Pusher environment variables. Please set PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, and PUSHER_CLUSTER.');
    }

    pusherServerInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }
  return pusherServerInstance;
};

// For backward compatibility - lazy getter
export const pusherServer = {
  trigger: async (channel: string, event: string, data: any) => {
    const server = getPusherServer();
    return server.trigger(channel, event, data);
  },
} as Pusher;

// Client-side Pusher instance (for browser)
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (pusherClientInstance) {
    return pusherClientInstance;
  }

  // For client-side, we need to use public env vars
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap3';

  if (!key) {
    console.warn('Pusher key not configured. Real-time updates will not work.');
    // Return a dummy client that won't cause errors
    return {
      subscribe: () => ({
        bind: () => {},
        unbind_all: () => {},
        unsubscribe: () => {},
      }),
    } as any;
  }

  pusherClientInstance = new PusherClient(key, {
    cluster,
  });

  return pusherClientInstance;
};

// Trigger post update event
export async function triggerPostUpdate(
  postId: string,
  data: {
    likesCount: number;
    repliesCount: number;
    repostsCount: number;
  }
) {
  try {
    await pusherServer.trigger(`post-${postId}`, 'updated', data);
  } catch (error) {
    console.error('Pusher trigger error:', error);
  }
}

