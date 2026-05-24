'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminProfileForm() {
  const [formData, setFormData] = useState({ name: '', image: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/admin/profile');
        const data = response.data.profile;
        setFormData({
          name: data?.name || '',
          image: data?.image || '',
        });
      } catch (error) {
        setMessage('Failed to load profile');
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
      await api.patch('/admin/profile', formData);

      setMessage('Profile updated');
    } catch (error) {
      setMessage(error.data?.message || error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-foreground">
          Display name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="input-field mt-2"
          placeholder="Admin name"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-foreground">
          Avatar URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          className="input-field mt-2"
          placeholder="https://"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary px-8 py-3 text-xs uppercase tracking-widest"
        >
          {isSaving ? 'Saving' : 'Save changes'}
        </button>
        {message ? (
          <span className={`label ${message === 'Profile updated' ? 'label-emerald' : 'label-rose'}`}>
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
