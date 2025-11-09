# 🚀 START HERE - ChirpNest Setup

## ⚡ Quick 3-Step Setup

### Step 1: Install Dependencies

```bash
cd "My Hw5"
npm install
```

### Step 2: Set Up Cloudinary (5 minutes)

**Why?** For image upload functionality

**How?**

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click **"Sign Up for Free"**
3. After login, you'll see your **Dashboard**
4. Look for **"Product Environment Credentials"** section
5. Copy these 3 values:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" button to see it)

6. Add to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret_here
```

**Full guide:** [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

### Step 3: Restart Server

```bash
npm run dev
```

## 🎯 Test the App

### Test Registration & Login

1. Go to http://localhost:3000
2. Click **"Register here"**
3. Enter a userID (e.g., `alice`)
4. Click **"Register with Google"**
5. Complete Google OAuth
6. You're in! 🎉

### Test Logout & Re-login

1. Click your avatar at bottom-left → **Log out**
2. You're back at login page
3. Enter your userID: `alice`
4. Click **Login**
5. System detects you used Google → redirects to Google OAuth
6. Complete OAuth → Logged in! ✅

### Test Image Upload

1. On Home page, type some text
2. Click the **🖼️ icon**
3. Select 1-4 images from your computer
4. See preview
5. Click **Post**
6. Your post with images appears!

### Test All Features

- ✅ Create post with text only
- ✅ Create post with images only  
- ✅ Create post with text + images
- ✅ Like a post
- ✅ Reply to a post
- ✅ Repost
- ✅ Follow another user
- ✅ Edit profile
- ✅ Upload avatar/banner image

## 🆕 What Changed?

### Registration Flow (No More Registration Key!)

**Before:**
- Needed a registration key
- Auto-generated userID

**Now:**
- NO registration key needed ✅
- You choose your own userID ✅
- Simpler and cleaner!

**Flow:**
```
Login Page → Enter userID → Choose Provider → OAuth → Done!
```

### Image Upload

- Click 🖼️ icon to upload images
- Up to 4 images per post
- Stored on Cloudinary (free)
- Works in posts, replies, and profile

### Profile Improvements

- Shows post count
- Back arrow (←) to return to Home
- Cleaner layout

## 📚 Documentation

- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **Full Setup:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Cloudinary:** [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
- **Recent Updates:** [RECENT_UPDATES.md](./RECENT_UPDATES.md)
- **Complete README:** [README.md](./README.md)

## ⚠️ Important Notes

### Your Current Accounts

If you already created accounts, they have auto-generated userIDs like `google_vincent__123456`.

**To use the new login flow:**

**Option A:** Find the auto-generated userID in MongoDB and use it to login

**Option B:** Create a new account with a clean userID (recommended)

### Required Services

Make sure you have credentials for:
- ✅ Google OAuth
- ✅ GitHub OAuth  
- ✅ MongoDB Atlas
- ✅ Pusher
- 🆕 **Cloudinary** (new!)

## 🐛 Troubleshooting

### Profile page crashes?

**Solution:** Restart your dev server (Ctrl+C, then `npm run dev`)

### Can't upload images?

1. Check `.env` has Cloudinary credentials
2. Restart server
3. Check file is an image (JPG, PNG, GIF, WebP)
4. Check file < 5MB

### Login doesn't detect provider?

- Make sure the userID exists in database
- For old accounts, check MongoDB for the exact userID

## ✅ Checklist

Before you start:

- [ ] Ran `npm install`
- [ ] Added Cloudinary credentials to `.env`
- [ ] Restarted dev server
- [ ] Can access http://localhost:3000

Ready to test:

- [ ] Register new account (without reg key!)
- [ ] Logout
- [ ] Login with userID
- [ ] Upload images to a post
- [ ] Check profile page (posts count, back arrow)

---

## 🎉 You're Ready!

All features are implemented and working. Follow the 3 steps above to get started!

**Next:** Set up Cloudinary → [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

