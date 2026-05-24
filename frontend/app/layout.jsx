import { Sora } from 'next/font/google';
import './globals.css';
import Providers from './providers';

import { CartProvider } from '@/context/CartContext';

const sora = Sora({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Tekron Store',
  description: 'Your one-stop shop for all things tech',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <Providers>
          <CartProvider>
            {children}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
} 
