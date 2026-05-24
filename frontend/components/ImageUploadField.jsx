'use client';

import { useRef, useState } from 'react';
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api, { getPayload } from '@/lib/api';
import SafeImage from '@/components/SafeImage';
import { resolveImageSrc } from '@/lib/images';

export default function ImageUploadField({ value, onChange, label = 'Product image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPEG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData);
      const payload = getPayload(res.data);
      const url = payload?.url;
      if (!url) throw new Error('No URL returned');
      onChange(url);
      toast.success('Image saved to your PC (backend/uploads)');
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-foreground">{label}</label>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-outline flex-1 gap-2">
          {uploading ? (
            'Uploading'
          ) : (
            <>
              <ArrowUpTrayIcon className="h-5 w-5" />
              Upload from computer
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} />
      </div>

      <div className="relative">
        <PhotoIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/MacBook Pro.png or /uploads/your-file.jpg"
          className="input-field pl-10"
          required
        />
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        Use a file from <code className="text-primary">frontend/public</code> (e.g. /MacBook Pro.png) or upload - saved to{' '}
        <code className="text-primary">backend/uploads</code> on your machine.
      </p>

      {value ? (
        <div className="animate-scale-in rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4">
          <SafeImage src={resolveImageSrc(value)} alt="Preview" width={160} height={160} className="mx-auto rounded-[1rem] object-contain" />
        </div>
      ) : null}
    </div>
  );
}
