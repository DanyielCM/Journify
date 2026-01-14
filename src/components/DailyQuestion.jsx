'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/(user-pages)/dashboard/page.module.css';

export default function DailyQuestion({ allowedQuestions = 1 }) {
  const [question, setQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const allowed = Math.max(1, Number(allowedQuestions) || 1);

  useEffect(() => {
    let currentOffset = 0;

    async function load(offset = 0) {
      setLoading(true);
      try {
        const qRes = await fetch(`/api/daily-question?offset=${offset}`);
        if (!qRes.ok) throw new Error('Failed to fetch question');
        const q = await qRes.json();
        setQuestion(q);
        setTotalQuestions(q.totalQuestions || 1);

        // Check for an existing answer for today
        const aRes = await fetch(
          `/api/entry-answers?questionId=${encodeURIComponent(q.id)}`
        );
        if (aRes.status === 200) {
          const a = await aRes.json();
          if (a?.answerText) {
            setAnswerText(a.answerText);
            setSaved(true);
            setEditing(false);
          } else {
            setSaved(false);
            setEditing(true);
            setAnswerText('');
          }
        } else {
          // No existing answer (204) or not authenticated/other status
          setSaved(false);
          setEditing(true);
          setAnswerText('');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // initial load
    load(0);

    // listen for navigation events dispatched by controls elsewhere in the UI
    function onNav(e) {
      if (!e?.detail) return;
      // ignore navigation if allowed count is 1
      if (allowed <= 1) return;
      currentOffset = currentOffset + (e.detail.delta || 0);
      // restrict offset to allowed range
      const wrapped = ((currentOffset % allowed) + allowed) % allowed;
      currentOffset = wrapped;
      load(currentOffset);
    }

    window.addEventListener('daily-question-nav', onNav);
    return () => window.removeEventListener('daily-question-nav', onNav);
  }, [totalQuestions]);

  const canSave = answerText.trim().length > 0 && !saving;

  async function handleButtonClick() {
    if (saved && !editing) {
      // switch to edit mode
      setEditing(true);
      return;
    }

    // Save action
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch('/api/entry-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, answerText }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save answer');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.questionText}>
        {loading
          ? 'Loading question…'
          : question?.text ?? 'No question available'}
      </div>

      <textarea
        className={styles.answerText}
        placeholder='Write something...'
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        readOnly={saved && !editing}
        disabled={loading || (saved && !editing)}
      />

      <button
        className={`${styles.answerButton} ${
          !canSave && (editing || !saved) ? styles.answerButtonDisabled : ''
        }`}
        onClick={handleButtonClick}
        disabled={!canSave && (editing || !saved)}
      >
        {saving ? 'Saving…' : saved && !editing ? 'Edit' : 'Save'}
      </button>
    </>
  );
}
