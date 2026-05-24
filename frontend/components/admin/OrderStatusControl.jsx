'use client';

import { useState } from 'react';
import api from '@/lib/api';

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

export default function OrderStatusControl({ orderId, initialStatus, initialPaymentStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      await api.patch(`/admin/orders/${orderId}`, { status, paymentStatus });

      setMessage('Updated');
    } catch (error) {
      setMessage(error.data?.message || error.message || 'Failed to update order');
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
          className="select-field cursor-pointer appearance-none px-3 py-2 pr-8 text-xs uppercase tracking-widest"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
        >
          {ORDER_STATUSES.map((option) => (
            <option key={option} value={option} className="bg-background text-foreground">
              {option}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
          className="select-field cursor-pointer appearance-none px-3 py-2 pr-8 text-xs uppercase tracking-widest"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
        >
          {PAYMENT_STATUSES.map((option) => (
            <option key={option} value={option} className="bg-background text-foreground">
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary px-4 py-2 text-xs uppercase tracking-widest"
        >
          {isSaving ? 'Saving' : 'Save'}
        </button>
      </div>
      {message ? (
        <span className={`label self-start ${message === 'Updated' ? 'label-emerald' : 'label-rose'}`}>
          {message}
        </span>
      ) : null}
    </div>
  );
}
