'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api, { getPayload } from '@/lib/api';
import { resolveImageSrc } from '@/lib/images';

const CartContext = createContext();

const mapBackendItem = (item) => {
  const product = item.product;
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: resolveImageSrc(product.images?.[0]),
    quantity: item.quantity,
    stock: product.stock,
  };
};

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const recalculateTotal = useCallback((items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, []);

  const loadLocalCart = useCallback(() => {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];
    try {
      return JSON.parse(savedCart);
    } catch {
      localStorage.removeItem('cart');
      return [];
    }
  }, []);

  const saveLocalCart = useCallback((items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, []);

  const fetchBackendCart = useCallback(async () => {
    const res = await api.get('/cart');
    const payload = getPayload(res.data);
    return (payload.cart?.items || []).map(mapBackendItem).filter(Boolean);
  }, []);

  const syncCartToBackend = useCallback(async (items) => {
    if (!user || items.length === 0) return;

    for (const item of items) {
      await api.post('/cart/items', { productId: item.id, quantity: item.quantity });
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    const initializeCart = async () => {
      setSyncing(true);
      try {
        if (user) {
          const localItems = loadLocalCart();
          if (localItems.length > 0) {
            await syncCartToBackend(localItems);
            saveLocalCart([]);
          }
          const backendItems = await fetchBackendCart();
          setCart(backendItems);
        } else {
          setCart(loadLocalCart());
        }
      } catch {
        setCart(loadLocalCart());
      } finally {
        setSyncing(false);
      }
    };

    initializeCart();
  }, [user, authLoading, loadLocalCart, saveLocalCart, fetchBackendCart, syncCartToBackend]);

  useEffect(() => {
    if (!user) {
      saveLocalCart(cart);
    }
    setTotal(recalculateTotal(cart));
  }, [cart, user, saveLocalCart, recalculateTotal]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product.id || product._id;
    const image = resolveImageSrc(product.image || (product.images && product.images[0]));
    if (!productId) return;

    if (user) {
      try {
        const res = await api.post('/cart/items', { productId, quantity });
        const payload = getPayload(res.data);
        const items = (payload.cart?.items || []).map(mapBackendItem).filter(Boolean);
        setCart(items);
        setIsCartDrawerOpen(true);
        return;
      } catch {
        // fall through to local update
      }
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, id: productId, image, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/items/${productId}`);
        const payload = getPayload(res.data);
        const items = (payload.cart?.items || []).map(mapBackendItem).filter(Boolean);
        setCart(items);
        return;
      } catch {
        // fall through
      }
    }

    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (user) {
      try {
        const res = await api.patch('/cart/items', { productId, quantity });
        const payload = getPayload(res.data);
        const items = (payload.cart?.items || []).map(mapBackendItem).filter(Boolean);
        setCart(items);
        return;
      } catch {
        // fall through
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
      } catch {
        // ignore
      }
    }
    setCart([]);
    saveLocalCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        syncing,
        isCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
