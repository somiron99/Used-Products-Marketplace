# Environment Setup

## Quick Setup

Create a `.env.local` file in the root directory with the following content:

```env
MONGODB_URI=mongodb+srv://used:LblJtseQSRaZc0aC@used.qne5oxt.mongodb.net/marketplace?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
NEXT_PUBLIC_API_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Your MongoDB Details

- **Connection String**: `mongodb+srv://used:LblJtseQSRaZc0aC@used.qne5oxt.mongodb.net/`
- **Project ID**: `695a2c6c259c243c27605e7e`
- **Database Name**: `marketplace` (will be created automatically)

## Important Notes

1. **Security Warning**: Your MongoDB credentials are visible. Consider:
   - Rotating your password after setup
   - Using environment variables in production
   - Never commit `.env.local` to version control (it's already in .gitignore)

2. **JWT Secret**: Generate a strong random string for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **MongoDB Atlas**: Make sure your IP address is whitelisted in MongoDB Atlas:
   - Go to Network Access in MongoDB Atlas
   - Add your IP address or use `0.0.0.0/0` for development (not recommended for production)

## Testing Connection

After setting up `.env.local`, run:
```bash
npm run dev
```

The app will automatically connect to your MongoDB Atlas database.

