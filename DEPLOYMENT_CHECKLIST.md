# Deployment Checklist

Use this checklist to ensure everything is properly set up before and after deployment.

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor installed (VS Code recommended)
- [ ] Terminal/command prompt ready

### Third-Party Services
- [ ] **Google OAuth** credentials obtained
  - [ ] Client ID copied to `.env`
  - [ ] Client Secret copied to `.env`
  - [ ] Redirect URI configured: `http://localhost:3000/api/auth/callback/google`
  
- [ ] **GitHub OAuth** credentials obtained
  - [ ] Client ID copied to `.env`
  - [ ] Client Secret copied to `.env`
  - [ ] Redirect URI configured: `http://localhost:3000/api/auth/callback/github`
  
- [ ] **MongoDB Atlas** cluster created
  - [ ] Database user created
  - [ ] IP whitelist configured (0.0.0.0/0)
  - [ ] Connection string copied to `.env`
  
- [ ] **Pusher** Channels app created
  - [ ] App ID copied to `.env`
  - [ ] Key copied to `.env`
  - [ ] Secret copied to `.env`
  - [ ] Cluster copied to `.env`
  
- [ ] **NextAuth** secret generated
  - [ ] Ran: `openssl rand -base64 32`
  - [ ] Output copied to `.env`

### Local Testing
- [ ] `.env` file created in project root
- [ ] All environment variables filled in
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register a new account
- [ ] Can login with registered account
- [ ] Can create a post
- [ ] Can like a post
- [ ] Can reply to a post
- [ ] Can repost
- [ ] Can follow/unfollow users
- [ ] Real-time updates work (tested with 2 browsers)

## 🚀 Deployment Checklist

### Git Repository
- [ ] Repository created on GitHub
- [ ] `.gitignore` includes `.env`
- [ ] All files committed
- [ ] Code pushed to GitHub

### Vercel Setup
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set (if needed): `My Hw5`
- [ ] Framework preset: Next.js

### Environment Variables (Vercel)
Add all these in Vercel project settings → Environment Variables:

- [ ] `NEXTAUTH_URL` = `https://your-project.vercel.app`
- [ ] `NEXTAUTH_SECRET` = (same as local)
- [ ] `GOOGLE_CLIENT_ID` = (same as local)
- [ ] `GOOGLE_CLIENT_SECRET` = (same as local)
- [ ] `GITHUB_ID` = (same as local)
- [ ] `GITHUB_SECRET` = (same as local)
- [ ] `MONGODB_URI` = (same as local)
- [ ] `PUSHER_APP_ID` = (same as local)
- [ ] `PUSHER_KEY` = (same as local)
- [ ] `PUSHER_SECRET` = (same as local)
- [ ] `PUSHER_CLUSTER` = (same as local)
- [ ] `REG_KEY` = (same as local)

### Deploy
- [ ] Click "Deploy" in Vercel
- [ ] Build completes successfully
- [ ] No build errors
- [ ] Deployment URL received

## 🔧 Post-Deployment Checklist

### Update OAuth Redirect URIs

**Google Cloud Console:**
- [ ] Go to Credentials → OAuth 2.0 Client IDs
- [ ] Add redirect URI: `https://your-project.vercel.app/api/auth/callback/google`
- [ ] Save changes

**GitHub OAuth App:**
- [ ] Go to Developer Settings → OAuth Apps
- [ ] Add redirect URI: `https://your-project.vercel.app/api/auth/callback/github`
- [ ] Update application

### Production Testing
- [ ] Can access deployed URL
- [ ] Login page loads correctly
- [ ] Can register new account with Google
- [ ] Can register new account with GitHub
- [ ] Can create posts
- [ ] Can like posts
- [ ] Can reply to posts
- [ ] Can repost
- [ ] Can follow/unfollow
- [ ] Profile pages work
- [ ] Edit profile works
- [ ] Real-time updates work (test with 2 devices)
- [ ] Drafts save and load
- [ ] Images load (avatars, banners)
- [ ] Navigation works (home, profile, post detail)
- [ ] Back button works
- [ ] Logout works

### Documentation Updates
- [ ] Update README.md with deployed URL
- [ ] Update README.md with actual REG_KEY
- [ ] Commit and push documentation updates

### Final Verification
- [ ] Create 2 test accounts
- [ ] Test all features between accounts
- [ ] Verify real-time updates
- [ ] Check console for errors (F12)
- [ ] Test on mobile device (optional)

## 🐛 Common Issues & Solutions

### Build Fails on Vercel
- **Issue:** Missing environment variables
- **Solution:** Double-check all env vars are added in Vercel settings

### OAuth Login Fails
- **Issue:** Redirect URI mismatch
- **Solution:** Ensure redirect URI exactly matches: `https://your-project.vercel.app/api/auth/callback/<provider>`

### Database Connection Error
- **Issue:** Can't connect to MongoDB
- **Solution:** 
  1. Check MONGODB_URI is correct
  2. Verify IP whitelist includes 0.0.0.0/0
  3. Ensure database user credentials are correct

### Real-time Updates Not Working
- **Issue:** Pusher events not received
- **Solution:**
  1. Verify all Pusher credentials are correct
  2. Check cluster matches
  3. Open Pusher Debug Console to see events

### Registration Key Invalid
- **Issue:** Can't register new account
- **Solution:** Ensure REG_KEY in Vercel matches what you're using

## 📊 Performance Checklist

- [ ] Lighthouse score > 80 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Lighthouse score > 90 (SEO)
- [ ] No console errors in production
- [ ] All images load within 2 seconds
- [ ] Page transitions are smooth
- [ ] Real-time updates appear within 1 second

## 📝 Documentation Checklist

Ensure these files are complete and accurate:

- [ ] README.md - Deployed URL filled in
- [ ] README.md - REG_KEY documented
- [ ] SETUP_GUIDE.md - All steps accurate
- [ ] ENV_TEMPLATE.md - All variables listed
- [ ] QUICK_START.md - Instructions clear
- [ ] FEATURES.md - All features documented

## 🎉 Launch Checklist

Final steps before sharing:

- [ ] All tests pass
- [ ] No console errors
- [ ] Documentation complete
- [ ] Deployed URL works
- [ ] REG_KEY provided to reviewers
- [ ] Test accounts created
- [ ] Demo data added (optional)
- [ ] Screenshot taken for README (optional)
- [ ] Video demo recorded (optional)

## 📞 Pre-Launch Testing Matrix

Test these scenarios before launch:

| Feature | Tested | Works | Notes |
|---------|--------|-------|-------|
| Register with Google | ☐ | ☐ | |
| Register with GitHub | ☐ | ☐ | |
| Login returning user | ☐ | ☐ | |
| Create post | ☐ | ☐ | |
| Like post | ☐ | ☐ | |
| Unlike post | ☐ | ☐ | |
| Reply to post | ☐ | ☐ | |
| Repost | ☐ | ☐ | |
| Delete own post | ☐ | ☐ | |
| Follow user | ☐ | ☐ | |
| Unfollow user | ☐ | ☐ | |
| Edit profile | ☐ | ☐ | |
| Save draft | ☐ | ☐ | |
| Load draft | ☐ | ☐ | |
| Real-time like count | ☐ | ☐ | |
| Real-time reply count | ☐ | ☐ | |
| Real-time repost count | ☐ | ☐ | |
| All tab feed | ☐ | ☐ | |
| Following tab feed | ☐ | ☐ | |
| Profile posts tab | ☐ | ☐ | |
| Profile likes tab | ☐ | ☐ | |
| Post detail page | ☐ | ☐ | |
| Logout | ☐ | ☐ | |

## ✅ Ready to Launch?

If all items above are checked, you're ready to:
1. Share the deployed URL
2. Provide the REG_KEY to reviewers
3. Monitor for any issues
4. Respond to feedback

---

**Congratulations on deploying ChirpNest! 🎉**

