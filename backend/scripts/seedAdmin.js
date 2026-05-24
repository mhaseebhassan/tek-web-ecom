require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tekron');

    const adminExists = await User.findOne({ email: 'admin@tekron.com' });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    await User.create({
      name: 'Admin User',
      email: 'admin@tekron.com',
      password: 'Admin@12345',
      role: 'admin',
    });

    console.log('Admin user seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
