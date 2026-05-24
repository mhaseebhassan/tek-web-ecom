import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export default function HeroBento() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-32 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        {/* Main Hero Card */}
        <div className="lg:col-span-2 lg:row-span-2 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden bg-card/80 border border-border shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 right-0 p-8 text-primary">
            <SparklesIcon className="w-12 h-12 opacity-50" />
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
              Future-ready tech, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">delivered beautifully.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Shop Mac, iPhone, Apple Watch, AirPods, Apple TV, and accessories at Tekron.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all duration-300 flex items-center gap-2">
                Shop Collection <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link href="/products?category=Deals" className="bg-card text-foreground border border-border px-8 py-4 rounded-full font-bold hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                View Deals
              </Link>
            </div>
          </div>
        </div>

        {/* Small Card 1 */}
        <div className="rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden bg-card/50 border border-border group hover:border-primary/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mb-4 relative z-10">
            <ComputerDesktopIcon className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-foreground mb-2">Pro Laptops</h3>
            <p className="text-muted-foreground text-sm">Engineered for absolute performance.</p>
          </div>
        </div>

        {/* Small Card 2 */}
        <div className="rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden bg-card/50 border border-border group hover:border-primary/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 relative z-10">
            <DevicePhoneMobileIcon className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-foreground mb-2">Smart Devices</h3>
            <p className="text-muted-foreground text-sm">Streaming, apps, and smart-home control.</p>
          </div>
        </div>

        {/* Small Card 3 */}
        <div className="lg:col-span-3 rounded-3xl p-8 flex items-center justify-between relative overflow-hidden bg-gradient-to-r from-card to-background border border-border group hover:border-secondary/50 transition-colors duration-300">
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                <CpuChipIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Next-Gen Components</h3>
                <p className="text-muted-foreground mt-1">Upgrade your rig with the latest tech drops.</p>
              </div>
           </div>
           <Link href="/products?category=Components" className="relative z-10 hidden sm:flex w-12 h-12 rounded-full bg-foreground text-background items-center justify-center hover:scale-110 transition-transform">
             <ArrowRightIcon className="w-5 h-5" />
           </Link>
        </div>
      </div>
    </section>
  );
}
