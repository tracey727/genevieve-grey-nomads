'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';

export default function MapsPage() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genevieve:last-plan');
      if (raw) setPlan(JSON.parse(raw));
    } catch {}
  }, []);

  const origin = plan?.origin || '';
  const destination = plan?.destination || '';
  const routeHref = origin && destination
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    : 'https://www.google.com/maps';

  return (
    <Shell current="My Maps">
      <section className="page-heading"><p className="eyebrow">My maps</p><h2>Your journey map</h2><p>Open your planned route in Maps without changing the protected trip budget or safety settings.</p></section>
      <section className="panel current-trip">
        <h3>Current route</h3>
        {plan ? <><strong>{origin} → {destination}</strong><p>{plan.result?.totalDistanceKm ? `${Number(plan.result.totalDistanceKm).toLocaleString('en-AU')} km planned` : 'Distance not available yet.'}</p></> : <p>No journey has been planned on this device yet.</p>}
        <a className="primary-button" href={routeHref} target="_blank" rel="noreferrer">Open route in Maps ↗</a>
      </section>
      <section className="safety-grid">
        <a className="safety-card" href="/plan"><strong>Plan trip</strong><span>Open planner →</span></a>
        <a className="safety-card" href="/trip"><strong>My trip</strong><span>Open saved journeys →</span></a>
        <a className="safety-card" href="/around"><strong>Around me</strong><span>Find nearby essentials →</span></a>
      </section>
    </Shell>
  );
}
