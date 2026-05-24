'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'surface-card !rounded-lg !border-border/80 !bg-card !text-foreground',
            duration: 4000,
          }}
        />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
