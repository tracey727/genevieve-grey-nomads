'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';

const STORAGE_KEY = 'genevieve:travel-messages';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  const saveMessages = (next) => {
    setMessages(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const addMessage = () => {
    const clean = text.trim();
    if (!clean) return;
    saveMessages([{ id: crypto.randomUUID(), text: clean, createdAt: new Date().toISOString() }, ...messages]);
    setText('');
  };

  const removeMessage = (id) => saveMessages(messages.filter((message) => message.id !== id));

  return (
    <Shell current="Messages">
      <section className="page-heading"><p className="eyebrow">Messages</p><h2>Travel notes and reminders</h2><p>Keep private journey notes on this device. This screen does not claim to send emergency or third-party messages.</p></section>
      <section className="panel form-panel">
        <label>New note<textarea value={text} onChange={(e) => setText(e.target.value)} rows="4" placeholder="Add a travel note or reminder" /></label>
        <button type="button" className="primary-button" onClick={addMessage}>Save note</button>
      </section>
      <section className="trip-list">
        {messages.length === 0 ? <article className="panel trip-card"><strong>No notes yet</strong><span>Your saved travel notes will appear here.</span></article> : messages.map((message) => <article className="panel trip-card" key={message.id}><strong>{message.text}</strong><small>{new Date(message.createdAt).toLocaleString('en-AU')}</small><button type="button" className="secondary-button" onClick={() => removeMessage(message.id)}>Remove</button></article>)}
      </section>
    </Shell>
  );
}
