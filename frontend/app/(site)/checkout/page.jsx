'use client';

import { useCart } from '@/context/CartContext';
import SafeImage from '@/components/SafeImage';
import { resolveImageSrc } from '@/lib/images';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import PageShell from '@/components/PageShell';
import ScrollReveal from '@/components/ui/ScrollReveal';
import EmptyState from '@/components/ui/EmptyState';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const labelClass = 'mb-2 block text-sm font-bold text-foreground';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    cardNumber: '',
    expDate: '',
    cvc: '',
  });

  useEffect(() => {
    if (!user) return;
    const parts = (user.name || '').trim().split(/\s+/);
    setFormData((prev) => ({
      ...prev,
      email: prev.email || user.email || '',
      firstName: prev.firstName || parts[0] || '',
      lastName: prev.lastName || parts.slice(1).join(' ') || '',
    }));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const { default: api } = await import('@/lib/api');
      const response = await api.post('/orders', {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim() || 'Guest',
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'Credit Card',
      });

      setConfirmedOrder(response.data.order);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.data?.message || err.message || 'Unable to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const formattedTotal = total.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (success) {
    const orderNumber = confirmedOrder?.id ? confirmedOrder.id.slice(-8).toUpperCase() : 'Pending';
    const orderEmail = user?.email || formData.email;
    const orderTotal = confirmedOrder?.totalAmount || confirmedOrder?.total || total;

    return (
      <PageShell className="flex min-h-[60vh] items-center justify-center">
        <div className="surface-panel relative w-full max-w-3xl overflow-hidden p-8 text-center animate-scale-in md:p-10">
          <div className="aurora-sheen opacity-50" />
          <div className="relative z-10">
            <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-[1.6rem] border border-emerald-400/25 bg-emerald-400/[0.12] text-emerald-300">
              <CheckCircleIcon className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">Order confirmed</h1>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Thanks. Your order has been saved.</p>
            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                ['Order', `#${orderNumber}`],
                ['Email', orderEmail],
                ['Total', `$${Number(orderTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
              ].map(([label, value]) => (
                <div key={label} className="surface-muted p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                  <p className="mt-2 truncate text-sm font-black text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm font-medium leading-6 text-muted-foreground">
              Estimated delivery: 3-5 business days. Guest customers should keep this confirmation number for reference.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {user && (
                <button type="button" onClick={() => router.push('/orders')} className="btn-primary">
                  View orders
                </button>
              )}
              <button type="button" onClick={() => router.push('/')} className="btn-outline">
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (authLoading && user) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground animate-pulse">Loading checkout</div>;
  }

  if (cart.length === 0) {
    return (
      <PageShell title="Checkout" subtitle="Add products to your cart before you check out.">
        <EmptyState
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Add items before checking out."
          actionLabel="Browse products"
          actionHref="/products"
        />
      </PageShell>
    );
  }

  return (
    <PageShell title="Checkout" subtitle="Review your shipping details and place the order. Sign in is optional.">
      <div className="mb-8 grid grid-cols-3 gap-3">
        {['Cart', 'Shipping', 'Payment'].map((step, index) => (
          <div key={step} className="surface-muted flex items-center gap-3 p-3">
            <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
              index === 0 ? 'bg-emerald-400/[0.16] text-emerald-300' : 'bg-primary text-primary-foreground'
            }`}>
              {index + 1}
            </span>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-foreground">{step}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[1rem] border border-rose-400/25 bg-rose-400/[0.12] px-4 py-3 text-sm font-semibold text-rose-300">
              {error}
            </div>
          )}

          <ScrollReveal>
            <section className="surface-panel p-6 md:p-8">
              <div className="mb-7 flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-black">1</span>
                <h2 className="text-2xl font-black tracking-tight text-foreground">Shipping details</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className={labelClass}>Last name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" placeholder="Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-field" placeholder="123 Apple Park Way" />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field" placeholder="Cupertino" />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-field" placeholder="CA" />
                </div>
                <div>
                  <label className={labelClass}>Postal code</label>
                  <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="input-field" placeholder="95014" />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="input-field" placeholder="United States" />
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <section className="surface-panel p-6 md:p-8">
              <div className="mb-7 flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-black">2</span>
                <h2 className="text-2xl font-black tracking-tight text-foreground">Payment</h2>
              </div>

              <div className="mb-7 flex items-center gap-5 rounded-[1.35rem] border border-primary/25 bg-primary/[0.1] p-5">
                <div className="h-5 w-5 shrink-0 rounded-full border-4 border-primary bg-background" />
                <div className="flex-1">
                  <p className="text-lg font-black text-foreground">Credit card</p>
                  <p className="text-sm font-medium text-muted-foreground">Demo checkout. No real charge is made.</p>
                </div>
                <CreditCardIcon className="h-9 w-9 text-primary" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Card number</label>
                  <div className="relative">
                    <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} maxLength={19} className="input-field pl-12 font-mono text-base tracking-widest" placeholder="0000 0000 0000 0000" />
                    <CreditCardIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Expiration</label>
                  <input required type="text" name="expDate" value={formData.expDate} onChange={handleInputChange} maxLength={5} className="input-field font-mono text-base" placeholder="MM/YY" />
                </div>
                <div>
                  <label className={labelClass}>CVC</label>
                  <input required type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} maxLength={4} className="input-field font-mono text-base" placeholder="123" />
                </div>
              </div>
            </section>
          </ScrollReveal>

          <div className="flex justify-end">
            <button type="submit" disabled={isProcessing} className="btn-primary w-full sm:w-auto sm:min-w-[260px]">
              <LockClosedIcon className="h-5 w-5" />
              {isProcessing ? 'Processing' : `Pay $${formattedTotal}`}
            </button>
          </div>
        </form>

        <ScrollReveal delay={150}>
          <aside className="surface-panel sticky top-28 overflow-hidden p-7">
            <div className="aurora-sheen opacity-45" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Your order</h2>
              <div className="custom-scrollbar mt-7 max-h-[390px] space-y-3 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-3">
                    <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1rem] bg-white/[0.07] p-2">
                      <SafeImage src={resolveImageSrc(item.image)} alt={item.name} width={64} height={64} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-black text-foreground">{item.name}</h4>
                      <p className="mt-1 text-xs font-semibold text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-foreground">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">${formattedTotal}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="label label-emerald">Free</span>
                </div>
                <div className="flex items-end justify-between border-t border-white/10 pt-6">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-4xl font-black tracking-tight text-foreground">${formattedTotal}</span>
                </div>
              </div>

              <div className="mt-7 flex items-center gap-4 rounded-[1.25rem] border border-secondary/25 bg-secondary/[0.1] p-4 text-sm font-semibold text-secondary">
                <ShieldCheckIcon className="h-6 w-6 shrink-0" />
                Demo checkout uses the same protected order flow
              </div>
            </div>
          </aside>
        </ScrollReveal>
      </div>
    </PageShell>
  );
}
