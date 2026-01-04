/**
 * Add Demo Products Script
 * This script adds sample products to the database for testing
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Product Schema (simplified for script)
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  condition: String,
  images: [String],
  location: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'active' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const demoProducts = [
  {
    title: 'iPhone 13 Pro Max 256GB - Excellent Condition',
    description: 'Selling my iPhone 13 Pro Max in excellent condition. Bought 6 months ago, always used with case and screen protector. No scratches, battery health 95%. Comes with original box, charger, and cable. No issues whatsoever.',
    price: 85000,
    category: 'Electronics',
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
    location: 'Dhaka',
    status: 'active',
  },
  {
    title: 'Samsung 55" 4K Smart TV - Like New',
    description: 'Samsung 55-inch 4K UHD Smart TV. Used for only 3 months, moving abroad so selling. Perfect condition, all accessories included. Remote, stand, and original box included.',
    price: 65000,
    category: 'Electronics',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'],
    location: 'Chittagong',
    status: 'active',
  },
  {
    title: 'Wooden Dining Table Set (6 Chairs)',
    description: 'Beautiful solid wood dining table with 6 matching chairs. Great condition, well maintained. Perfect for family dinners. Table size: 6ft x 3ft. Chairs are comfortable and sturdy.',
    price: 25000,
    category: 'Furniture',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'],
    location: 'Sylhet',
    status: 'active',
  },
  {
    title: 'Nike Air Max 270 - Size 9, Brand New',
    description: 'Brand new Nike Air Max 270, never worn. Bought as gift but wrong size. Original box and tags included. Size 9 US.',
    price: 8500,
    category: 'Clothing',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    location: 'Rajshahi',
    status: 'active',
  },
  {
    title: 'Honda Civic 2018 - Well Maintained',
    description: 'Honda Civic 2018 model, excellent condition. Regular service maintained, all documents available. Mileage: 45,000 km. No accidents, single owner. Test drive welcome.',
    price: 1850000,
    category: 'Vehicles',
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500'],
    location: 'Dhaka',
    status: 'active',
  },
  {
    title: 'Complete Harry Potter Book Set (7 Books)',
    description: 'Complete Harry Potter collection, all 7 books in excellent condition. Hardcover edition, well maintained. Perfect for collectors or readers.',
    price: 3500,
    category: 'Books',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    location: 'Khulna',
    status: 'active',
  },
  {
    title: 'Yamaha Acoustic Guitar - Professional Grade',
    description: 'Yamaha F310 acoustic guitar in excellent condition. Perfect for beginners and intermediate players. Comes with case, picks, and extra strings. Well maintained, no damage.',
    price: 12000,
    category: 'Sports',
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=500'],
    location: 'Barisal',
    status: 'active',
  },
  {
    title: 'LEGO Star Wars Set - Unopened',
    description: 'LEGO Star Wars Millennium Falcon set, brand new and unopened. Perfect gift for kids or collectors. Original sealed box.',
    price: 15000,
    category: 'Toys',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    location: 'Rangpur',
    status: 'active',
  },
  {
    title: 'Sofa Set (3+2) - Comfortable and Modern',
    description: 'Modern 3+2 seater sofa set in excellent condition. Very comfortable, perfect for living room. Color: Beige. Well maintained, no stains or damage.',
    price: 35000,
    category: 'Furniture',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
    location: 'Mymensingh',
    status: 'active',
  },
  {
    title: 'MacBook Pro 14" M1 Chip - 512GB',
    description: 'MacBook Pro 14-inch with M1 chip, 512GB storage. Excellent condition, battery cycle count: 45. Perfect for work or creative projects. Original charger and box included.',
    price: 120000,
    category: 'Electronics',
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    location: 'Dhaka',
    status: 'active',
  },
  {
    title: 'Designer Leather Jacket - Size M',
    description: 'Genuine leather jacket, excellent quality. Size Medium, perfect fit. Worn only a few times, like new condition. Great style and durability.',
    price: 12000,
    category: 'Clothing',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    location: 'Chittagong',
    status: 'active',
  },
  {
    title: 'Gaming Chair - Ergonomic and Comfortable',
    description: 'High-quality gaming/office chair with ergonomic design. Adjustable height, lumbar support, and headrest. Very comfortable for long hours. Excellent condition.',
    price: 18000,
    category: 'Furniture',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500'],
    location: 'Sylhet',
    status: 'active',
  },
];

async function addDemoProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a demo user
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
    }));

    let demoUser = await User.findOne({ email: 'demo@marketplace.com' });
    
    if (!demoUser) {
      console.log('📝 Creating demo user...');
      demoUser = await User.create({
        name: 'Demo Seller',
        email: 'demo@marketplace.com',
      });
      console.log('✅ Demo user created');
    }

    // Clear existing demo products (optional - comment out if you want to keep them)
    // await Product.deleteMany({ seller: demoUser._id });
    // console.log('🗑️  Cleared existing demo products');

    // Add demo products
    console.log(`\n📦 Adding ${demoProducts.length} demo products...`);
    
    for (const product of demoProducts) {
      const newProduct = new Product({
        ...product,
        seller: demoUser._id,
      });
      await newProduct.save();
      console.log(`✅ Added: ${product.title}`);
    }

    console.log(`\n✨ Successfully added ${demoProducts.length} demo products!`);
    console.log('🚀 You can now view them on the homepage');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

addDemoProducts();

