require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/product.model');
const User = require('../src/models/user.model');

const products = [
  {
    name: 'Tekron X1 Smartphone',
    slug: 'tekron-x1-smartphone',
    description: 'The latest flagship smartphone with advanced camera system.',
    price: 999.99,
    compareAtPrice: 1099.99,
    category: 'Smartphones',
    brand: 'Tekron',
    images: ['https://via.placeholder.com/600x600?text=Tekron+X1'],
    stock: 50,
    sku: 'TK-X1-001',
    isFeatured: true,
  },
  {
    name: 'Tekron Pro Laptop',
    slug: 'tekron-pro-laptop',
    description: 'High-performance laptop for professionals and creators.',
    price: 1999.99,
    compareAtPrice: 2199.99,
    category: 'Laptops',
    brand: 'Tekron',
    images: ['https://via.placeholder.com/600x600?text=Tekron+Pro'],
    stock: 30,
    sku: 'TK-PRO-001',
    isFeatured: true,
  },
  {
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-headphones',
    description: 'Premium over-ear headphones with active noise cancellation.',
    price: 299.99,
    category: 'Audio',
    brand: 'SoundMaster',
    images: ['https://via.placeholder.com/600x600?text=Headphones'],
    stock: 100,
    sku: 'SM-HP-001',
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tekron');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Please run seedAdmin.js first!');
      process.exit(1);
    }

    await Product.deleteMany(); // Clear existing products

    const productsWithUser = products.map((product) => ({
      ...product,
      createdBy: admin._id,
    }));

    await Product.insertMany(productsWithUser);

    console.log('Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
