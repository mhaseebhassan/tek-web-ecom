const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Order = require('./src/models/order.model');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB...');
  
  // Clear Orders
  await Order.deleteMany({});
  console.log('Cleared all orders from database.');

  // Clear PDF Invoices
  const invoicesDir = path.join(__dirname, 'uploads/invoices');
  if (fs.existsSync(invoicesDir)) {
    const files = fs.readdirSync(invoicesDir);
    for (const file of files) {
      if (file.endsWith('.pdf')) {
        fs.unlinkSync(path.join(invoicesDir, file));
      }
    }
    console.log('Cleared all PDF invoices from disk.');
  }

  console.log('Cleanup complete.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
