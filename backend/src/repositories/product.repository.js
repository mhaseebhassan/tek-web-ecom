const Product = require('../models/product.model');

exports.findProducts = ({ filter, sort, skip, limit }) =>
  Product.find(filter).sort(sort).skip(skip).limit(limit).select('-__v');

exports.countProducts = (filter) => Product.countDocuments(filter);

exports.findProductByIdOrSlug = (idOrSlug) => {
  const query = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  return Product.findOne({ ...query, isActive: true });
};

exports.createProduct = (payload) => Product.create(payload);

exports.updateProduct = (id, payload) =>
  Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

exports.softDeleteProduct = (id) =>
  Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
