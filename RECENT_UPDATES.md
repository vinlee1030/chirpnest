# Recent Updates - Image Upload & Login Flow

## 🆕 New Features Added

### 1. ✅ Correct Login/Registration Flow

**Before:** Automatic registration with auto-generated userID  
**Now:** Proper userID-based login as specified in requirements

**New Flow:**

#### Login (Existing Users):
1. Enter your **userID** (e.g., `steven123`)
2. Click **Login**
3. System detects which provider (Google/GitHub) you used to register
4. Redirects to that provider's OAuth page
5. Complete OAuth → Logged in!

#### Registration (New Users):
1. Click **"Register here"**
2. Enter your desired **userID** (3-15 chars, lowercase, numbers, underscores)
3. Enter **Registration Key**: `ChirpNest2024SecureKey`
4. Choose **Google** or **GitHub**
5. Complete OAuth
6. Account created with your chosen userID!

**Example:**
- Register as `steven123` with Google
- Later, login by entering `steven123` → automatically goes to Google OAuth

### 2. 🖼️ Image Upload to Posts

You can now upload images when creating posts!

**Features:**
- Upload up to **4 images** per post
- Supports JPG, PNG, GIF, WebP
- Max **5MB** per image
- Images stored on **Cloudinary** (free tier)
- Works in both inline composer and modal

**How to use:**
1. Click the **🖼️ icon** in the post composer
2. Select images from your computer
3. See preview before posting
4. Remove images by hovering and clicking ✕
5. Post with images!

### 3. 📊 Profile Improvements

**Added:**
- **Posts count** display (e.g., "42 posts")
- **Back to Home arrow** (←) in top-left corner
- Shows both in header and profile info section

## 🔧 Required Setup

### Install New Dependencies

```bash
npm install
```

This will install the new `cloudinary` package.

### Add Cloudinary Credentials to .env

You need to add 3 new environment variables. See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed instructions.

**Quick steps:**

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for free
3. Copy your credentials from Dashboard
4. Add to `.env`:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

### Restart Server

After adding Cloudinary credentials:

```bash
npm run dev
```

## ✅ Updated Files

### Core Changes:
- `app/(auth)/login/page.tsx` - New login flow
- `lib/auth.ts` - Registration handling with pending registrations
- `app/api/auth/register/route.ts` - Pending registration system

### Image Upload:
- `package.json` - Added Cloudinary dependency
- `app/api/upload/route.ts` - NEW: Image upload endpoint
- `components/PostComposerInline.tsx` - Image upload UI
- `components/PostCard.tsx` - Image display
- `app/api/posts/route.ts` - Handle images field

### Profile Improvements:
- `components/ProfileHeader.tsx` - Posts count display
- `app/(main)/profile/[userID]/page.tsx` - Back arrow, posts count

### Config:
- `next.config.js` - Allow all HTTPS images
- `ENV_TEMPLATE.md` - Cloudinary variables
- `CLOUDINARY_SETUP.md` - NEW: Setup guide

## 🧪 Testing Guide

### Test Login Flow

1. **Logout** if you're logged in
2. **Register** a new account:
   - UserID: `test_user_123`
   - RegKey: `ChirpNest2024SecureKey`
   - Choose Google or GitHub
3. **Logout** again
4. **Login** by entering `test_user_123`
   - Should automatically go to the provider you chose
   - Complete OAuth
   - Logged in!

### Test Image Upload

1. Go to Home page
2. Click the **🖼️ icon**
3. Select 1-4 images
4. See preview
5. Click **Post**
6. Images appear in your post!

### Test Profile

1. Click **Profile** in sidebar
2. See:
   - ← Back arrow (top-left)
   - Your name + posts count
   - Posts count in profile info
3. Click ← to return to Home

## 🎯 Checklist

Before testing, make sure:

- [ ] Ran `npm install`
- [ ] Added Cloudinary credentials to `.env`
- [ ] Restarted dev server (`npm run dev`)
- [ ] Logged out and tested new registration flow
- [ ] Tested image upload
- [ ] Tested profile page improvements

## 📝 Database Changes

**New Collection:**
- `pending_registrations` - Temporary storage for registration attempts

**Updated Collection:**
- `posts` - Now includes `images: string[]` field

## 🚀 Deployment Notes

When deploying to Vercel, remember to add Cloudinary environment variables:

```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

## 🐛 Known Issues & Solutions

### "No pending registration found"

- Make sure you went through the registration flow properly
- Registration token expires in 10 minutes
- Try registering again

### Images not uploading

- Check Cloudinary credentials in `.env`
- Make sure server was restarted
- Check file size (max 5MB)
- Check file format (must be image)

### Image display error

- Next.js now allows all HTTPS images
- If specific domain fails, check `next.config.js`

---

**All major features are now complete! 🎉**

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed Cloudinary setup instructions.

