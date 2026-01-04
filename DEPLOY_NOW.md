# 🚀 Deploy to Vercel - Quick Start

## ⚠️ CRITICAL: Socket.io Limitation

**Your app uses Socket.io with a custom server** (`server.js`). Vercel's serverless architecture **does NOT support WebSockets/real-time connections**.

**What will work:**
- ✅ Next.js pages and API routes
- ✅ Authentication
- ✅ Product listings
- ✅ All features EXCEPT real-time chat

**What won't work:**
- ❌ Socket.io real-time chat

**Solutions:**
1. **Deploy to Railway/Render instead** (recommended - supports Socket.io)
2. **Deploy to Vercel + separate Socket.io server**
3. **Remove Socket.io temporarily** for Vercel deployment

---

## Quick Deploy to Vercel (Without Real-time Chat)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy via Vercel Dashboard

1. Go to **[vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Click **"Import"**
5. **Configure:**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Add Environment Variables** (see below)
7. Click **"Deploy"**

### Step 3: Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketplace
JWT_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Redeploy

After adding environment variables:
- Go to **Deployments** tab
- Click **"..."** → **"Redeploy"**

---

## ✅ Done!

Your app is live! Visit your Vercel URL.

**Note:** Real-time chat won't work. All other features work normally.

---

## 🚀 Better Alternative: Deploy to Railway (Supports Socket.io)

Railway supports Socket.io perfectly:

1. Go to **[railway.app](https://railway.app)**
2. Sign up with GitHub
3. **New Project** → Deploy from GitHub
4. Select your repository
5. Add environment variables
6. Deploy!

Railway supports:
- ✅ Custom servers
- ✅ WebSockets
- ✅ Socket.io
- ✅ All features work!

---

## 📚 Full Documentation

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

