import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function SiteLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="premium-grid-bg pointer-events-none fixed inset-x-0 top-0 -z-10 h-[560px]" />
      <Navbar />
      <main className="flex-grow pt-20 md:pt-24">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
