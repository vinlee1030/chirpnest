# 🧪 Final Testing Guide

All features are now complete! Follow this guide to test everything.

## ⚙️ Before Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Cloudinary to .env

Get credentials from [Cloudinary Dashboard](https://cloudinary.com/console):

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Restart Server
```bash
npm run dev
```

---

## 🎯 Complete Feature Test

### ✅ Test 1: Registration (New Flow - No Reg Key!)

1. Go to http://localhost:3000
2. Click **"Register here"**
3. Enter userID: `alice`
4. Click **"Register with Google"**
5. Complete Google OAuth
6. ✅ You're logged in with userID `alice`!

### ✅ Test 2: Logout & Login

1. Click your avatar (bottom-left) → **Log out**
2. You're back at login page
3. Enter userID: `alice`
4. Click **Login**
5. ✅ System detects Google → redirects to Google OAuth
6. Complete OAuth
7. ✅ Logged in!

### ✅ Test 3: Create Another Account

1. Logout
2. Register with userID: `bob`
3. Choose **"Register with GitHub"** (different provider!)
4. Complete GitHub OAuth
5. ✅ Now you have 2 accounts to test interactions!

### ✅ Test 4: Post with Images (Home Inline)

1. Login as `alice`
2. Type some text: "Check out my photo!"
3. Click **🖼️ icon**
4. Select an image from your computer
5. See preview appear
6. Click **Post**
7. ✅ Post appears with image!

### ✅ Test 5: Post with Multiple Images (Modal)

1. Click **Post** button in sidebar (blue button)
2. Modal opens
3. Type: "My gallery"
4. Click **🖼️** and select 2-4 images
5. See all previews
6. Hover to remove one (click ✕)
7. Click **Post**
8. ✅ Post appears with all images!

### ✅ Test 6: Reply with Image

1. Click on a post to enter detail page
2. In the reply composer, type: "Nice pic!"
3. Click **🖼️**
4. Select an image
5. Click **Reply**
6. ✅ Reply appears with image!

### ✅ Test 7: Follow System

1. Login as `alice`
2. Click on `bob`'s avatar or @username
3. Click **Follow** button
4. ✅ Button changes to **"Following"**
5. Go to Home
6. Click **Following** tab
7. ✅ See only posts from people you follow (and yourself)

### ✅ Test 8: Following Tab Behavior

**Expected behavior:**

- **All tab**: Shows all posts from everyone
- **Following tab**: 
  - If you follow people → shows their posts + your posts
  - If you follow NO ONE → shows only your posts
  - Should be different from "All" tab

**Test:**
1. Make sure you're following at least one person
2. Click **All** tab → see all posts
3. Click **Following** tab → see fewer posts (only followed + yours)

### ✅ Test 9: Like, Repost, Delete

1. **Like**: Click 🤍 → turns to ❤️
2. **Repost**: Click 🔁 → post appears in your profile
3. **Delete**: On your own post, click ⋯ → Delete

### ✅ Test 10: Profile Page

1. Click **Profile** in sidebar
2. Check:
   - ✅ **← Back arrow** in top-left
   - ✅ **"X posts"** count displayed
   - ✅ Posts count matches number of posts
3. Click ← arrow
4. ✅ Returns to Home

### ✅ Test 11: Real-time Updates (Pusher)

1. Open 2 browsers (or incognito + normal)
2. Login as `alice` in browser A
3. Login as `bob` in browser B
4. In browser A, like one of bob's posts
5. In browser B, watch the like count
6. ✅ Should update in real-time without refresh!

### ✅ Test 12: Image-only Post

1. Don't type any text
2. Click 🖼️ and upload an image
3. Click Post
4. ✅ Post appears with just the image (no text)

---

## 📊 Feature Completion Checklist

### Authentication
- [x] Register with userID + Google
- [x] Register with userID + GitHub
- [x] Login detects provider automatically
- [x] Session persists (14 days)
- [x] Logout works
- [x] No registration key required ✨

### Posting
- [x] Text posts
- [x] Posts with URLs (count as 23 chars)
- [x] Hashtags (don't count, highlighted)
- [x] Mentions (don't count, clickable)
- [x] 280 character limit
- [x] Image upload (1-4 images) ✨
- [x] Text + images
- [x] Image-only posts ✨
- [x] Draft system
- [x] Inline composer
- [x] Modal composer

### Interactions
- [x] Like/unlike
- [x] Reply (with images!) ✨
- [x] Repost
- [x] Delete own posts
- [x] Nested comments

### Feed
- [x] All tab
- [x] Following tab (correct filtering) ✨
- [x] Time-sorted
- [x] Post cards with images ✨

### Profile
- [x] View own profile
- [x] View others' profile
- [x] Edit profile
- [x] Follow/unfollow
- [x] Posts tab
- [x] Likes tab (private)
- [x] Back arrow ✨
- [x] Posts count ✨

### Real-time
- [x] Like count updates
- [x] Reply count updates
- [x] Repost count updates

---

## 🎉 All Features Complete!

If all tests above pass, you're ready to deploy to Vercel!

See [README.md](./README.md) for deployment instructions.

---

## 📝 Notes

- **Following tab** shows posts from people you follow + yourself
- **Images** are stored on Cloudinary (free 25GB storage)
- **Session** lasts 14 days (auto-login)
- **UserID** is permanent (can't change after registration)

**Happy testing! 🚀**


