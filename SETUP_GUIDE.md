# Complete Setup Guide for ChirpNest

This guide will walk you through setting up all third-party services needed for ChirpNest.

## Prerequisites

- Node.js 18+ installed
- A code editor (VS Code recommended)
- A terminal/command prompt

## Step 1: Install Dependencies

```bash
cd "My Hw5"
npm install
```

## Step 2: Create .env File

Create a new file named `.env` in the project root (same level as `package.json`).

Copy the contents from `ENV_TEMPLATE.md` and follow the steps below to fill in each value.

## Step 3: Generate NextAuth Secret

Open your terminal and run:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET` in your `.env` file.

## Step 4: Set Up Google OAuth

### A. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click "New Project"
5. Enter a project name (e.g., "ChirpNest")
6. Click "Create"

### B. Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### C. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth Client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: ChirpNest
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Skip (click "Save and Continue")
   - Test users: Add your email
   - Click "Save and Continue"
4. Back to creating OAuth Client ID:
   - Application type: **Web application**
   - Name: ChirpNest Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - (Add production URL later: `https://your-app.vercel.app/api/auth/callback/google`)
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**
7. Paste them in your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_secret_here
   ```

## Step 5: Set Up GitHub OAuth

### A. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" in the left sidebar
3. Click "New OAuth App"
4. Fill in the form:
   - **Application name:** ChirpNest
   - **Homepage URL:** `http://localhost:3000`
   - **Application description:** (Optional) A Twitter-like social platform
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
5. Click "Register application"
6. On the next page, copy the **Client ID**
7. Click "Generate a new client secret"
8. Copy the **Client secret** (you won't be able to see it again!)
9. Paste them in your `.env` file:
   ```
   GITHUB_ID=your_github_client_id_here
   GITHUB_SECRET=your_github_client_secret_here
   ```

## Step 6: Set Up MongoDB Atlas

### A. Create an Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with your email or Google account

### B. Create a Cluster

1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0)
3. Select a cloud provider and region (choose one closest to you)
4. Cluster Name: Leave default or name it "ChirpNest"
5. Click "Create"

### C. Create a Database User

1. You'll see a "Security Quickstart" screen
2. Choose "Username and Password"
3. Create a username (e.g., `chirpnest_user`)
4. Click "Autogenerate Secure Password" or create your own
5. **IMPORTANT:** Copy this password somewhere safe!
6. Click "Create User"

### D. Set Up Network Access

1. In the "Where would you like to connect from?" section
2. Click "Add My Current IP Address"
3. **IMPORTANT for Vercel:** Also click "Add a Different IP Address"
4. Enter `0.0.0.0/0` (allows access from anywhere - needed for Vercel)
5. Click "Finish and Close"

### E. Get Connection String

1. Click "Go to Databases"
2. On your cluster, click "Connect"
3. Click "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://...`)
5. Replace `<password>` with the password you created earlier
6. Replace `<dbname>` with your database name (e.g., `chirpnest`)
7. Paste it in your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://chirpnest_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/chirpnest?retryWrites=true&w=majority
   ```

## Step 7: Set Up Pusher Channels

### A. Create a Pusher Account

1. Go to [Pusher](https://pusher.com/)
2. Click "Sign up"
3. Sign up with your email or GitHub account

### B. Create a Channels App

1. After logging in, you'll see the dashboard
2. Click "Create app"
3. Fill in the form:
   - **Name your app:** ChirpNest
   - **Select a cluster:** Choose one close to you (e.g., `ap3` for Asia-Pacific, `us2` for US)
   - **Create apps for multiple environments?** No (for now)
   - **Tech stack:**
     - Frontend: React
     - Backend: Node.js
4. Click "Create app"

### C. Get App Credentials

1. You'll be on the "App Keys" page
2. Copy the following values:
   - `app_id`
   - `key`
   - `secret`
   - `cluster`
3. Paste them in your `.env` file:
   ```
   PUSHER_APP_ID=123456
   PUSHER_KEY=abcdef123456
   PUSHER_SECRET=xyz789secret
   PUSHER_CLUSTER=ap3
   ```

## Step 8: Set Other Environment Variables

In your `.env` file, also set:

```bash
NEXTAUTH_URL=http://localhost:3000
REG_KEY=ChirpNest2024SecureKey
```

## Step 9: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 10: Test Registration

1. Go to http://localhost:3000
2. You'll be redirected to `/login`
3. Click "Register here"
4. Enter a userID (e.g., `test_user`)
5. Choose either "Register with Google" or "Register with GitHub"
6. Complete the OAuth flow
7. You should be redirected to `/home` with your account created!

Congratulations! 🎉 Your ChirpNest is now running locally.

## Next Steps

- Create another account with a different provider to test follow/like features
- Test real-time updates by opening two browser windows
- Deploy to Vercel (see README.md for deployment guide)

## Common Issues

### "Invalid client" error from Google

- Make sure your redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- Check that the Client ID and Secret are correct in `.env`

### "MongoServerError: bad auth"

- Double-check your MongoDB password in the connection string
- Make sure there are no special characters that need URL encoding

### Pusher events not showing

- Verify all Pusher credentials are correct
- Check the cluster matches (e.g., `ap3`)
- Open Pusher Debug Console to see if events are being sent

### "UserID already taken"

- Choose a different userID during registration

## Need Help?

Check the README.md troubleshooting section or create an issue on GitHub.

