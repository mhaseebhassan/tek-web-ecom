'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

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
        const response = await api.get('/admin/store');
        const data = response.data.settings;
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
        setMessage('Failed to load store settings');
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
      await api.patch('/admin/store', formData);

      setMessage('Store settings updated');
    } catch (error) {
      setMessage(error.data?.message || error.message || 'Failed to update store settings');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="storeName" className="block text-sm font-semibold text-foreground">
            Store name
          </label>
          <input
            id="storeName"
            name="storeName"
            type="text"
            value={formData.storeName}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="Tekron Store"
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-semibold text-foreground">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="select-field mt-2 appearance-none pr-10 text-xs uppercase tracking-widest"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            {CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency} className="bg-background text-foreground">
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="supportEmail" className="block text-sm font-semibold text-foreground">
            Support email
          </label>
          <input
            id="supportEmail"
            name="supportEmail"
            type="email"
            value={formData.supportEmail}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="support@tekron.com"
          />
        </div>
        <div>
          <label htmlFor="supportPhone" className="block text-sm font-semibold text-foreground">
            Support phone
          </label>
          <input
            id="supportPhone"
            name="supportPhone"
            type="text"
            value={formData.supportPhone}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-foreground">
          Store address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={formData.address}
          onChange={handleChange}
          className="input-field mt-2 min-h-[100px] resize-y"
          placeholder="Street, City, State"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="taxRate" className="block text-sm font-semibold text-foreground">
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
            className="input-field mt-2"
          />
        </div>
        <div>
          <label htmlFor="shippingFlatRate" className="block text-sm font-semibold text-foreground">
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
            className="input-field mt-2"
          />
        </div>
        <div>
          <label htmlFor="freeShippingThreshold" className="block text-sm font-semibold text-foreground">
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
            className="input-field mt-2"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary px-8 py-3 text-xs uppercase tracking-widest"
        >
          {isSaving ? 'Saving' : 'Save store settings'}
        </button>
        {message ? (
          <span className={`label ${message === 'Store settings updated' ? 'label-emerald' : 'label-rose'}`}>
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
