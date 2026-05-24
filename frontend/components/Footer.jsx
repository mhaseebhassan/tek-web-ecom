import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-100 overflow-hidden text-gray-600">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-50 to-cyan-50 rounded-[100%] blur-3xl opacity-60 pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="group mb-4">
              <Logo className="h-8" />
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
              Your premium destination for the latest technology. We curate the best digital experiences crafted for modern professionals.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Catalog</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=macbook" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                  MacBooks
                </Link>
              </li>
              <li>
                <Link href="/products?category=iphone" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                  iPhones
                </Link>
              </li>
              <li>
                <Link href="/products?category=watch" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                  Apple Watch
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Email:</span> hello@tekron.com
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Phone:</span> 1-800-TEKRON-NOW
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">HQ:</span> San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Tekron Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
