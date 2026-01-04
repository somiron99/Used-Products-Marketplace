# ⚠️ IMPORTANT: Restart Required

## The Error You're Seeing

The error occurs because Next.js caches the configuration file. After updating `next.config.js`, you **MUST** restart your development server.

## How to Fix

1. **Stop the current server:**
   - Press `Ctrl + C` in your terminal where the server is running
   - Or close the terminal window

2. **Restart the server:**
   ```bash
   npm run dev
   ```

3. **Clear browser cache (optional but recommended):**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or clear browser cache

## What Changed

I've updated `next.config.js` to use the modern `remotePatterns` configuration (recommended for Next.js 14) instead of the deprecated `domains` property.

The configuration now allows:
- ✅ `images.unsplash.com` - For demo product images
- ✅ `res.cloudinary.com` - For future image uploads
- ✅ `localhost` - For local development

## After Restart

Once you restart the server, the error should be resolved and all demo product images will load correctly.

---

**Note:** Next.js configuration changes always require a server restart to take effect!

