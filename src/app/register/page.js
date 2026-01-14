'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import plans from '@/data/plans.json';

function getTimeZones() {
  try {
    if (typeof Intl !== 'undefined' && Intl.supportedValuesOf) {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch {}
  return [Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'];
}

export default function RegisterPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + plans.length) % plans.length);
  }

  function next() {
    setIndex((i) => (i + 1) % plans.length);
  }

  const current = plans[index];

  const [timeZones, setTimeZones] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    timeZone: 'UTC',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tzs = getTimeZones();
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    setTimeZones(tzs);
    setForm((p) => ({
      ...p,
      timeZone: tzs.includes(detected) ? detected : 'UTC',
    }));
  }, []);

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Registration failed');
        return;
      }
      router.push('/login');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.leftSection}>
        {/* Main Section */}
        <div className={styles.mainSection}>
          <div className={styles.titleTextMain}>Create your account</div>

          <form className={styles.formContainer} onSubmit={onSubmit}>
            <div className={styles.inputContainer}>
              <div className={styles.label}>User Name</div>
              <input
                className={styles.input}
                name='username'
                value={form.username}
                onChange={onChange}
                autoComplete='username'
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.label}>E-mail</div>
              <input
                className={styles.input}
                name='email'
                value={form.email}
                onChange={onChange}
                autoComplete='email'
              />
            </div>

            <div className={styles.frameInner}>
              <div className={styles.inputInnerContainer}>
                <div className={styles.label}>Password</div>
                <input
                  className={styles.inputInner}
                  name='password'
                  value={form.password}
                  onChange={onChange}
                  type='password'
                  inputMode='numeric'
                  pattern='\d{4}'
                  maxLength={4}
                  autoComplete='new-password'
                />
              </div>

              <div className={styles.inputInnerContainer}>
                <div className={styles.label}>Password Confirmation</div>
                <input
                  className={styles.inputInner}
                  name='passwordConfirm'
                  value={form.passwordConfirm}
                  onChange={onChange}
                  type='password'
                  inputMode='numeric'
                  pattern='\d{4}'
                  maxLength={4}
                  autoComplete='new-password'
                />
              </div>
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.label}>Time Zone</div>
              <select
                className={styles.input}
                name='timeZone'
                value={form.timeZone}
                onChange={onChange}
              >
                {timeZones.length === 0 ? (
                  <option value='UTC'>UTC</option>
                ) : (
                  timeZones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.buttons}>
              <button
                type='submit'
                className={styles.button3DBig}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create account'}
              </button>

              <div className={styles.button3DSmall}>
                <Link href='/login'>Log in</Link>
              </div>
            </div>

            {error ? <div className={styles.error}>{error}</div> : null}
          </form>
        </div>

        {/* Info/Plans Section */}
        <div className={styles.infoSection}>
          <div className={styles.titleInfo}>Plans & Pricing</div>

          <div className={styles.plansContainer}>
            <button
              type='button'
              className={`${styles.arrowButton} ${styles.arrowLeft}`}
              onClick={prev}
              aria-label='Previous plan'
            />

            <div className={styles.textPlansContainer}>
              <div className={styles.titlePlan}>{current.title}</div>
              <div className={styles.textPlan}>
                {current.features.map((line, i) => (
                  <div key={i}>-{line}</div>
                ))}
              </div>
            </div>

            <button
              type='button'
              className={`${styles.arrowButton} ${styles.arrowRight}`}
              onClick={next}
              aria-label='Next plan'
            />
          </div>
        </div>
      </div>

      {/* Journal Section */}
      <div className={styles.rightSection}>
        <div className={styles.tag}>
          <div className={styles.tagText}>Hello, Stranger</div>
        </div>
        <div className={`${styles.lockNumber1} ${styles.lockNumbers}`}>0</div>
        <div className={`${styles.lockNumber2} ${styles.lockNumbers}`}>0</div>
        <div className={`${styles.lockNumber3} ${styles.lockNumbers}`}>0</div>
        <div className={`${styles.lockNumber4} ${styles.lockNumbers}`}>0</div>
      </div>
    </div>
  );
}
