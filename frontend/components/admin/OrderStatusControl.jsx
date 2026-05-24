'use client';

import { useState } from 'react';

const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const PAYMENT_STATUSES = ['pending', 'completed', 'failed'];

export default function OrderStatusControl({ orderId, initialStatus, initialPaymentStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}` , {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Failed to update order');
      }

      setMessage('Updated');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-2xl border border-amber-200/60 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {ORDER_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
          className="rounded-2xl border border-amber-200/60 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {PAYMENT_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-2xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? 'Saving' : 'Save'}
        </button>
      </div>
      {message ? (
        <span className={`text-xs font-semibold ${message === 'Updated' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {message}
        </span>
      ) : null}
    </div>
  );
}
