# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information (App name, User support email, etc.)
   - Add your email to test users
   - Save and continue through the scopes and test users screens

6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Marketplace App (or your preferred name)
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production URL (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - Your production URL (e.g., `https://yourdomain.com`)

7. Copy your **Client ID** (it looks like: `123456789-abc123def456.apps.googleusercontent.com`)

## Step 2: Add to Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Important:** 
- `GOOGLE_CLIENT_ID` is used on the server-side (API routes)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is used on the client-side (React components)

## Step 3: Install Dependencies

The required package (`google-auth-library`) is already in `package.json`. If you haven't installed it yet:

```bash
npm install
```

## Step 4: Test

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login or register page
3. You should see a "Sign in with Google" button
4. Click it and test the Google Sign In flow

## Features

✅ **Automatic Account Creation**: New users are automatically created when they sign in with Google
✅ **Account Linking**: If a user already exists with the same email, their Google account is linked
✅ **Avatar Sync**: Google profile picture is automatically used as avatar
✅ **Seamless Integration**: Works alongside email/password authentication

## Troubleshooting

### Button doesn't appear
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
- Restart your development server after adding environment variables
- Check browser console for errors

### "Invalid client" error
- Verify your Client ID is correct
- Make sure the authorized JavaScript origins include your current URL
- Check that you're using the correct Client ID (not Client Secret)

### "Access blocked" error
- Make sure your email is added to test users in OAuth consent screen
- Verify the OAuth consent screen is published (for production)

## Production Deployment

Before deploying to production:

1. Update OAuth consent screen:
   - Add your production domain
   - Publish the app (if not in testing mode)

2. Update Authorized JavaScript origins:
   - Add your production URL
   - Remove `http://localhost:3000` (optional, but recommended)

3. Update environment variables in your hosting platform:
   - Add `GOOGLE_CLIENT_ID`
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

4. Test the Google Sign In flow in production

## Security Notes

- Never commit your Client ID to version control (it's already in `.gitignore`)
- The Client ID is safe to expose in client-side code (it's public)
- Never expose your Client Secret (not needed for this implementation)

