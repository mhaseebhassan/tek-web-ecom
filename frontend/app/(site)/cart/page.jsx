'use client';

import { useCart } from '@/context/CartContext';
import SafeImage from '@/components/SafeImage';
import { resolveImageSrc } from '@/lib/images';
import Link from 'next/link';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import PageShell from '@/components/PageShell';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CartPage() {
  const { cart, total, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <PageShell className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Add a product when you are ready to compare totals and check out."
          actionLabel="Browse catalog"
          actionHref="/products"
        />
      </PageShell>
    );
  }

  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <PageShell title="Shopping cart" subtitle={`${cart.length} item${cart.length > 1 ? 's' : ''} in your cart.`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
        <div className="space-y-4">
          {cart.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 60}>
              <div className="surface-card group relative overflow-hidden p-4 transition-smooth hover:-translate-y-1 hover:border-primary/25">
                <div className="aurora-sheen opacity-0 transition-opacity duration-700 group-hover:opacity-50" />
                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-[1.4rem] bg-white/[0.07] p-4 sm:w-36">
                    <SafeImage
                      src={resolveImageSrc(item.image)}
                      alt={item.name}
                      width={132}
                      height={132}
                      className="h-full w-full object-contain drop-shadow-[0_20px_28px_rgb(0_0_0/0.4)]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-foreground">{item.name}</h3>
                      <p className="mt-2 text-lg font-black text-primary">${fmt(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-white/[0.1] hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-11 text-center text-lg font-black text-foreground">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-white/[0.1] hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="icon-button text-rose-300 hover:border-rose-400/30 hover:text-rose-200"
                        aria-label={`Remove ${item.name}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={150}>
          <aside className="surface-panel sticky top-28 overflow-hidden p-7">
            <div className="aurora-sheen opacity-45" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Order summary</h2>
              <div className="mt-7 space-y-4 text-base">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">${fmt(total)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="label label-emerald">Free</span>
                </div>
              </div>
              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="flex items-end justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-4xl font-black tracking-tight text-foreground">${fmt(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary mt-8 w-full">
                Checkout
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
                <LockClosedIcon className="h-4 w-4" />
                Checkout is encrypted
              </p>
            </div>
          </aside>
        </ScrollReveal>
      </div>
    </PageShell>
  );
}
