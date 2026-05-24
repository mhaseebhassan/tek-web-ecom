const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tekron')
  .then(async () => {
    const db = mongoose.connection.db;
    const result = await db.collection('products').updateMany(
      { category: 'Smartphones' },
      { $set: { category: 'Phones' } }
    );
    console.log('Migration complete:', result);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
