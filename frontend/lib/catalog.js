import prisma from '@/lib/prisma';
import { products as seedProducts } from '@/lib/data';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export async function getCatalogProducts() {
  const count = await prisma.product.count();

  if (count === 0 && seedProducts.length > 0) {
    await prisma.product.createMany({
      data: seedProducts.map((product) => ({
        name: product.name,
        description: product.details || product.description,
        price: product.price,
        stock: 25,
        category: product.category,
        image: product.image,
      })),
    });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => ({
    ...product,
    slug: slugify(product.name),
  }));
}

export async function getCatalogProductBySlug(slug) {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug);
}
