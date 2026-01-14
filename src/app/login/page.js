'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [d1, setD1] = useState(0);
  const [d2, setD2] = useState(0);
  const [d3, setD3] = useState(0);
  const [d4, setD4] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pin = useMemo(() => `${d1}${d2}${d3}${d4}`, [d1, d2, d3, d4]);

  function inc(setter) {
    setter((v) => (v + 1) % 10);
  }
  async function onLogin() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      console.error('Login error:', e);
      setError('Server error. Check console.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.journal}>
        <div className={styles.tag}>
          <input
            className={styles.tagText}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            type='text'
            autoComplete='username'
          />
        </div>

        <div className={styles.formArea}>
          <button
            className={styles.loginButton}
            type='button'
            onClick={onLogin}
            disabled={loading || !username}
          >
            {loading ? 'Login...' : 'Login'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <button
          type='button'
          className={`${styles.lockNumber1} ${styles.lockNumbers}`}
          onClick={() => inc(setD1)}
          aria-label='Digit 1'
        >
          {d1}
        </button>

        <button
          type='button'
          className={`${styles.lockNumber2} ${styles.lockNumbers}`}
          onClick={() => inc(setD2)}
          aria-label='Digit 2'
        >
          {d2}
        </button>

        <button
          type='button'
          className={`${styles.lockNumber3} ${styles.lockNumbers}`}
          onClick={() => inc(setD3)}
          aria-label='Digit 3'
        >
          {d3}
        </button>

        <button
          type='button'
          className={`${styles.lockNumber4} ${styles.lockNumbers}`}
          onClick={() => inc(setD4)}
          aria-label='Digit 4'
        >
          {d4}
        </button>
      </div>
    </div>
  );
}
