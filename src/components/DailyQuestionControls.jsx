'use client';

import React from 'react';
import styles from '@/app/(user-pages)/dashboard/page.module.css';

export default function DailyQuestionControls() {
  function nav(delta) {
    window.dispatchEvent(
      new CustomEvent('daily-question-nav', { detail: { delta } })
    );
  }

  return (
    <div className={styles.questionControls}>
      <button
        aria-label='Previous question'
        onClick={() => nav(-1)}
        className={styles.dqArrow}
      >
        ‹
      </button>
      <button
        aria-label='Next question'
        onClick={() => nav(1)}
        className={styles.dqArrow}
      >
        ›
      </button>
    </div>
  );
}
