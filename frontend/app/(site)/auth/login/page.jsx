'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FingerPrintIcon } from '@heroicons/react/24/outline';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const redirectTo = searchParams.get('redirect');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password, redirectTo || undefined);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12 animate-page-in">
      <div className="surface-panel relative w-full max-w-md overflow-hidden p-8 md:p-10">
        <div className="aurora-sheen opacity-45" />
        <div className="relative z-10">
          <div className="mb-9 text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-[1.4rem] bg-primary text-primary-foreground shadow-[0_18px_38px_rgb(250_197_100/0.18)]">
              <FingerPrintIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Sign in to view orders, checkout, or manage your account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {registered && (
              <div className="rounded-[1rem] border border-emerald-400/25 bg-emerald-400/[0.12] px-4 py-3 text-sm font-semibold text-emerald-300">
                Account created. Please sign in.
              </div>
            )}
            {error && (
              <div className="rounded-[1rem] border border-rose-400/25 bg-rose-400/[0.12] px-4 py-3 text-sm font-semibold text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">Email</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in' : 'Sign in'}
            </button>

            <p className="text-center text-sm font-medium text-muted-foreground">
              New to Tekron?{' '}
              <Link href="/auth/register" className="font-black text-primary transition-smooth hover:text-primary/80">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading</div>}>
      <LoginForm />
    </Suspense>
  );
}
