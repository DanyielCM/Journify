'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (e) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!loading && email && password) {
      onLogin();
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black text-white'>
      <div className='w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-lg'>
        <h1 className='text-2xl font-semibold mb-2'>Admin login</h1>
        <p className='text-sm text-neutral-400 mb-6'>
          Sign in with your admin credentials.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <label className='grid gap-1 text-sm'>
            <span>Email</span>
            <input
              className='border border-neutral-700 rounded bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-400'
              type='email'
              name='email'
              autoComplete='username'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className='grid gap-1 text-sm'>
            <span>Password</span>
            <input
              className='border border-neutral-700 rounded bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-400'
              type='password'
              name='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type='submit'
            disabled={loading || !email || !password}
            className='mt-2 inline-flex w-full items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white ring-1 ring-neutral-700 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <div className='mt-4 text-sm text-red-400' role='alert'>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
