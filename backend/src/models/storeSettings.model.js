const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Tekron Store',
    },
    supportEmail: {
      type: String,
    },
    supportPhone: {
      type: String,
    },
    address: {
      type: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    shippingFlatRate: {
      type: Number,
      default: 0,
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
