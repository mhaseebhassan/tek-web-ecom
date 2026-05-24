import PageShell from '@/components/PageShell';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FeatureCard from '@/components/ui/FeatureCard';
import { SparklesIcon, UserGroupIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <PageShell
      title="About Tekron"
      subtitle="A small technology storefront focused on clear product information, tidy checkout, and orders customers can track."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ScrollReveal>
          <div className="surface-panel relative min-h-[360px] overflow-hidden p-8 md:p-10">
            <div className="aurora-sheen opacity-60" />
            <div className="relative z-10 max-w-2xl">
              <span className="label label-primary">How we think</span>
              <h2 className="mt-6 text-4xl font-black tracking-tight text-foreground md:text-5xl">
                Buying tech should feel straightforward.
              </h2>
              <p className="mt-6 text-lg font-medium leading-8 text-muted-foreground">
                Tekron keeps the catalog focused on devices people actually compare: Macs, iPhones, Apple Watch, AirPods, Apple TV, and useful accessories. Product pages call out the real specs, while the platform handles accounts, carts, orders, admin work, and live updates behind the scenes.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="surface-card h-full p-8">
            <ShieldCheckIcon className="h-9 w-9 text-primary" />
            <h3 className="mt-8 text-2xl font-black tracking-tight text-foreground">More than a static storefront.</h3>
            <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
              The site runs on a Next.js storefront, an Express REST API, MongoDB, Passport with JWT, Redis caching, and Socket.IO. That gives the store real accounts, product management, carts, orders, and admin tools without making the customer side feel heavy.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <ScrollReveal delay={0}>
          <FeatureCard icon={SparklesIcon} title="Focused catalog" description="Apple products grouped by real buying categories, with pricing and specs easy to scan." />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <FeatureCard icon={UserGroupIcon} title="Useful accounts" description="Customers can save carts, place orders, and return later to check what happened." />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <FeatureCard icon={GlobeAltIcon} title="Room to grow" description="The backend is separated into routes, controllers, services, repositories, cache, and admin tools." />
        </ScrollReveal>
      </div>
    </PageShell>
  );
}
