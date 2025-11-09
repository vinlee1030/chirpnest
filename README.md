# ChirpNest 🐦

A Twitter/X-like social media platform built with Next.js, NextAuth, MongoDB, and Pusher.

## 🚀 Deployed Link

**Live Demo:** [YOUR_VERCEL_URL_HERE]

## 🔑 Registration Key

**Important:** To register a new account, you need a registration key.

**Registration Key:** `chirpnest2024`

> 💡 **Note:** The registration key can be found in this README file. You'll need to enter it when registering a new account.

## 📝 Registration & Login

### Registration Process

**Step-by-step guide:**

1. **Visit the login page** at `http://localhost:3000` (or your deployed URL)
2. **Click "Register here"** at the bottom of the login form
3. **Enter your desired UserID:**
   - Must be 3-15 characters
   - Only lowercase letters, numbers, and underscores
   - Example: `john_doe`, `user123`, `test_user`
4. **Enter the Registration Key:**
   - Find it in this README (see above)
   - Enter: `chirpnest2024`
5. **Choose a provider** (Google or GitHub) to bind with your UserID
   - This provider will be permanently linked to your UserID
   - You cannot use a different provider with the same UserID later
6. **Complete OAuth authentication** with your chosen provider
7. **Done!** You'll be redirected to the home page

**Important Security Notes:**
- Each UserID can only be bound to ONE provider (either Google OR GitHub)
- Once a UserID is bound to a provider, no one else can use that UserID with a different provider
- If you try to register with a UserID that's already taken, you'll get an error
- The registration key prevents unauthorized account creation

### Login Process

**Step-by-step guide:**

1. **Visit the login page**
2. **Enter your UserID** (the one you chose during registration)
3. **Click "Login"**
4. **System automatically detects** which provider (Google/GitHub) you used during registration
5. **You'll be redirected** to that provider's OAuth page
6. **Complete OAuth authentication**
7. **Done!** You'll be logged in and redirected to the home page

**Note:** You must use the same provider (Google or GitHub) that you used during registration. The system will automatically redirect you to the correct provider.

## ✨ Features

- ✅ User authentication with Google & GitHub OAuth (with registration key protection)
- ✅ Create posts with smart character counting (URLs count as 23 chars, hashtags/mentions don't count)
- ✅ Upload images to posts (up to 4 images via Cloudinary)
- ✅ **Embed YouTube videos** - Paste a YouTube URL and it automatically becomes an embedded video player
- ✅ **Emoji reactions** - Like posts with 6 different emoji reactions (Like, Love, Haha, Wow, Sad, Angry)
- ✅ Like, reply, and repost functionality
- ✅ Real-time updates with Pusher
- ✅ User profiles with customizable bio, avatar, and banner
- ✅ Follow/unfollow system
- ✅ Draft saving system
- ✅ Home feed with "All" and "Following" tabs
- ✅ Profile tabs (Posts/Likes)
- ✅ Nested comments with recursive routing
- ✅ Bookmarks and Notifications
- ✅ Search functionality
- ✅ Dark mode support

## 📋 Requirements Checklist

### Core Features (MVP)
- [x] **Login/Register**
  - [x] UserID validation (3-15 chars, lowercase, numbers, underscores)
  - [x] Google OAuth
  - [x] GitHub OAuth
  - [x] Registration key protection
  - [x] Automatic session management
  
- [x] **Sidebar Navigation**
  - [x] Home, Profile, Post buttons
  - [x] User menu with logout
  
- [x] **Profile Pages**
  - [x] Banner, avatar, display name, bio
  - [x] Following/followers count
  - [x] Edit profile modal (own profile)
  - [x] Follow/Following button (others' profiles)
  - [x] Posts and Likes tabs (Likes only visible to self)
  
- [x] **Posting**
  - [x] Character limit: 280 (URLs count as 23)
  - [x] Hashtags and mentions don't count toward limit
  - [x] Auto-link URLs
  - [x] Highlight hashtags and mentions
  - [x] Draft save/discard on modal close
  - [x] Drafts list accessible from modal
  - [x] Inline composer on home page
  
- [x] **Feed**
  - [x] "All" and "Following" tabs
  - [x] Time-sorted posts (newest first)
  - [x] Like, reply, repost actions
  - [x] Delete own posts (not reposts)
  
- [x] **Post Details**
  - [x] View post with replies
  - [x] Nested comment routing
  - [x] Reply composer
  - [x] Back navigation
  
- [x] **Real-time Updates (Pusher)**
  - [x] Like count updates in real-time
  - [x] Reply count updates in real-time
  - [x] Repost count updates in real-time
  
- [x] **Deployment**
  - [x] Vercel-ready configuration
  - [x] Environment variables documented
  - [x] README with setup instructions

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Authentication:** NextAuth.js
- **Database:** MongoDB Atlas
- **Real-time:** Pusher Channels
- **Deployment:** Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)
- GitHub account (for OAuth)
- Pusher account

### 1. Clone and Install

```bash
cd "My Hw5"
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the project root (same directory as `package.json`):

```bash
# Copy the template (if it exists)
cp .env.example .env
# Or create a new .env file
```

Then edit `.env` with your actual credentials. Here's a complete template:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Registration Key (change this for production!)
REG_KEY=chirpnest2024

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chirpnest?retryWrites=true&w=majority

# Pusher Channels
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap3

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important:** 
- Change `REG_KEY` to a secure random string for production
- Never commit your `.env` file to version control
- All values marked with `your_*` need to be replaced with actual credentials (see setup guide below)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Third-Party Services Setup

### 1. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth Client ID**
5. Select **Web application**
6. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR_VERCEL_DOMAIN.vercel.app/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**
8. Paste them in your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

### 2. GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name:** ChirpNest (or your choice)
   - **Homepage URL:** `http://localhost:3000` (or your domain)
   - **Authorization callback URL:**
     - For local: `http://localhost:3000/api/auth/callback/github`
     - For production: `https://YOUR_VERCEL_DOMAIN.vercel.app/api/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it
7. Paste them in your `.env` file:
   ```
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   ```

### 3. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a **New Project**
4. Create a **Cluster** (Free tier M0 is fine)
5. Under **Security**:
   - **Database Access:** Add a database user with username and password
   - **Network Access:** Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`)
     - For production, you can restrict to Vercel IPs
6. Click **Connect** on your cluster
7. Choose **Connect your application**
8. Copy the connection string (looks like `mongodb+srv://...`)
9. Replace `<password>` with your database user's password
10. Replace `<dbname>` with your database name (e.g., `chirpnest`)
11. Paste it in your `.env` file:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chirpnest?retryWrites=true&w=majority
    ```

### 4. Pusher Channels

1. Go to [Pusher](https://pusher.com/)
2. Sign up or log in
3. Create a **new Channels app**
4. Choose a cluster close to your target audience (e.g., `ap3` for Asia-Pacific)
5. Go to **App Keys** tab
6. Copy the following values:
   - `app_id`
   - `key`
   - `secret`
   - `cluster`
7. Paste them in your `.env` file:
   ```
   PUSHER_APP_ID=your_app_id
   PUSHER_KEY=your_key
   PUSHER_SECRET=your_secret
   PUSHER_CLUSTER=ap3
   ```

### 5. NextAuth Secret

Generate a secure random string for NextAuth:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

Paste the output in your `.env` file:

```
NEXTAUTH_SECRET=your_generated_secret_here
```

### 6. Registration Key

Set a registration key to control who can create accounts. This prevents unauthorized registrations.

For development/testing, you can use:
```
REG_KEY=chirpnest2024
```

**For production:** Generate a secure random string and update it in your `.env` file. Also update the README with the new key for authorized users.

**Security Note:** The registration key should be:
- At least 16 characters long
- A mix of letters, numbers, and special characters
- Kept secret and only shared with authorized users

### 7. NextAuth URL

For local development:
```
NEXTAUTH_URL=http://localhost:3000
```

For production (after deploying to Vercel):
```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

### 8. Cloudinary (Image Upload)

For image upload functionality, you need Cloudinary credentials.

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed instructions.

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 Project Structure

```
My Hw5/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login and registration page
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── home/page.tsx           # Home feed
│   │   ├── profile/
│   │   │   ├── page.tsx            # Redirect to own profile
│   │   │   └── [userID]/page.tsx  # User profile page
│   │   ├── post/[id]/page.tsx      # Post detail with replies
│   │   └── layout.tsx              # Main layout with sidebar
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── users/
│   │   │   ├── [userID]/route.ts
│   │   │   └── me/route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── like/route.ts
│   │   │       ├── repost/route.ts
│   │   │       └── reply/route.ts
│   │   ├── follow/[userID]/route.ts
│   │   └── me/
│   │       ├── drafts/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── likes/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── Avatar.tsx
│   ├── EditProfileModal.tsx
│   ├── FeedTabs.tsx
│   ├── PostActions.tsx
│   ├── PostCard.tsx
│   ├── PostComposerInline.tsx
│   ├── PostComposerModal.tsx
│   ├── ProfileHeader.tsx
│   ├── ProfileTabs.tsx
│   ├── Sidebar.tsx
│   └── UserMenu.tsx
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   ├── db.ts                       # MongoDB connection
│   ├── pusher.ts                   # Pusher configuration
│   ├── utils.ts                    # Utility functions
│   └── validators.ts               # Input validation
├── types/
│   └── next-auth.d.ts
├── middleware.ts                   # Route protection
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Collections

#### `users`
```typescript
{
  _id: ObjectId,
  userID: string,              // Unique, 3-15 chars
  provider: 'google' | 'github',
  providerId: string,
  name: string,
  displayName?: string,
  avatarUrl?: string,
  bannerUrl?: string,
  bio?: string,
  followersCount: number,
  followingCount: number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userID (unique), provider+providerId (unique)
```

#### `posts`
```typescript
{
  _id: ObjectId,
  authorId: ObjectId,
  text: string,
  urls: string[],
  hashtags: string[],
  mentions: ObjectId[],
  parentId?: ObjectId,          // For replies
  isRepost?: boolean,
  repostOf?: ObjectId,
  likesCount: number,
  repliesCount: number,
  repostsCount: number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: authorId+createdAt (desc), parentId
```

#### `likes`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  postId: ObjectId,
  createdAt: Date
}
// Indexes: userId+postId (unique), postId
```

#### `follows`
```typescript
{
  _id: ObjectId,
  followerId: ObjectId,
  followeeId: ObjectId,
  createdAt: Date
}
// Indexes: followerId+followeeId (unique), followerId, followeeId
```

#### `drafts`
```typescript
{
  _id: ObjectId,
  authorId: ObjectId,
  text: string,
  urls: string[],
  hashtags: string[],
  mentions: ObjectId[],
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment to Vercel - Complete Step-by-Step Guide

This guide will walk you through deploying ChirpNest to Vercel from start to finish.

### Prerequisites

Before you begin, make sure you have:
- ✅ All environment variables ready (from your `.env` file)
- ✅ A GitHub account
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
- ✅ All third-party services configured (MongoDB, Pusher, Cloudinary, OAuth apps)

---

### Step 1: Prepare Your Code

#### 1.1. Ensure `.gitignore` is Set Up

Make sure your `.gitignore` file includes:
```
.env
.env.local
.env*.local
node_modules
.next
.vercel
```

#### 1.2. Verify Your Project Structure

Your project should be in the `My Hw5` directory with:
- `package.json`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.js`
- All source files in `app/`, `components/`, `lib/`, etc.

---

### Step 2: Push to GitHub

#### 2.1. Initialize Git Repository (if not already done)

Open your terminal in the `My Hw5` directory:

```bash
cd "My Hw5"
git init
```

#### 2.2. Create `.gitignore` (if it doesn't exist)

```bash
# If .gitignore doesn't exist, create it
cat > .gitignore << EOF
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF
```

#### 2.3. Stage and Commit Files

```bash
git add .
git commit -m "Initial commit: ChirpNest social media platform"
```

#### 2.4. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - **Repository name:** `chirpnest` (or your preferred name)
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
3. Click **Create repository**

#### 2.5. Push to GitHub

```bash
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/chirpnest.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel

#### 3.1. Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** or **Log In**
3. Sign in with GitHub (recommended for easy integration)

#### 3.2. Import Your Project

1. Click **Add New...** → **Project**
2. You'll see a list of your GitHub repositories
3. Find your `chirpnest` repository and click **Import**

#### 3.3. Configure Project Settings

1. **Project Name:** `chirpnest` (or your preferred name)
2. **Framework Preset:** Next.js (should be auto-detected)
3. **Root Directory:** 
   - If your repo only contains `My Hw5`, leave it as `./`
   - If your repo contains multiple projects, set it to `My Hw5`
4. **Build Command:** Leave default (`npm run build`)
5. **Output Directory:** Leave default (`.next`)
6. **Install Command:** Leave default (`npm install`)

#### 3.4. Add Environment Variables

**⚠️ IMPORTANT:** Add ALL environment variables before deploying!

Click **Environment Variables** and add each variable one by one:

**1. NextAuth Configuration:**
```
NEXTAUTH_URL = https://YOUR_PROJECT_NAME.vercel.app
NEXTAUTH_SECRET = your_generated_secret_here
```

**2. Registration Key:**
```
REG_KEY = chirpnest2024
```

**3. Google OAuth:**
```
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
```

**4. GitHub OAuth:**
```
GITHUB_ID = your_github_client_id
GITHUB_SECRET = your_github_client_secret
```

**5. MongoDB Atlas:**
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/chirpnest?retryWrites=true&w=majority
```

**6. Pusher Channels:**
```
PUSHER_APP_ID = your_pusher_app_id
PUSHER_KEY = your_pusher_key
PUSHER_SECRET = your_pusher_secret
PUSHER_CLUSTER = ap3
```

**7. Cloudinary:**
```
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

**💡 Tip:** 
- For each variable, select **Production**, **Preview**, and **Development** environments
- Click **Add** after each variable
- Double-check all values for typos!

#### 3.5. Deploy

1. Click **Deploy** button
2. Wait for the build to complete (usually 2-5 minutes)
3. You'll see a success message with your deployment URL

**Your app will be live at:** `https://YOUR_PROJECT_NAME.vercel.app`

---

### Step 4: Update OAuth Redirect URIs

After deployment, you **MUST** update your OAuth apps with the new production URLs.

#### 4.1. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/google
   ```
5. Click **Save**

#### 4.2. Update GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. Under **Authorization callback URL**, add:
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/auth/callback/github
   ```
4. Click **Update application**

**⚠️ Important:** Keep your localhost URLs too! You'll need them for local development.

---

### Step 5: Update NEXTAUTH_URL in Vercel

1. Go back to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL`
4. Click the **Edit** icon (pencil)
5. Update the value to your actual Vercel domain:
   ```
   https://YOUR_PROJECT_NAME.vercel.app
   ```
6. Make sure it's enabled for **Production**, **Preview**, and **Development**
7. Click **Save**

#### 5.1. Redeploy After Environment Variable Changes

After updating `NEXTAUTH_URL`, you need to redeploy:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for the deployment to complete

---

### Step 6: Verify Deployment

#### 6.1. Test Your Live App

1. Visit `https://YOUR_PROJECT_NAME.vercel.app`
2. You should see the login page
3. Try registering a new account:
   - Enter a UserID
   - Enter registration key: `chirpnest2024`
   - Choose Google or GitHub
   - Complete OAuth
4. Verify you can:
   - ✅ Create posts
   - ✅ Upload images
   - ✅ Embed YouTube videos
   - ✅ Use emoji reactions
   - ✅ Follow users
   - ✅ See real-time updates

#### 6.2. Check for Errors

1. In Vercel dashboard, go to **Deployments**
2. Click on your deployment
3. Check the **Logs** tab for any errors
4. Check the **Functions** tab for API route errors

---

### Step 7: Custom Domain (Optional)

If you want to use a custom domain:

1. Go to **Settings** → **Domains**
2. Enter your domain name
3. Follow Vercel's instructions to configure DNS
4. Update `NEXTAUTH_URL` to your custom domain
5. Update OAuth redirect URIs to your custom domain
6. Redeploy

---

### Step 8: Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Make changes to your code locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Vercel will automatically:
   - Detect the push
   - Build your project
   - Deploy to production
   - Create a preview deployment for pull requests

---

### Troubleshooting Deployment Issues

#### Issue: Build Fails

**Check:**
- ✅ All environment variables are set correctly
- ✅ No syntax errors in your code
- ✅ All dependencies are in `package.json`
- ✅ Check build logs in Vercel dashboard

**Solution:**
```bash
# Test build locally first
npm run build
```

#### Issue: OAuth Not Working

**Check:**
- ✅ Redirect URIs are updated in Google/GitHub
- ✅ `NEXTAUTH_URL` matches your Vercel domain exactly
- ✅ OAuth credentials are correct in Vercel environment variables

**Solution:**
1. Double-check redirect URIs (must match exactly)
2. Verify `NEXTAUTH_URL` in Vercel
3. Redeploy after making changes

#### Issue: MongoDB Connection Error

**Check:**
- ✅ `MONGODB_URI` is correct in Vercel
- ✅ MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)
- ✅ Database user has correct permissions

**Solution:**
1. Verify MongoDB connection string
2. Check MongoDB Atlas Network Access settings
3. Test connection string locally

#### Issue: Pusher Not Working

**Check:**
- ✅ All Pusher environment variables are set
- ✅ `PUSHER_CLUSTER` matches your Pusher app cluster
- ✅ Pusher app is active

**Solution:**
1. Verify Pusher credentials in Vercel
2. Check Pusher dashboard for app status
3. Test with Pusher debug console

#### Issue: Images Not Uploading

**Check:**
- ✅ Cloudinary credentials are correct
- ✅ Cloudinary account is active
- ✅ API keys have correct permissions

**Solution:**
1. Verify Cloudinary credentials
2. Test upload locally first
3. Check Cloudinary dashboard for usage limits

---

### Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Login page displays correctly
- [ ] Registration works with registration key
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] Can create posts
- [ ] Can upload images
- [ ] YouTube videos embed correctly
- [ ] Emoji reactions work
- [ ] Real-time updates work (Pusher)
- [ ] Search functionality works
- [ ] Dark mode works
- [ ] All pages load correctly
- [ ] No console errors in browser

---

### Updating Your README

After deployment, update your README:

1. Replace `[YOUR_VERCEL_URL_HERE]` with your actual Vercel URL
2. Update the registration key if you changed it
3. Add any additional deployment notes

---

### Quick Reference: Environment Variables Checklist

Copy this checklist and check off each variable as you add it:

```
☐ NEXTAUTH_URL
☐ NEXTAUTH_SECRET
☐ REG_KEY
☐ GOOGLE_CLIENT_ID
☐ GOOGLE_CLIENT_SECRET
☐ GITHUB_ID
☐ GITHUB_SECRET
☐ MONGODB_URI
☐ PUSHER_APP_ID
☐ PUSHER_KEY
☐ PUSHER_SECRET
☐ PUSHER_CLUSTER
☐ CLOUDINARY_CLOUD_NAME
☐ CLOUDINARY_API_KEY
☐ CLOUDINARY_API_SECRET
```

---

### Need Help?

If you encounter issues:

1. **Check Vercel Logs:** Go to your deployment → **Logs** tab
2. **Check Browser Console:** Open DevTools (F12) → Console tab
3. **Test Locally:** Make sure everything works locally first
4. **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)

---

**🎉 Congratulations!** Your ChirpNest app is now live on Vercel!

## 📝 Usage Guide

### Quick Start Guide

#### Step 1: Start the Development Server

```bash
cd "My Hw5"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Step 2: Register Your First Account

1. **Click "Register here"** on the login page
2. **Enter a UserID:**
   - Example: `test_user`, `john_doe`, `reviewer_123`
   - Must be 3-15 characters, lowercase, numbers, underscores only
3. **Enter the Registration Key:**
   - Key: `chirpnest2024`
   - You can find this in the README (see "Registration Key" section above)
4. **Choose a provider:**
   - Click either "Register with Google" or "Register with GitHub"
   - This will permanently bind your UserID to that provider
5. **Complete OAuth:**
   - You'll be redirected to Google/GitHub
   - Authorize the application
   - You'll be redirected back and logged in automatically

#### Step 3: Explore the App

Once logged in, you can:
- **Create posts:** Click the "Post" button in the sidebar or use the composer on the home page
- **Upload images:** Click the 🖼️ icon (up to 4 images per post)
- **Interact with posts:** Like (with emoji reactions), reply, repost, bookmark
- **Follow users:** Visit profiles and click "Follow"
- **Edit your profile:** Click "Edit Profile" on your own profile page
- **Search:** Use the search bar at the top of the home page
- **View notifications:** Click the 🔔 icon in the sidebar
- **Bookmark posts:** Click the bookmark icon on any post

#### Step 4: Login Later

1. Enter your UserID on the login page
2. Click "Login"
3. The system automatically detects your provider and redirects you
4. Complete OAuth authentication
5. You're logged in!

### For Reviewers

**To create a test account:**

1. Visit the deployed link or http://localhost:3000
2. Click **"Register here"**
3. Enter a unique `userID` (e.g., `reviewer_123`)
4. Enter the registration key: `chirpnest2024`
5. Choose **Google** or **GitHub** to bind with this userID
6. Complete OAuth authorization
7. Your account is created! Start exploring.

**To login later:**

1. Enter your `userID` on the login page
2. Click **Login**
3. System automatically redirects to your bound provider (Google/GitHub)
4. Complete OAuth
5. Logged in!

**Important:** 
- Each UserID can only be used with ONE provider
- If you registered with Google, you must always login with Google
- If someone else tries to use your UserID with a different provider, they will be denied

### Creating Posts

- **Home page:** Use the inline composer at the top
- **Sidebar:** Click the "Post" button to open a modal
- Posts support:
  - Plain text
  - URLs (auto-linked, count as 23 chars each)
  - **YouTube videos:** Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`) and it will automatically be embedded as a video player
  - Hashtags (e.g., `#nextjs` - colored, don't count toward limit)
  - Mentions (e.g., `@username` - linked, don't count toward limit)
  - Images (upload up to 4 images via Cloudinary)

**YouTube Video Examples:**
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`
- `https://m.youtube.com/watch?v=dQw4w9WgXcQ`

The video will automatically be detected and displayed as an embedded player in the post!

### Testing Real-time Updates

1. Open the app in two different browsers (or incognito + normal)
2. Log in with two different accounts
3. In browser A, like or reply to a post
4. In browser B, watch the counters update in real-time without refreshing

## 🐛 Troubleshooting

### OAuth Login Fails

- **Error:** "Redirect URI mismatch"
  - **Solution:** Check that your OAuth app's redirect URI exactly matches `http://localhost:3000/api/auth/callback/<provider>` for local or your Vercel domain for production

### MongoDB Connection Error

- **Error:** "MongoServerError: bad auth"
  - **Solution:** Check your MongoDB username/password in the connection string
- **Error:** "Connection timeout"
  - **Solution:** Add `0.0.0.0/0` to Network Access in MongoDB Atlas

### Pusher Not Working

- **Error:** Real-time updates not appearing
  - **Solution:** Verify `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_APP_ID`, and `PUSHER_CLUSTER` are correct
  - Check Pusher Debug Console for events

### UserID Already Taken

- **Solution:** Choose a different userID during registration

### Build Errors on Vercel

- **Error:** Missing environment variables
  - **Solution:** Add all required env vars in Vercel project settings
- **Error:** Module not found
  - **Solution:** Make sure all dependencies are in `package.json`

## 🧪 Testing Accounts

For testing, create at least two accounts with different providers:

1. **Account 1:** Use Google OAuth (e.g., `user_google`)
2. **Account 2:** Use GitHub OAuth (e.g., `user_github`)

Then test:
- ✅ Follow/unfollow
- ✅ Like/unlike posts
- ✅ Reply to posts
- ✅ Repost
- ✅ Real-time counter updates
- ✅ Edit profile
- ✅ Draft saving

## 📄 License

This project is created for educational purposes as part of a web programming assignment.

## 👤 Author

**Your Name Here**

- GitHub: [@yourusername](https://github.com/yourusername)

---

**Note:** Remember to update the **Deployed Link** and **Registration Key** sections after deployment!

"# chirpnest" 
