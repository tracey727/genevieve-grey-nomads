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

export default function BillingPage() {
  const [config, setConfig] = useState({ enabled: false, displayPrice: '', billingPeriod: '', currency: 'AUD' });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

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
