'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlusIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(name, email, password);
    if (!result.success) setError(result.error || 'Registration failed');
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12 animate-page-in">
      <div className="surface-panel relative w-full max-w-md overflow-hidden p-8 md:p-10">
        <div className="aurora-sheen opacity-45" />
        <div className="relative z-10">
          <div className="mb-9 text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-[1.4rem] bg-primary text-primary-foreground shadow-[0_18px_38px_rgb(250_197_100/0.18)]">
              <UserPlusIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Create account</h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Create an account to check out faster and see your orders later.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-[1rem] border border-rose-400/25 bg-rose-400/[0.12] px-4 py-3 text-sm font-semibold text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">Full name</label>
              <input type="text" required className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">Email</label>
              <input type="email" required className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">Password</label>
              <input type="password" required minLength={6} className="input-field" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account' : 'Create account'}
            </button>

            <p className="text-center text-sm font-medium text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-black text-primary transition-smooth hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
