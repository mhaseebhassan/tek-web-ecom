import api from '@/lib/api';
import { products as fallbackProducts } from '@/lib/data';
import { resolveImageSrc } from '@/lib/images';

export const getProductImage = (product) =>
  resolveImageSrc(product.image || (product.images && product.images[0]));

export const normalizeProduct = (product) => ({
  ...product,
  id: product.id || product._id || product.slug,
  image: getProductImage(product),
});

export const getAvailability = (product) => {
  if (product?.availabilityStatus) {
    const status = product.availabilityStatus;
    return {
      isOutOfStock: status === 'out',
      isLowStock: status === 'low',
      label: status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock',
      className: status === 'out' ? 'label-rose' : status === 'low' ? 'label-amber' : 'label-emerald',
    };
  }

  const stock = Number(product?.stock);
  const isOutOfStock = Number.isFinite(stock) ? stock <= 0 : false;
  const isLowStock = Number.isFinite(stock) && stock > 0 && stock <= 5;

  return {
    isOutOfStock,
    isLowStock,
    label: isOutOfStock ? 'Out of stock' : isLowStock ? 'Low stock' : 'In stock',
    className: isOutOfStock ? 'label-rose' : isLowStock ? 'label-amber' : 'label-emerald',
  };
};

export const fallbackCatalog = fallbackProducts.map(normalizeProduct);

export async function loadCatalogProducts() {
  try {
    const response = await api.get('/products');
    const products = response.data.products || [];
    return products.length > 0 ? products.map(normalizeProduct) : fallbackCatalog;
  } catch (error) {
    return fallbackCatalog;
  }
}

export async function loadProductBySlug(slug) {
  const products = await loadCatalogProducts();
  return products.find((product) => product.slug === slug) || null;
}
