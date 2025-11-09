/**
 * NextAuth Configuration
 * 
 * TODO(Setup): Before running the app, you need to:
 * 
 * 1. GOOGLE OAUTH:
 *    - Go to: https://console.cloud.google.com/
 *    - Create OAuth Client (Web application)
 *    - Add redirect URIs:
 *      • http://localhost:3000/api/auth/callback/google
 *      • https://your-vercel-domain.vercel.app/api/auth/callback/google
 *    - Copy GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
 * 
 * 2. GITHUB OAUTH:
 *    - Go to: https://github.com/settings/developers
 *    - Create New OAuth App
 *    - Add callback URL:
 *      • http://localhost:3000/api/auth/callback/github
 *      • https://your-vercel-domain.vercel.app/api/auth/callback/github
 *    - Copy GITHUB_ID and GITHUB_SECRET to .env
 * 
 * 3. NEXTAUTH_SECRET:
 *    - Run: openssl rand -base64 32
 *    - Copy output to .env as NEXTAUTH_SECRET
 */

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { ObjectId } from 'mongodb';
import { getDb, Collections } from './db';

export const authOptions: NextAuthOptions = {
  // Don't use adapter - we'll handle user creation manually
  adapter: undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;

      try {
        const db = await getDb();
        const usersCollection = db.collection(Collections.USERS);
        const pendingCollection = db.collection('pending_registrations');

        // Find existing user by provider and providerId
        const existingUser = await usersCollection.findOne({
          provider: account.provider,
          providerId: account.providerAccountId,
        });

        if (existingUser) {
          // User already exists with this provider, allow sign in
          // But verify the userID matches if they're trying to use a different userID
          return true;
        }

        // New user - check if there's a pending registration for this specific provider
        const pending = await pendingCollection.findOne({
          provider: account.provider,
          expiresAt: { $gt: new Date() },
        });

        if (pending) {
          // Check if this userID is already taken by another provider
          const userIDTaken = await usersCollection.findOne({
            userID: pending.userID,
          });
          
          if (userIDTaken && userIDTaken.provider !== account.provider) {
            // UserID already bound to a different provider - deny access
            console.log(`Cannot bind userID ${pending.userID} to ${account.provider} - already bound to ${userIDTaken.provider}`);
            await pendingCollection.deleteOne({ _id: pending._id });
            return false;
          }
          
          // Create new user with the pending userID
          await usersCollection.insertOne({
            userID: pending.userID,
            provider: account.provider,
            providerId: account.providerAccountId,
            name: user.name || 'Anonymous',
            displayName: user.name || 'Anonymous',
            avatarUrl: user.image || '',
            bannerUrl: '',
            bio: '',
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Clean up pending registration
          await pendingCollection.deleteOne({ _id: pending._id });
          
          console.log('Created new user with userID:', pending.userID, 'bound to provider:', account.provider);
          return true;
        }

        // No pending registration found - deny access
        console.log('No pending registration for new user');
        return false;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async jwt({ token, user, account, trigger }) {
      if (account && user) {
        try {
          const db = await getDb();
          const usersCollection = db.collection(Collections.USERS);
          
          // Find user by provider and providerId
          let dbUser = await usersCollection.findOne({
            provider: account.provider,
            providerId: account.providerAccountId,
          });

          if (dbUser) {
            // Existing user - load their data
            token.userId = dbUser._id.toString();
            token.userID = dbUser.userID;
            token.name = dbUser.name;
            token.displayName = dbUser.displayName;
            token.avatarUrl = dbUser.avatarUrl;
          }
          // Note: New user creation is now handled in a separate API endpoint
          // The pending userID is stored in database by /api/auth/complete-registration
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.userID = token.userID as string;
        session.user.name = token.name as string;
        session.user.displayName = token.displayName as string;
        session.user.avatarUrl = token.avatarUrl as string;
      }
      return session;
    },
  },
};

