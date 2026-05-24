import Link from 'next/link';
import Logo from './Logo';

const footerLinks = {
  Explore: [
    { label: 'Full Catalog', href: '/products' },
    { label: 'Cart', href: '/cart' },
    { label: 'Orders', href: '/orders' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-card/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <Link href="/" className="inline-flex transition-smooth hover:opacity-85">
              <Logo />
            </Link>
            <p className="mt-5 max-w-md text-sm font-medium leading-6 text-muted-foreground">
              Shop Mac, iPhone, Apple Watch, AirPods, Apple TV, and accessories at Tekron.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-6 lg:col-span-5 lg:col-start-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-foreground">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm font-semibold text-muted-foreground transition-smooth hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/70 pt-6 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Tekron Technologies. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
