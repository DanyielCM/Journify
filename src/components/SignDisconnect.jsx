'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/(user-pages)/dashboard/page.module.css';

export default function SignDisconnect() {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showTooltip = (e) => {
    setTooltip({ visible: true, x: e.clientX + 12, y: e.clientY + 12 });
  };

  const hideTooltip = () => setTooltip({ visible: false, x: 0, y: 0 });

  const doLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      // redirect to user login page
      router.push('/login');
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Could not log out');
    }
  };

  return (
    <>
      <div
        className={styles.signDisconnect}
        role='button'
        tabIndex={0}
        onClick={doLogout}
        onMouseMove={showTooltip}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            doLogout();
          }
        }}
        aria-label='Log out'
      ></div>
      {tooltip.visible && (
        <div
          className={styles.logoutTooltip}
          style={{
            position: 'fixed',
            left: tooltip.x + 'px',
            top: tooltip.y + 'px',
          }}
        >
          LogOut
        </div>
      )}
    </>
  );
}
