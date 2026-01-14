'use client';

import React from 'react';

export default function DayTagClient() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    now
  );
  const dayAndMonth = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
  }).format(now);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ fontSize: '14px' }}>{weekday}</div>
      <div style={{ fontSize: '12px' }}>{`~${dayAndMonth}~`}</div>
    </div>
  );
}
