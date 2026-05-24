'use client';

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useCart } from '@/context/CartContext';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function CartDrawer() {
  const {
    cart,
    total,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-[120] transition-opacity duration-300 ${
        isCartDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isCartDrawerOpen}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={closeCartDrawer}
        aria-label="Close cart drawer"
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-background/95 shadow-[0_24px_80px_rgb(0_0_0/0.45)] backdrop-blur-2xl transition-transform duration-300 ${
          isCartDrawerOpen ? 'translate-x-0 animate-cart-pop' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Cart</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={closeCartDrawer} aria-label="Close cart">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-xl font-black tracking-tight text-foreground">Your cart is empty</p>
            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
              Add a product and it will appear here for a faster checkout path.
            </p>
            <Link href="/products" onClick={closeCartDrawer} className="btn-primary mt-7">
              Browse catalog
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {cart.map((item) => (
                <div key={item.id} className="surface-muted p-3">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-white/[0.07] p-2">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-black text-foreground">{item.name}</p>
                          <p className="mt-1 text-sm font-bold text-primary">{currency.format(item.price)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-rose-400/[0.12] hover:text-rose-300"
                          aria-label={`Remove ${item.name}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex w-fit items-center rounded-full border border-white/10 bg-white/[0.06] p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-white/[0.1] hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-black text-foreground">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-white/[0.1] hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 p-6">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Subtotal</span>
                <span className="text-3xl font-black tracking-tight text-foreground">{currency.format(total)}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={closeCartDrawer} className="btn-outline">
                  View cart
                </Link>
                <Link href="/checkout" onClick={closeCartDrawer} className="btn-primary">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
