'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import styles from './billing.module.css';

function getDeviceId() {
  const key = 'genevieve:device-id';
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
  return id;
}

const SESSION_KEY = 'genevieve:session-token';
const SESSION_EMAIL_KEY = 'genevieve:session-email';

export default function BillingPage() {
  const [config, setConfig] = useState({ enabled: false, displayPrice: '', billingPeriod: '', currency: 'AUD' });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [account, setAccount] = useState({ email: '', password: '' });
  const [session, setSession] = useState(null);
  const [accountMessage, setAccountMessage] = useState('');
  const [accountBusy, setAccountBusy] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(SESSION_KEY);
    const email = localStorage.getItem(SESSION_EMAIL_KEY);
    if (token && email) setSession({ token, email });
  }, []);

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_EMAIL_KEY);
    setSession(null);
    setAccountMessage('Signed out on this device.');
  };

  const submitAccount = async (mode) => {
    setAccountBusy(true);
    setAccountMessage('');
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: account.password })
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'Could not complete that request.');
      localStorage.setItem(SESSION_KEY, data.token);
      localStorage.setItem(SESSION_EMAIL_KEY, data.user.email);
      setSession({ token: data.token, email: data.user.email });
      setAccount({ email: '', password: '' });
      setAccountMessage(mode === 'signup' ? 'Account created. You are signed in on this device.' : 'Signed in on this device.');
    } catch (error) {
      setAccountMessage(error.message || 'Could not complete that request.');
    } finally {
      setAccountBusy(false);
    }
  };

  const refresh = async () => {
    const deviceId = getDeviceId();
    const [configRes, statusRes] = await Promise.all([
      fetch('/api/billing/config', { cache: 'no-store' }),
      fetch(`/api/billing/status?deviceId=${encodeURIComponent(deviceId)}`, { cache: 'no-store' })
    ]);
    const nextConfig = await configRes.json();
    const nextStatus = await statusRes.json();
    setConfig(nextConfig);
    setStatus(nextStatus);
  };

  useEffect(() => { refresh().catch(() => setMessage('Membership information is temporarily unavailable.')); }, []);

  const startCheckout = async () => {
    setMessage('Opening secure checkout…');
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ deviceId: getDeviceId() })
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Unable to open checkout');
      window.location.assign(data.url);
    } catch (error) { setMessage(error.message || 'Checkout is temporarily unavailable.'); }
  };

  const openPortal = async () => {
    setMessage('Opening subscription management…');
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ deviceId: getDeviceId() })
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Unable to open subscription management');
      window.location.assign(data.url);
    } catch (error) { setMessage(error.message || 'Subscription management is temporarily unavailable.'); }
  };

  return (
    <Shell current="My Trip">
      <section className="page-heading">
        <p className="eyebrow">Membership</p><h2>Simple, transparent subscription</h2>
        <p>Payment is handled on Stripe’s secure hosted checkout. Emergency and Safety access are never blocked because a payment fails.</p>
      </section>
      <section className={`panel ${styles.card}`}>
        <div>
          <p className="eyebrow">Account</p>
          <h3>{session ? 'Signed in' : 'Sign in or create an account'}</h3>
          <p className={styles.notice}>An account keeps your membership with you if you change devices. Safety, Plan Trip and Around Me all keep working without one.</p>
        </div>
        {session ? (
          <div className={styles.status}>
            <small>Signed in as</small>
            <strong>{session.email}</strong>
            <button className="secondary-button" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <>
            <label>Email<input type="email" autoComplete="email" value={account.email} onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))} /></label>
            <label>Password<input type="password" autoComplete="current-password" value={account.password} onChange={(e) => setAccount((a) => ({ ...a, password: e.target.value }))} /><small>At least 10 characters.</small></label>
            <div className="inline-actions">
              <button className="primary-button" disabled={accountBusy} onClick={() => submitAccount('login')}>Sign in</button>
              <button className="secondary-button" disabled={accountBusy} onClick={() => submitAccount('signup')}>Create account</button>
            </div>
          </>
        )}
        {accountMessage && <p role="status" className="form-message">{accountMessage}</p>}
      </section>
      <section className={`panel ${styles.card}`}>
        <div>
          <p className="eyebrow">GENEVIEVE — The Budget Travels</p>
          <h3>{config.enabled ? config.displayPrice : 'Subscriptions not activated yet'}</h3>
          {config.enabled && <p className={styles.renewal}>Renews every {config.billingPeriod} until cancelled.</p>}
        </div>
        <div className={styles.status}>
          <small>Status</small>
          <strong>{status?.status || (config.enabled ? 'not subscribed' : 'coming soon')}</strong>
        </div>
        {config.enabled && !status?.subscribed && <button className="primary-button" onClick={startCheckout}>Subscribe securely</button>}
        {config.enabled && status?.subscribed && <button className="primary-button" onClick={openPortal}>Manage or cancel subscription</button>}
        {!config.enabled && <p className={styles.notice}>Checkout remains disabled until the final recurring price, billing period, Stripe webhook and public legal URLs are configured.</p>}
        {message && <p role="status" className="form-message">{message}</p>}
      </section>
      <section className={`panel ${styles.legalNotice}`}>
        <h3>Before you subscribe</h3>
        <p>The recurring price and billing period will be shown clearly before payment. You can manage or cancel through Membership. Australian Consumer Law rights are not excluded.</p>
        <p><Link href="/terms">Terms of Use</Link> · <Link href="/subscriptions">Subscription & Refund Policy</Link> · <Link href="/privacy">Privacy Policy</Link></p>
      </section>
    </Shell>
  );
}
