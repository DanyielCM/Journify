'use client';

import { useState } from 'react';
import styles from '@/app/(user-pages)/dashboard/page.module.css';

export default function Moods({
  moods = [],
  initialSelected = null,
  canChoose = false,
}) {
  const [selected, setSelected] = useState(initialSelected);
  const [loading, setLoading] = useState(false);

  const handleChoose = async (mood) => {
    if (!canChoose || loading || selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/moods/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_id: mood.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setSelected(mood);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not record mood');
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    return (
      <div className={styles.moodItemSelected}>
        <img
          src={`/Moods/${selected.emoji_key}.svg`}
          alt={selected.name}
          className={styles.moodImageSelected}
        />
      </div>
    );
  }

  return (
    <div className={styles.moodsGrid}>
      {moods.map((m) => (
        <button
          key={m.id}
          className={styles.moodItem}
          onClick={() => handleChoose(m)}
          title={m.name}
        >
          <img
            src={`/Moods/${m.emoji_key}.svg`}
            alt={m.name}
            className={styles.moodImage}
          />
          <span className={styles.moodLabel}>{m.name}</span>
        </button>
      ))}
    </div>
  );
}
