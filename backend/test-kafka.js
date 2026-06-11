const mongoose = require('mongoose');
const { connectKafka, produceEvent } = require('./src/config/kafka');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  await connectKafka();
  
  const dummyOrderPayload = {
    order: {
      id: new mongoose.Types.ObjectId().toString(),
      user: { name: 'Test User' },
      items: [
        { name: 'Test Product', quantity: 1, price: 100 }
      ],
      subtotal: 100,
      shippingFee: 0,
      tax: 10,
      total: 110
    },
    message: 'Test order created'
  };

  console.log('Sending test order to Kafka...');
  await produceEvent('order-events', 'new_order', dummyOrderPayload);
  console.log('Test order sent successfully!');
  
  setTimeout(() => process.exit(0), 2000);
}

test();
