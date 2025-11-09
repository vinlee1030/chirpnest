# 🔧 OAuth Redirect URI Mismatch - Fix Guide

## 🚨 Your Current Issue

**Error:** `redirect_uri_mismatch` (400 error)

**Problem:** The redirect URI in your OAuth apps doesn't match what NextAuth is sending.

---

## ✅ Correct URLs for Your App

Your app URL: **https://chirpnest.vercel.app**

### Google OAuth Redirect URI:
```
https://chirpnest.vercel.app/api/auth/callback/google
```

### GitHub OAuth Callback URL:
```
https://chirpnest.vercel.app/api/auth/callback/github
```

**⚠️ IMPORTANT:** Must use `https://` NOT `http://`

---

## 🔧 Step-by-Step Fix

### 1. Fix GitHub OAuth (You have the wrong URL!)

**Current (WRONG):**
```
http://chirpnest.vercel.app/api/auth/callback/github  ❌
```

**Correct:**
```
https://chirpnest.vercel.app/api/auth/callback/github  ✅
```

**Steps:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. Find "Authorization callback URL"
4. **Remove** the `http://` version
5. **Add** the `https://` version:
   ```
   https://chirpnest.vercel.app/api/auth/callback/github
   ```
6. Click **Update application**

---

### 2. Fix Google OAuth

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, check:
   - Should have: `https://chirpnest.vercel.app/api/auth/callback/google`
   - **Remove** any `http://` versions
   - **Remove** any localhost versions (unless you need them for local dev)
5. Click **Save**

**Correct Google Redirect URI:**
```
https://chirpnest.vercel.app/api/auth/callback/google
```

---

### 3. Fix Vercel Environment Variable: NEXTAUTH_URL

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `chirpnest` project
3. Go to **Settings** → **Environment Variables**
4. Find `NEXTAUTH_URL`
5. **Update** the value to:
   ```
   https://chirpnest.vercel.app
   ```
6. Make sure it's enabled for **Production**, **Preview**, and **Development**
7. Click **Save**

**⚠️ Important:**
- No trailing slash (`/`)
- Must be `https://` (not `http://`)
- Must match your exact Vercel domain

---

### 4. About NEXTAUTH_SECRET

**You DON'T need to create a new secret!**

- `NEXTAUTH_SECRET` is just a random string used for encryption
- It doesn't depend on your URL
- **Only create a new one if:**
  - You haven't set it yet in Vercel
  - You want to rotate it for security

**If you need to generate one:**
```bash
openssl rand -base64 32
```

Then add it to Vercel environment variables as `NEXTAUTH_SECRET`.

---

## ✅ Complete Checklist

After making changes, verify:

- [ ] **GitHub OAuth Callback URL:**
  - ✅ `https://chirpnest.vercel.app/api/auth/callback/github`
  - ❌ Removed `http://` version

- [ ] **Google OAuth Redirect URI:**
  - ✅ `https://chirpnest.vercel.app/api/auth/callback/google`
  - ❌ Removed `http://` version

- [ ] **Vercel Environment Variable:**
  - ✅ `NEXTAUTH_URL` = `https://chirpnest.vercel.app`
  - ✅ No trailing slash
  - ✅ Enabled for all environments

- [ ] **Redeployed Vercel:**
  - ✅ After updating environment variables, redeploy your project

---

## 🔄 After Making Changes

1. **Wait 1-2 minutes** for OAuth provider changes to propagate
2. **Redeploy on Vercel** (if you changed NEXTAUTH_URL)
3. **Clear browser cache** or use incognito mode
4. **Try logging in again**

---

## 🚨 Common Mistakes

### ❌ Wrong:
```
http://chirpnest.vercel.app/api/auth/callback/github
http://chirpnest.vercel.app/api/auth/callback/google
NEXTAUTH_URL=http://chirpnest.vercel.app
```

### ✅ Correct:
```
https://chirpnest.vercel.app/api/auth/callback/github
https://chirpnest.vercel.app/api/auth/callback/google
NEXTAUTH_URL=https://chirpnest.vercel.app
```

---

## 📝 Summary

**Your app URL:** `https://chirpnest.vercel.app`

**What to fix:**
1. GitHub: Change `http://` → `https://`
2. Google: Ensure `https://` version is added
3. Vercel: Set `NEXTAUTH_URL=https://chirpnest.vercel.app`
4. Redeploy after changes

**You don't need to:**
- ❌ Create a new NEXTAUTH_SECRET (unless you haven't set one)
- ❌ Change any other environment variables

---

After these fixes, OAuth should work! 🎉

