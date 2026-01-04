# Quick Deployment Guide 🚀

## Deploy to Vercel in 5 Minutes

### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (free tier works)

---

## Step-by-Step Guide

### 1. Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables (see below)
6. Click **"Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketplace
JWT_SECRET=generate-a-random-32-character-string-here
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configure MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → Add IP Address
3. Add `0.0.0.0/0` (allows all IPs - for testing)
4. Or add Vercel's IP ranges (more secure)

### 5. Redeploy

After adding environment variables:
- Go to Vercel Dashboard → Deployments
- Click **"..."** → **"Redeploy"**

---

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Test registration/login
3. Test creating a product
4. Check browser console for errors

---

## ⚠️ Important Notes

### Socket.io Limitation
- **Real-time chat won't work** on Vercel (serverless limitation)
- All other features work normally
- For Socket.io, use Railway/Render instead

### Environment Variables
- Must redeploy after adding/updating variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### MongoDB
- Make sure IP is whitelisted
- Check connection string is correct
- Free tier has connection limits

---

## 🎉 You're Done!

Your app is now live on Vercel! 

**Next Steps:**
- Test all features
- Set up custom domain (optional)
- Monitor usage in Vercel dashboard
- Consider Railway for Socket.io support

---

## 🆘 Need Help?

- Check Vercel logs in dashboard
- Review deployment errors
- Test locally with `npm run build && npm run start`
- Check MongoDB connection

