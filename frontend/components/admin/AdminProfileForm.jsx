'use client';

import { useEffect, useState } from 'react';

export default function AdminProfileForm() {
  const [formData, setFormData] = useState({ name: '', image: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setFormData({
          name: data?.name || '',
          image: data?.image || '',
        });
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    loadProfile();
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
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Failed to update profile');
      }

      setMessage('Profile updated');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
          Display name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Admin name"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-slate-700">
          Avatar URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="https://"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? 'Saving' : 'Save changes'}
        </button>
        {message ? (
          <span className={`text-xs font-semibold ${message === 'Profile updated' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
