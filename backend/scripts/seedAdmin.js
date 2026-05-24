require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tekron');

    const email = process.env.SEED_ADMIN_EMAIL || 'admin@tekron.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
    const name = process.env.SEED_ADMIN_NAME || 'Tekron Admin';

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      adminExists.name = name;
      adminExists.role = 'admin';
      adminExists.isActive = true;
      await adminExists.save();
      console.log('Admin user already exists!');
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
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
