/**
 * addProducts.js — Safe product seeder
 * Sirf products add karta hai, existing users/orders delete NAHI karta.
 * Run: node addProducts.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');
const products = require('./data/products');

dotenv.config();
connectDB();

const run = async () => {
  try {
    // Get any admin/seller user to assign as product owner
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ No admin user found. Please register an admin first, then run this seeder.');
      process.exit(1);
    }

    // Delete existing products only
    await Product.deleteMany({});
    console.log('🗑️  Existing products cleared.');

    // Map products with owner user id
    const productDocs = products.map((p) => ({
      ...p,
      user: adminUser._id,
      seller: adminUser._id,
    }));

    await Product.insertMany(productDocs);
    console.log(`✅ ${productDocs.length} products imported successfully!`);
    console.log('📦 Categories: Clothes, Shoes, Watches, Bags, Accessories');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
