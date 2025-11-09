# 🎯 Next Steps - What You Need to Do Now

## ⚡ Immediate Actions Required

### 1. Install New Dependencies

```bash
npm install
```

This will install the `cloudinary` package needed for image uploads.

### 2. Set Up Cloudinary (5 minutes)

**Follow the detailed guide:** [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

**Quick steps:**

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click **"Sign Up for Free"**
3. After signup, copy these 3 values from your Dashboard:
   - Cloud Name
   - API Key
   - API Secret (click "Reveal" to see it)
4. Add to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Restart Your Server

**Important:** Must restart for new config to load!

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 Testing the New Features

### Test 1: Login Flow

1. **Logout** from your current account
2. Go to http://localhost:3000/login
3. You'll see the new login page
4. **For existing users:**
   - Enter an existing userID (check MongoDB to see what was auto-created)
   - Click Login
   - System will detect provider and redirect
5. **For new registration:**
   - Click "Register here"
   - Enter a new userID (e.g., `my_test_user`)
   - Enter RegKey: `ChirpNest2024SecureKey`
   - Choose Google or GitHub
   - Complete OAuth
   - Done!

### Test 2: Image Upload

1. Login to your account
2. On Home page, click the **🖼️ icon** next to the text area
3. Select 1-4 images from your computer
4. You'll see previews appear
5. Click **Post**
6. Your post with images appears in the feed!

### Test 3: Profile Page

1. Click **Profile** in the sidebar
2. You should see:
   - **← arrow** in top-left (click to return to Home)
   - Your name + **"X posts"** count
   - Posts count also in profile info
3. Test the arrow - it should take you back to Home

## 📋 Feature Checklist

After testing, verify these all work:

- [ ] Can register with userID + Google
- [ ] Can register with userID + GitHub  
- [ ] Can login by entering userID
- [ ] System detects correct provider for login
- [ ] Session persists (don't need to login again)
- [ ] Can upload 1 image in a post
- [ ] Can upload multiple images (up to 4)
- [ ] Images display correctly in feed
- [ ] Images display in post detail page
- [ ] Posts count shows in profile header
- [ ] Back arrow works from profile
- [ ] Can still post without images (text only)
- [ ] Can post with only images (no text)

## 🎨 What You Should See

### Login Page:
```
ChirpNest
Connect with the world

UserID: [________]
        3-15 characters...

[Login Button]

Don't have an account?
Register here
```

### Post Composer with Images:
```
[Avatar] What's happening?
         
         [Image Preview 1] [Image Preview 2]
         
         🖼️ 280 characters remaining   [Post]
```

### Profile Header:
```
← Vincent Li
  12 posts
```

## 🐛 Troubleshooting

### Can't upload images?

**Error:** "Failed to upload image"
- Check `.env` has all 3 Cloudinary values
- Restart server with `npm run dev`
- Check file size < 5MB
- Check file is actually an image

### Login not working?

**Old users with auto-generated userIDs:**
- Check MongoDB to see the actual userID that was created
- Or create a fresh account with the new registration flow

**New registration:**
- Make sure RegKey is exactly: `ChirpNest2024SecureKey`
- UserID must be unique
- Must choose a provider (Google or GitHub)

### Profile shows 0 posts?

- Count only includes top-level posts (not replies)
- Replies don't count toward total
- Reposts DO count

## 📚 Documentation

- **Cloudinary Setup:** [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
- **Recent Changes:** [RECENT_UPDATES.md](./RECENT_UPDATES.md)
- **Main README:** [README.md](./README.md)
- **Quick Start:** [QUICK_START.md](./QUICK_START.md)

## 🎉 You're Almost Done!

Once you complete the 3 steps above (install, Cloudinary setup, restart), you'll have:

✅ Complete login/registration system  
✅ Image upload functionality  
✅ All profile improvements  
✅ Everything needed for the assignment!

---

**Next:** Follow [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) to set up image uploads!

