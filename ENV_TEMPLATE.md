# Environment Variables Template

Create a file named `.env` in the root directory and add these variables:

```bash
# NextAuth Configuration
# =====================
# For local development: http://localhost:3000
# For production: https://your-vercel-domain.vercel.app
NEXTAUTH_URL=http://localhost:3000
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=REPLACE_WITH_SECRET

# Google OAuth
# ============
# 1. Go to: https://console.cloud.google.com/
# 2. Create a new project or select existing
# 3. Enable "Google+ API"
# 4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
# 5. Application type: Web application
# 6. Add Authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google
#    - https://your-vercel-domain.vercel.app/api/auth/callback/google
GOOGLE_CLIENT_ID=692699554365-6g5oalva194m91dajof0svvbbflr2lbr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=REPLACE_ME

# GitHub OAuth
# ============
# 1. Go to: https://github.com/settings/developers
# 2. Click "New OAuth App"
# 3. Application name: ChirpNest (or your choice)
# 4. Homepage URL: http://localhost:3000 (or your domain)
# 5. Authorization callback URL:
#    - http://localhost:3000/api/auth/callback/github
#    - https://your-vercel-domain.vercel.app/api/auth/callback/github
GITHUB_ID=REPLACE_ME
GITHUB_SECRET=REPLACE_ME

# MongoDB Atlas
# =============
# 1. Go to: https://www.mongodb.com/cloud/atlas
# 2. Create a free cluster
# 3. Database Access → Add Database User (username/password)
# 4. Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)
# 5. Connect → Connect your application → Copy connection string
# 6. Replace <password> with your database user password
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Pusher Channels
# ===============
# 1. Go to: https://pusher.com/
# 2. Create account and new Channels app
# 3. Choose cluster closest to your users (e.g., ap3 for Asia-Pacific)
# 4. Copy credentials from "App Keys" tab
PUSHER_APP_ID=REPLACE_ME
PUSHER_KEY=REPLACE_ME
PUSHER_SECRET=REPLACE_ME
PUSHER_CLUSTER=ap3

# Cloudinary (Image Upload)
# =========================
# 1. Go to: https://cloudinary.com/
# 2. Sign up for free account
# 3. Go to Dashboard
# 4. Copy these values from "Account Details":
#    - Cloud Name
#    - API Key
#    - API Secret
CLOUDINARY_CLOUD_NAME=REPLACE_ME
CLOUDINARY_API_KEY=REPLACE_ME
CLOUDINARY_API_SECRET=REPLACE_ME
```

## Quick Copy-Paste Version

Copy this to your `.env` file and replace the placeholder values:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
MONGODB_URI=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=ap3
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

