# Marketplace - Buy & Sell Used Products

A modern, full-featured marketplace platform for buying and selling used products, built with Next.js, TypeScript, MongoDB, and Socket.io.

## Features

### Core Features
- ✅ User Authentication (Register, Login, JWT-based)
- ✅ Product Listings (Create, View, Search, Filter)
- ✅ Real-time Live Chat between buyers and sellers
- ✅ User Dashboard (Manage listings, view account)
- ✅ Product Categories and Search
- ✅ Location-based filtering
- ✅ Responsive, minimal UI/UX design

### Key Pages
- **Home**: Browse products with search and category filters
- **Product Detail**: View product details, contact seller
- **Create Listing**: Post new products for sale
- **Dashboard**: Manage your listings and account
- **Chat**: Real-time messaging with other users
- **Authentication**: Secure login and registration

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd custom-product-personalization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/marketplace
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, use your connection string in `MONGODB_URI`.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product endpoints
│   │   └── chat/         # Chat endpoints
│   ├── chat/             # Chat pages
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── products/         # Product pages
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── Navbar.tsx
│   ├── ProductList.tsx
│   ├── SearchBar.tsx
│   └── CategoryFilter.tsx
├── models/               # MongoDB models
│   ├── User.ts
│   ├── Product.ts
│   └── Chat.ts
├── lib/                  # Utility functions
│   ├── db.ts            # Database connection
│   └── auth.ts          # Authentication helpers
└── pages/               # Additional pages (Socket.io)
    └── api/
        └── socket.ts    # Socket.io server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `DELETE /api/products/[id]` - Delete product

### Chat
- `GET /api/chat` - Get user's chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/[id]/messages` - Get chat messages
- `POST /api/chat/[id]/messages` - Send message

## Features in Detail

### Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- Protected routes
- Session management with HTTP-only cookies

### Product Management
- Create, read, update, delete products
- Image upload support (ready for Cloudinary integration)
- Category and location filtering
- Full-text search
- Price range filtering
- Product views tracking

### Live Chat
- Real-time messaging with Socket.io
- Chat rooms per product
- Message history
- Online/offline status (ready for implementation)
- Notification system (ready for implementation)

### User Experience
- Responsive design (mobile, tablet, desktop)
- Minimal, clean UI
- Fast page loads
- Smooth animations
- Error handling and user feedback

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXT_PUBLIC_API_URL` | Public API URL | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |

## Future Enhancements

- [ ] Image upload to Cloudinary
- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced search filters
- [ ] Product favorites/wishlist
- [ ] Rating and review system
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Product recommendations
- [ ] Social sharing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, email support@marketplace.com or create an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript

