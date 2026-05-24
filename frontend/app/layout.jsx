import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Tekron Store',
  description: 'Shop Apple devices and accessories at Tekron.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
