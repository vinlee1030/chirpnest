# 🚀 Deployment Verification Checklist

Use this checklist to ensure your ChirpNest project is ready for deployment to Vercel.

## ✅ Pre-Deployment Checks

### 1. File Structure ✅
- [x] `package.json` exists and has all dependencies
- [x] `next.config.js` exists
- [x] `tsconfig.json` exists
- [x] `tailwind.config.js` exists
- [x] `.gitignore` exists and is properly configured
- [x] `README.md` exists with deployment instructions

### 2. `.gitignore` Verification ✅

Your `.gitignore` file should include:
- [x] `.env` and `.env*.local` files
- [x] `node_modules/`
- [x] `.next/`
- [x] `.vercel`
- [x] TypeScript build files
- [x] Debug logs

**Current Status:** ✅ Your `.gitignore` is properly configured!

### 3. Environment Variables Checklist

Before deploying, make sure you have all these values ready:

#### Required Environment Variables:
- [ ] `NEXTAUTH_URL` - Will be `https://YOUR_PROJECT_NAME.vercel.app`
- [ ] `NEXTAUTH_SECRET` - Generated secret (use `openssl rand -base64 32`)
- [ ] `REG_KEY` - Registration key (default: `chirpnest2024`)
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GITHUB_ID` - From GitHub OAuth App
- [ ] `GITHUB_SECRET` - From GitHub OAuth App
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `PUSHER_APP_ID` - From Pusher dashboard
- [ ] `PUSHER_KEY` - From Pusher dashboard
- [ ] `PUSHER_SECRET` - From Pusher dashboard
- [ ] `PUSHER_CLUSTER` - From Pusher dashboard (e.g., `ap3`)
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

### 4. Code Quality Checks

Run these commands before deploying:

```bash
# Install dependencies
npm install

# Check for TypeScript errors
npm run build

# Check for linting errors
npm run lint
```

- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build completes successfully
- [ ] All dependencies installed

### 5. Security Checks

- [ ] No `.env` file is committed to Git (check with `git status`)
- [ ] No API keys or secrets in code
- [ ] All sensitive data is in environment variables
- [ ] `.gitignore` properly excludes sensitive files

**Verify with:**
```bash
git status
# Should NOT show .env files
```

### 6. OAuth Configuration

Before deployment, prepare to update these after getting your Vercel URL:

#### Google OAuth:
- [ ] Google Cloud Console project created
- [ ] OAuth 2.0 Client ID created
- [ ] Localhost redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] **After deployment:** Add Vercel redirect URI

#### GitHub OAuth:
- [ ] GitHub OAuth App created
- [ ] Localhost callback URL added: `http://localhost:3000/api/auth/callback/github`
- [ ] **After deployment:** Add Vercel callback URL

### 7. Third-Party Services

#### MongoDB Atlas:
- [ ] Database cluster created
- [ ] Database user created with read/write permissions
- [ ] Network Access allows all IPs (`0.0.0.0/0`) or Vercel IPs
- [ ] Connection string ready

#### Pusher:
- [ ] Pusher app created
- [ ] App ID, Key, Secret, and Cluster noted
- [ ] App is active

#### Cloudinary:
- [ ] Cloudinary account created
- [ ] Cloud name, API key, and API secret noted
- [ ] Upload preset configured (if needed)

### 8. Git Repository Status

```bash
# Check what will be committed
git status

# Verify no sensitive files
git ls-files | grep -E "\.env|\.secret|\.key"
# Should return nothing
```

- [ ] All code is committed
- [ ] No sensitive files in staging
- [ ] Ready to push to GitHub

### 9. Build Test

Test the production build locally:

```bash
# Build for production
npm run build

# Start production server
npm start
```

- [ ] Build succeeds without errors
- [ ] Production server starts successfully
- [ ] App loads in browser at `http://localhost:3000`

### 10. Functionality Test

Before deploying, test these features locally:

- [ ] Login/Registration works
- [ ] Can create posts
- [ ] Image upload works
- [ ] YouTube video embedding works
- [ ] Emoji reactions work
- [ ] Real-time updates work (Pusher)
- [ ] Search works
- [ ] Dark mode works
- [ ] All pages load correctly

---

## 📋 Quick Verification Commands

Run these commands in your project directory:

```bash
# 1. Check for uncommitted .env files
git status | grep -E "\.env"

# 2. Verify .gitignore is working
git check-ignore .env
# Should output: .env

# 3. Test build
npm run build

# 4. Check for TypeScript errors
npx tsc --noEmit

# 5. Check for linting errors
npm run lint

# 6. Verify all dependencies are installed
npm list --depth=0
```

---

## 🚨 Common Issues to Check

### Issue: `.env` file might be committed
**Solution:**
```bash
# Remove from Git if accidentally added
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Issue: Build fails locally
**Solution:**
- Check for TypeScript errors
- Verify all dependencies are installed
- Check `next.config.js` for issues

### Issue: Missing dependencies
**Solution:**
```bash
npm install
npm run build
```

---

## ✅ Final Pre-Deployment Checklist

Before pushing to GitHub and deploying:

- [ ] All code changes committed
- [ ] `.gitignore` properly configured
- [ ] No `.env` files in Git
- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables documented
- [ ] OAuth apps ready for redirect URI updates
- [ ] Third-party services configured
- [ ] README updated with deployment instructions
- [ ] Ready to push to GitHub

---

## 🎯 Next Steps

Once all checks pass:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Follow the detailed guide in `README.md`
   - Add all environment variables
   - Update OAuth redirect URIs after deployment

3. **Verify Deployment:**
   - Test all features on live site
   - Check Vercel logs for errors
   - Update README with live URL

---

**Status:** Ready to deploy! ✅

