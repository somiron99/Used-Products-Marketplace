# Quick Setup Guide

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/marketplace
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   
   Make sure MongoDB is running. You can:
   - Install MongoDB locally
   - Use MongoDB Atlas (cloud)
   - Use Docker: `docker run -d -p 27017:27017 mongo`

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Create an Account**
   - Click "Sign Up" in the navbar
   - Fill in your details
   - You'll be automatically logged in

2. **List Your First Product**
   - Click "Sell" in the navbar
   - Fill in product details
   - Add images (currently using placeholders)
   - Submit

3. **Browse Products**
   - Use the search bar
   - Filter by category
   - Click on any product to view details

4. **Start a Chat**
   - View a product
   - Click "Contact Seller"
   - Start messaging in real-time!

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env.local`
- For MongoDB Atlas, use the connection string from your cluster

### Socket.io Not Working
- Make sure you're using `npm run dev` (not `next dev`)
- Check browser console for connection errors
- Verify `NEXT_PUBLIC_API_URL` matches your server URL

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- These errors should resolve after installation

### Port Already in Use
- Change the port in `server.js` or set `PORT` environment variable
- Or stop the process using port 3000

## Production Deployment

For production, make sure to:
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper MongoDB connection (Atlas recommended)
4. Set up image upload (Cloudinary recommended)
5. Configure CORS properly
6. Use environment variables for all secrets

## Need Help?

Check the main README.md for more detailed information.

