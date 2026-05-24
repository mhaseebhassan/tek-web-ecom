'use client';

import { useEffect, useState } from 'react';

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'PKR', 'AED', 'SAR'];

export default function StoreSettingsForm() {
  const [formData, setFormData] = useState({
    storeName: '',
    supportEmail: '',
    supportPhone: '',
    address: '',
    currency: 'USD',
    taxRate: 0,
    shippingFlatRate: 0,
    freeShippingThreshold: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/store');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (data) {
          setFormData({
            storeName: data.storeName || '',
            supportEmail: data.supportEmail || '',
            supportPhone: data.supportPhone || '',
            address: data.address || '',
            currency: data.currency || 'USD',
            taxRate: data.taxRate ?? 0,
            shippingFlatRate: data.shippingFlatRate ?? 0,
            freeShippingThreshold: data.freeShippingThreshold ?? 0,
          });
        }
      } catch (error) {
        console.error('Failed to load store settings', error);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Failed to update store settings');
      }

      setMessage('Store settings updated');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="storeName" className="block text-sm font-semibold text-slate-700">
            Store name
          </label>
          <input
            id="storeName"
            name="storeName"
            type="text"
            value={formData.storeName}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Tekron Store"
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-semibold text-slate-700">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-3 py-3 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="supportEmail" className="block text-sm font-semibold text-slate-700">
            Support email
          </label>
          <input
            id="supportEmail"
            name="supportEmail"
            type="email"
            value={formData.supportEmail}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="support@tekron.com"
          />
        </div>
        <div>
          <label htmlFor="supportPhone" className="block text-sm font-semibold text-slate-700">
            Support phone
          </label>
          <input
            id="supportPhone"
            name="supportPhone"
            type="text"
            value={formData.supportPhone}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-slate-700">
          Store address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={formData.address}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Street, City, State"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="taxRate" className="block text-sm font-semibold text-slate-700">
            Tax rate (%)
          </label>
          <input
            id="taxRate"
            name="taxRate"
            type="number"
            min="0"
            step="0.01"
            value={formData.taxRate}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="shippingFlatRate" className="block text-sm font-semibold text-slate-700">
            Shipping flat rate
          </label>
          <input
            id="shippingFlatRate"
            name="shippingFlatRate"
            type="number"
            min="0"
            step="0.01"
            value={formData.shippingFlatRate}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="freeShippingThreshold" className="block text-sm font-semibold text-slate-700">
            Free shipping over
          </label>
          <input
            id="freeShippingThreshold"
            name="freeShippingThreshold"
            type="number"
            min="0"
            step="0.01"
            value={formData.freeShippingThreshold}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? 'Saving' : 'Save store settings'}
        </button>
        {message ? (
          <span className={`text-xs font-semibold ${message === 'Store settings updated' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
