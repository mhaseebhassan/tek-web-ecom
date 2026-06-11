const productRepository = require('../repositories/product.repository');

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeProductPayload = (body) => {
  const payload = { ...body };

  if (payload.image && !payload.images) {
    payload.images = [payload.image];
  }

  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  ['price', 'compareAtPrice', 'stock'].forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== '') {
      payload[field] = Number(payload[field]);
    }
  });

  delete payload.image;
  return payload;
};

const serializeProduct = (product) => {
  const plain = product.toObject ? product.toObject() : product;
  const image = plain.images && plain.images.length > 0 ? plain.images[0] : '';

  return {
    ...plain,
    id: plain._id.toString(),
    image,
  };
};

const buildProductQuery = (query) => {
  const filter = { isActive: true };
  const and = [];

  if (query.category) {
    filter.category = query.category;
  }

  if (query.featured === 'true') {
    filter.isFeatured = true;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(escapeRegex(query.search.trim()), 'i');
    and.push({ $or: [{ name: searchRegex }, { description: searchRegex }, { category: searchRegex }, { brand: searchRegex }] });
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (and.length > 0) {
    filter.$and = and;
  }

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 24, 1), 100);
  const skip = (page - 1) * limit;

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { ratingAverage: -1 },
    name: { name: 1 },
  };
  const sort = sortMap[query.sort] || sortMap.newest;

  return { filter, page, limit, skip, sort };
};

exports.listProducts = async (query = {}) => {
  const options = buildProductQuery(query);
  const [products, total] = await Promise.all([
    productRepository.findProducts(options),
    productRepository.countProducts(options.filter),
  ]);

  return {
    products: products.map(serializeProduct),
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      pages: Math.ceil(total / options.limit),
    },
  };
};

exports.getProduct = async (idOrSlug) => {
  const product = await productRepository.findProductByIdOrSlug(idOrSlug);
  return product ? serializeProduct(product) : null;
};

exports.createProduct = async (body, userId) => {
  const product = await productRepository.createProduct({
    ...normalizeProductPayload(body),
    createdBy: userId,
  });
  return serializeProduct(product);
};

exports.updateProduct = async (id, body) => {
  const product = await productRepository.updateProduct(id, normalizeProductPayload(body));
  return product ? serializeProduct(product) : null;
};

exports.deleteProduct = async (id) => productRepository.softDeleteProduct(id);

exports.serializeProduct = serializeProduct;
