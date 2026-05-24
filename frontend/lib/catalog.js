const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function getCatalogProducts() {
  const response = await fetch(`${baseURL}/products`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load catalog products');
  }

  const data = await response.json();
  return data.products || [];
}

export async function getCatalogProductBySlug(slug) {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug);
}
