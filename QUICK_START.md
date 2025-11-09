# Quick Start Guide

Get ChirpNest running in 10 minutes!

## 🚀 Quick Setup (For Experienced Developers)

```bash
# 1. Install dependencies
cd "My Hw5"
npm install

# 2. Create .env file (copy from ENV_TEMPLATE.md)
# Add your credentials for:
# - Google OAuth
# - GitHub OAuth
# - MongoDB Atlas
# - Pusher
# - NextAuth secret (run: openssl rand -base64 32)

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
# Register with userID and registration key: ChirpNest2024SecureKey
```

## 📋 Environment Variables Checklist

Create a `.env` file with these variables:

- [ ] `NEXTAUTH_URL` (http://localhost:3000)
- [ ] `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` (from Google Cloud Console)
- [ ] `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
- [ ] `GITHUB_ID` (from GitHub Developer Settings)
- [ ] `GITHUB_SECRET` (from GitHub Developer Settings)
- [ ] `MONGODB_URI` (from MongoDB Atlas)
- [ ] `PUSHER_APP_ID` (from Pusher Dashboard)
- [ ] `PUSHER_KEY` (from Pusher Dashboard)
- [ ] `PUSHER_SECRET` (from Pusher Dashboard)
- [ ] `PUSHER_CLUSTER` (e.g., ap3)
- [ ] `REG_KEY` (ChirpNest2024SecureKey)

## 🔗 Quick Links

- [Full Setup Guide](./SETUP_GUIDE.md) - Detailed step-by-step instructions
- [Environment Template](./ENV_TEMPLATE.md) - Copy-paste .env template
- [README](./README.md) - Complete documentation

## 🧪 Testing Checklist

- [ ] Can register with Google OAuth
- [ ] Can register with GitHub OAuth
- [ ] Can create a post
- [ ] Can like a post
- [ ] Can reply to a post
- [ ] Can repost
- [ ] Can follow/unfollow users
- [ ] Can edit profile
- [ ] Real-time updates work (open 2 browsers)
- [ ] Drafts save correctly

## 🚢 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Import to Vercel
# - Go to vercel.com
# - Click "New Project"
# - Import your repo
# - Add all environment variables
# - Deploy!

# 3. Update OAuth redirect URIs
# Add: https://your-app.vercel.app/api/auth/callback/google
# Add: https://your-app.vercel.app/api/auth/callback/github
```

## 📞 Support

If you encounter issues:

1. Check [README.md](./README.md) troubleshooting section
2. Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps
3. Verify all environment variables are correctly set

---

**Happy coding! 🎉**

