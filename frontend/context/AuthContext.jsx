'use client';

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api, { getPayload } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const persistToken = (accessToken) => {
    Cookies.set('accessToken', accessToken, {
      secure: false, // Minikube uses HTTP, so secure must be false
      sameSite: 'lax',
    });
  };

  const loadUser = useCallback(async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      const payload = getPayload(res.data);
      setUser(payload.user);
    } catch {
      Cookies.remove('accessToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password, redirectTo) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const payload = getPayload(res.data);
      persistToken(payload.accessToken);
      setUser(payload.user);

      if (redirectTo) {
        router.push(redirectTo);
      } else if (payload.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.data?.message || error.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const payload = getPayload(res.data);
      persistToken(payload.accessToken);
      setUser(payload.user);
      router.push('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.data?.message || error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore network errors during logout
    } finally {
      Cookies.remove('accessToken');
      setUser(null);
      router.push('/auth/login');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
