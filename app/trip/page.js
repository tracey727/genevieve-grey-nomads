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
  const [profile, setProfile] = useState({ firstName: '', preferredFuel: 'Diesel' });
  const [profileStatus, setProfileStatus] = useState('Stored on this device only.');

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
    try {
      const raw = localStorage.getItem('genevieve:last-plan');
      if (raw) setLocalPlan(JSON.parse(raw));
      const profileRaw = localStorage.getItem('genevieve:traveller-profile');
      if (profileRaw) {
        const savedProfile = JSON.parse(profileRaw);
        setProfile({
          firstName: String(savedProfile?.firstName || '').slice(0, 40),
          preferredFuel: ['Diesel', 'Unleaded', 'Premium', 'LPG'].includes(savedProfile?.preferredFuel) ? savedProfile.preferredFuel : 'Diesel'
        });
      }
    } catch {}
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

  const saveProfile = () => {
    try {
      const clean = { firstName: String(profile.firstName || '').trim().slice(0, 40), preferredFuel: profile.preferredFuel };
      localStorage.setItem('genevieve:traveller-profile', JSON.stringify(clean));
      setProfile(clean);
      setProfileStatus('Traveller settings saved on this device.');
    } catch {
      setProfileStatus('This browser could not save traveller settings.');
    }
  };

  return (
    <Shell current="My Trip">
      <section className="page-heading"><p className="eyebrow">My trip</p><h2>Your journeys</h2><p>Local planning stays usable if the database is temporarily unavailable.</p></section>
      <section className="panel current-trip"><h3>Current device plan</h3>{localPlan ? <><strong>{localPlan.origin} → {localPlan.destination}</strong><p>{localPlan.result?.totalDistanceKm?.toLocaleString('en-AU')} km · ${localPlan.result?.totalBudget?.toLocaleString('en-AU')} budget · ${localPlan.result?.available?.toLocaleString('en-AU')} available</p><button className="primary-button" onClick={save}>Save to my trip store</button></> : <p>No journey planned yet.</p>}{status && <p role="status" className="form-message">{status}</p>}</section>

      <section className="panel form-panel" aria-label="Traveller settings">
        <p className="eyebrow">Free traveller settings</p>
        <h3>My preferences</h3>
        <label>First name<input value={profile.firstName} maxLength={40} autoComplete="given-name" onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Traveller" /></label>
        <label>Preferred fuel<select value={profile.preferredFuel} onChange={(e) => setProfile((prev) => ({ ...prev, preferredFuel: e.target.value }))}><option>Diesel</option><option>Unleaded</option><option>Premium</option><option>LPG</option></select></label>
        <button type="button" className="secondary-button" onClick={saveProfile}>Save settings</button>
        <p className="form-message" role="status">{profileStatus}</p>
      </section>

      <section className="panel current-trip"><h3>Membership</h3><p>Subscriptions and payment management live in one place, separate from your journey and safety controls.</p><Link className="secondary-button" href="/billing">Open Membership</Link></section>
      <section className="trip-list">{trips.map((trip) => <article className="panel trip-card" key={trip.public_id}><strong>{trip.name}</strong><small>{new Date(trip.updated_at).toLocaleString('en-AU')}</small><span>{trip.route_distance_km ? `${Number(trip.route_distance_km).toLocaleString('en-AU')} km` : ''}</span></article>)}</section>
    </Shell>
  );
}
