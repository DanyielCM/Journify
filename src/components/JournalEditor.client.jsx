'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/app/(user-pages)/journal/page.module.css';
import dashStyles from '@/app/(user-pages)/dashboard/page.module.css';

export default function JournalEditorClient() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/journal-entry');
        if (res.status === 200) {
          const json = await res.json();
          setTitle(json.title || '');
          setBody(json.body || '');
          setSaved(true);
          setEditing(false);
        } else {
          setTitle('');
          setBody('');
          setSaved(false);
          setEditing(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const canSave =
    (title.trim().length > 0 || body.trim().length > 0) && !saving;

  async function handleButtonClick() {
    if (saved && !editing) {
      setEditing(true);
      return;
    }

    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch('/api/journal-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save entry');
    } finally {
      setSaving(false);
    }
  }

  if (!mounted) return null;

  const titleEl = (
    <input
      className={styles.journalTitleInput}
      placeholder='Entry title'
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      readOnly={saved && !editing}
      disabled={loading || (saved && !editing)}
    />
  );

  const bodyEl = (
    <textarea
      className={`${styles.journalTextarea}`}
      placeholder='Write something...'
      value={body}
      onChange={(e) => setBody(e.target.value)}
      readOnly={saved && !editing}
      disabled={loading || (saved && !editing)}
    />
  );

  const buttonEl = (
    <button
      className={`${dashStyles.answerButton} ${
        !canSave && (editing || !saved) ? dashStyles.answerButtonDisabled : ''
      } ${styles.journalSaveButton}`}
      onClick={handleButtonClick}
      disabled={!canSave && (editing || !saved)}
    >
      {saving ? 'Saving…' : saved && !editing ? 'Edit' : 'Save'}
    </button>
  );

  const titleSlot = document.getElementById('journal-title-slot');
  const bodySlot = document.getElementById('journal-body-slot');
  const buttonSlot = document.getElementById('journal-button-slot');

  return (
    <>
      {titleSlot && createPortal(titleEl, titleSlot)}
      {bodySlot && createPortal(bodyEl, bodySlot)}
      {buttonSlot && createPortal(buttonEl, buttonSlot)}
    </>
  );
}
