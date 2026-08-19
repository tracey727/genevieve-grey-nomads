'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';

function getDeviceId() {
  const key = 'genevieve:device-id';
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
  return id;
}

export default function TripPage() {
  const [localPlan, setLocalPlan] = useState(null);
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState('');
  const loadTrips = async () => {
    try {
      const deviceId = getDeviceId();
      const res = await fetch(`/api/trips?deviceId=${encodeURIComponent(deviceId)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load');
      setTrips(data.trips || []);
    } catch { setStatus('Saved cloud journeys are unavailable right now. Your local plan remains on this device.'); }
  };
  useEffect(() => {
    try { const raw = localStorage.getItem('genevieve:last-plan'); if (raw) setLocalPlan(JSON.parse(raw)); } catch {}
    loadTrips();
  }, []);
  const save = async () => {
    if (!localPlan) return setStatus('Plan a journey first.');
    setStatus('Saving…');
    try {
      const deviceId = getDeviceId();
      const res = await fetch('/api/trips', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId, name: `${localPlan.origin} to ${localPlan.destination}`, plan: localPlan }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to save');
      setStatus('Journey saved.');
      await loadTrips();
    } catch { setStatus('The journey could not be saved to the database. Your local copy has not been removed.'); }
  };
  return (
    <Shell current="My Trip">
      <section className="page-heading"><p className="eyebrow">My trip</p><h2>Your journeys</h2><p>Local planning stays usable if the database is temporarily unavailable.</p></section>
      <section className="panel current-trip"><h3>Current device plan</h3>{localPlan ? <><strong>{localPlan.origin} → {localPlan.destination}</strong><p>{localPlan.result?.totalDistanceKm?.toLocaleString('en-AU')} km · ${localPlan.result?.totalBudget?.toLocaleString('en-AU')} budget · ${localPlan.result?.available?.toLocaleString('en-AU')} available</p><button className="primary-button" onClick={save}>Save to my trip store</button></> : <p>No journey planned yet.</p>}{status && <p role="status" className="form-message">{status}</p>}</section>
      <section className="panel current-trip"><h3>Membership</h3><p>Subscriptions and payment management live in one place, separate from your journey and safety controls.</p><Link className="secondary-button" href="/billing">Open Membership</Link></section>
      <section className="trip-list">{trips.map((trip) => <article className="panel trip-card" key={trip.public_id}><strong>{trip.name}</strong><small>{new Date(trip.updated_at).toLocaleString('en-AU')}</small><span>{trip.route_distance_km ? `${Number(trip.route_distance_km).toLocaleString('en-AU')} km` : ''}</span></article>)}</section>
    </Shell>
  );
}
