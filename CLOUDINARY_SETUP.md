# Cloudinary Setup Guide

Cloudinary is used for image uploads in ChirpNest. Follow these steps to set it up:

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click **"Sign Up for Free"**
3. You can sign up with:
   - Email
   - Google account
   - GitHub account

## Step 2: Get Your Credentials

After signing up and logging in:

1. You'll be on the **Dashboard** page
2. Look for the section titled **"Product Environment Credentials"** or **"Account Details"**
3. You'll see three values:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuv-xyz123`)

### Screenshot Reference:

The credentials section looks like this:

```
Product Environment Credentials
--------------------------------
Cloud name:  dxxxxxx
API Key:     123456789012345
API Secret:  ************************  [Reveal]
```

Click **"Reveal"** next to API Secret to see the full secret.

## Step 3: Add to .env File

Open your `.env` file and add these lines:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Example:

```bash
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuv-xyz123
```

## Step 4: Test the Upload

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000
3. Login to your account
4. On the Home page, click the **🖼️ image icon** next to the post composer
5. Select an image from your computer
6. The image should upload and show a preview
7. Click **Post** to publish

## Features

- **Upload Limit:** Up to 4 images per post
- **File Size:** Max 5MB per image
- **Supported Formats:** JPG, PNG, GIF, WebP
- **Storage:** Free tier includes 25GB storage and 25GB monthly bandwidth
- **Automatic Optimization:** Cloudinary automatically optimizes images

## Troubleshooting

### Error: "Failed to upload image"

**Possible Causes:**
1. Credentials in `.env` are incorrect
2. File size exceeds 5MB
3. File is not an image format

**Solution:**
- Double-check your Cloudinary credentials
- Make sure to restart server after adding credentials
- Check browser console (F12) for detailed error messages

### Error: "Invalid cloud name"

**Solution:**
- Make sure `CLOUDINARY_CLOUD_NAME` matches exactly what's shown in your dashboard
- No extra spaces or quotes

### Images not showing

**Solution:**
- Check that the image was successfully uploaded (check Cloudinary Dashboard → Media Library)
- Make sure `next.config.js` allows Cloudinary domain (should be automatic with `hostname: '**'`)

## Vercel Deployment

When deploying to Vercel, remember to add the same three environment variables in your Vercel project settings:

1. Go to your project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Redeploy your project

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Cloudinary Media Library](https://cloudinary.com/console/media_library) - View uploaded images

## Free Tier Limits

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **Images:** Unlimited

This is more than enough for a small social media app!

---

**Need help?** Check the [Cloudinary Community](https://community.cloudinary.com/) or the main README troubleshooting section.

