'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import ImageUploadField from '@/components/ImageUploadField';
import PageShell from '@/components/PageShell';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getProductImage } from '@/lib/products';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProducts();
  }, [authLoading, user, router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products || []);
      setError('');
    } catch (error) {
      setError(error.data?.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        image: product.image || (product.images && product.images[0]) || '',
      });
      setImagePreview(product.image || (product.images && product.images[0]) || '');
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: '',
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: '',
    });
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id || editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      setError(error.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);

      await fetchProducts();
    } catch (error) {
      setError(error.data?.message || 'Failed to delete product');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading</div>
      </div>
    );
  }

  return (
    <PageShell
      title="Products"
      subtitle="Create, update, and manage your catalog. Upload images locally or use files from public/."
      className="!py-0 !px-0 space-y-8"
    >
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Manage name, price, stock, category, and images.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn-primary px-5 py-2 text-sm font-bold"
          >
            Add Product
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      ) : null}

      <div className="table-panel">
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.055]">
          <h2 className="text-xl font-bold text-foreground">Catalog</h2>
          <span className="text-[10px] uppercase tracking-widest font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{products.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="table-head">
                <tr>
                  <th scope="col" className="py-4 pl-8 pr-3 text-left">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-4 text-left">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-4 text-left">
                    Stock
                  </th>
                  <th scope="col" className="px-3 py-4 text-left">
                    Category
                  </th>
                  <th scope="col" className="relative py-4 pl-3 pr-8">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-transparent">
                {products.map((product) => (
                  <tr key={product.id || product._id} className="table-row">
                    <td className="whitespace-nowrap py-4 pl-8 pr-3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 bg-white/[0.07] rounded-[1rem] border border-white/10 flex items-center justify-center p-1">
                          <SafeImage
                            src={getProductImage(product)}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <div className="ml-5">
                          <div className="font-semibold text-foreground text-sm">{product.name}</div>
                          <div className="text-muted-foreground text-xs truncate max-w-[200px] mt-0.5">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-foreground">
                      ${product.price}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`label ${product.stock < 5 ? 'label-rose' : 'label-emerald'}`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="label label-accent">{product.category}</span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-8 text-right text-sm font-medium">
                      <button
                         onClick={() => handleOpenModal(product)}
                         className="text-primary hover:text-primary/80 mr-4 transition-colors"
                      >
                         <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id || product._id)}
                        className="text-rose-500 hover:text-rose-400 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={handleCloseModal}
            />

            <div className="surface-panel inline-block transform overflow-hidden px-4 pt-5 pb-4 text-left align-bottom sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle animate-scale-in">
              <form onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-foreground">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-bold text-foreground">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="input-field mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-bold text-foreground">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input-field mt-1"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-bold text-foreground">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="input-field mt-1"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-bold text-foreground">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field mt-1"
                        required
                      />
                    </div>

                    <ImageUploadField value={formData.image} onChange={handleImageChange} />
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:col-start-2"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-outline mt-3 w-full sm:col-start-1 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
} 
