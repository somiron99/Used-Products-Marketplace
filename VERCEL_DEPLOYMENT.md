# Vercel Deployment Guide

## ⚠️ Important Note About Socket.io

This application uses **Socket.io with a custom server** (`server.js`). Vercel's serverless architecture has limitations with WebSocket connections. Here are your options:

### Option 1: Deploy to Vercel (Recommended for MVP)
- ✅ Next.js app will work
- ✅ API routes will work
- ⚠️ Socket.io real-time chat may not work reliably (serverless limitations)
- ✅ All other features work normally

### Option 2: Deploy Socket.io Separately (Recommended for Production)
- Deploy main app to Vercel
- Deploy Socket.io server to Railway/Render (separate service)
- Update `NEXT_PUBLIC_API_URL` to point to Socket.io server

### Option 3: Use Alternative Platforms (Best for Real-time)
- Railway (recommended - supports WebSockets)
- Render (supports WebSockets)
- DigitalOcean App Platform
- AWS EC2/Elastic Beanstalk

---

## 🚀 Quick Deployment to Vercel

### Step 1: Prepare Your Code

1. **Fix Build Errors** (if any)
   ```bash
   npm run build
   ```
   Fix any TypeScript errors before deploying.

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Method A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Method B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up or log in
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your GitHub account
   - Select your repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

4. **Add Environment Variables** (see below)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

---

## 🔐 Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

### Required Variables

```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

### Optional Variables

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_ID=your-google-client-id
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## ⚙️ Vercel Configuration

Since you're using a custom server, you'll need to modify the deployment. However, Vercel works best with Next.js API routes. 

### Option A: Use Vercel's Next.js (Without Custom Server)

Create a `vercel.json` for API-only deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

**Note:** This won't work with your current `server.js` setup. You'll need to remove Socket.io or deploy it separately.

### Option B: Keep Custom Server (Limited Support)

Vercel doesn't officially support custom Node.js servers. For Socket.io, consider:

1. **Deploy Socket.io separately** to Railway/Render
2. **Update client** to connect to separate Socket.io server
3. **Deploy Next.js app** to Vercel

---

## 🔄 Recommended Deployment Architecture

For a production app with Socket.io:

```
┌─────────────────┐
│   Vercel        │
│   (Next.js App) │
│   - Pages       │
│   - API Routes  │
└────────┬────────┘
         │
         │ HTTP API calls
         │
┌────────▼────────┐
│   Railway/Render│
│   (Socket.io)   │
│   - WebSockets  │
│   - Real-time   │
└─────────────────┘
         │
         │
┌────────▼────────┐
│  MongoDB Atlas  │
│   (Database)    │
└─────────────────┘
```

---

## 📝 Deployment Checklist

Before deploying:

- [ ] All environment variables are set
- [ ] MongoDB Atlas IP whitelist includes Vercel IPs (0.0.0.0/0 for testing)
- [ ] JWT_SECRET is strong and secure
- [ ] NEXT_PUBLIC_API_URL matches your Vercel domain
- [ ] Build completes successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] Test locally with production build (`npm run start`)

---

## 🧪 Testing Deployment

After deployment:

1. **Visit your Vercel URL**
   - Should see your app loading
   - Check browser console for errors

2. **Test Authentication**
   - Register a new user
   - Login
   - Check if cookies are set

3. **Test Features**
   - Browse products
   - Create a product
   - View product details
   - Check dashboard

4. **Test Socket.io** (if applicable)
   - Try starting a chat
   - May not work due to serverless limitations

---

## 🐛 Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Fix TypeScript errors** locally first
3. **Check environment variables** are set correctly
4. **Verify Node.js version** (Vercel uses Node 18.x by default)

### MongoDB Connection Issues

1. **Check MongoDB Atlas IP whitelist**
   - Add `0.0.0.0/0` for testing (not secure for production)
   - Or add Vercel's IP ranges

2. **Verify MONGODB_URI** is correct
   - Should include database name
   - Should include authentication

3. **Check MongoDB Atlas connection limits**
   - Free tier has connection limits

### Environment Variables Not Working

1. **Redeploy** after adding variables
2. **Check variable names** match exactly
3. **Use NEXT_PUBLIC_** prefix for client-side variables
4. **Redeploy** - environment variables require a new deployment

### Socket.io Not Working

This is expected with Vercel's serverless architecture. Options:

1. **Deploy Socket.io separately** (Railway/Render)
2. **Use alternative platform** that supports WebSockets
3. **Remove real-time features** temporarily

---

## 🌐 Custom Domain

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Add your domain**
3. **Update DNS records** as instructed
4. **Update NEXT_PUBLIC_API_URL** to your custom domain
5. **Redeploy**

---

## 📊 Monitoring

Vercel provides:
- **Analytics** (paid plans)
- **Logs** in dashboard
- **Deployment history**
- **Performance metrics**

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

Just push to GitHub:
```bash
git push origin main
```

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel (follow steps above)
2. ⚠️ Test all features (except Socket.io)
3. 🔄 If Socket.io is critical, deploy separately to Railway/Render
4. 🔒 Set up proper MongoDB IP whitelisting
5. 🎨 Custom domain (optional)
6. 📊 Set up monitoring

---

## 🚀 Alternative: Railway Deployment (Supports Socket.io)

If you need Socket.io to work, consider Railway:

1. **Sign up at [railway.app](https://railway.app)**
2. **Connect GitHub**
3. **New Project** → Deploy from GitHub
4. **Select repository**
5. **Add environment variables**
6. **Deploy**

Railway supports:
- ✅ Custom Node.js servers
- ✅ WebSockets
- ✅ Persistent connections
- ✅ Socket.io works perfectly

---

**Ready to deploy? Follow the steps above!** 🎉

