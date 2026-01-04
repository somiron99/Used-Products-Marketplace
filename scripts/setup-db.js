/**
 * Database Setup Script
 * This script tests the MongoDB connection and creates initial indexes
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 Connection string: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Successfully connected to MongoDB!');

    // Test connection by listing databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    
    console.log('\n📊 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Check if marketplace database exists
    const dbExists = dbs.databases.some(db => db.name === 'marketplace');
    
    if (dbExists) {
      console.log('\n✅ Database "marketplace" already exists');
    } else {
      console.log('\n📝 Database "marketplace" will be created on first use');
    }

    // Create indexes (these will be created when models are first used)
    console.log('\n📑 Indexes will be created automatically when models are used:');
    console.log('   - User: email (unique)');
    console.log('   - Product: title, description (text search)');
    console.log('   - Product: category, location, status');
    console.log('   - Chat: participants, product');

    console.log('\n✨ Database setup complete!');
    console.log('🚀 You can now run: npm run dev');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error connecting to MongoDB:');
    console.error(error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Tip: Check your MongoDB username and password');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Tip: Check your network connection and MongoDB Atlas IP whitelist');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Tip: Check your MongoDB connection string');
    }
    
    process.exit(1);
  }
}

setupDatabase();

