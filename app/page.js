'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import LegalFooter from '../components/LegalFooter';
import HomeIcon from '../components/HomeIcon';

const cards = [
  ['1. Continue Journey', '/trip', 'journey'],
  ['2. Plan Trip', '/plan', 'plan'],
  ['3. Around Me', '/around', 'around'],
  ['4. Safety', '/safety', 'safety'],
  ['5. Budget Planner', '/plan#budget', 'budget'],
  ['6. My Trip', '/trip', 'trip']
];

function money(value) {
  return value != null && Number.isFinite(Number(value)) ? `$${Number(value).toLocaleString('en-AU')}` : '—';
}

export default function Home() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genevieve:last-plan');
      if (raw) setSummary(JSON.parse(raw));
    } catch {}
  }, []);

  const destination = summary?.destination || 'Plan your next stop';
  const distance = summary?.result?.totalDistanceKm ? `${summary.result.totalDistanceKm.toLocaleString('en-AU')} km planned` : 'Distance not planned yet';
  const status = summary?.result?.status ? summary.result.status.replace('-', ' ') : 'Ready to plan';

  return (
    <main className="app-shell premium-app-shell">
      <div className="premium-sky" aria-hidden="true" />
      <section className="screen-frame home-screen premium-home">
        <div className="gum-leaf gum-leaf-left" aria-hidden="true">✦</div>
        <div className="gum-leaf gum-leaf-right" aria-hidden="true">✦</div>

        <BrandHeader />

        <section className="premium-journey-card" aria-label="Journey summary">
          <div className="journey-medallion" aria-hidden="true"><span>☀</span><strong>AU</strong></div>
          <div className="premium-journey-copy">
            <p className="eyebrow">Welcome</p>
            <h2>G’day, Traveller</h2>
            <div className="premium-facts">
              <p><span aria-hidden="true">◆</span><strong>Next stop:</strong> {destination}</p>
              <p><span aria-hidden="true">◌</span><strong>Journey:</strong> {distance}</p>
              <p><span aria-hidden="true">☀</span><strong>Weather:</strong> <Link href="/around">Check verified conditions</Link></p>
              <p><span aria-hidden="true">$</span><strong>Budget status:</strong> <em className={`status ${summary?.result?.status || ''}`}>{status}</em></p>
            </div>
          </div>
        </section>

        <Link href="/safety" className="emergency-bar premium-emergency" aria-label="Open guarded emergency and safety controls">
          <span className="emergency-icon" aria-hidden="true">✚</span>
          <span><strong>Emergency / Safety</strong><small>Open guarded emergency controls and safety tools</small></span>
          <span className="emergency-chevron" aria-hidden="true">›</span>
        </Link>

        <section className="feature-grid premium-feature-grid" aria-label="Main features">
          {cards.map(([title, href, icon]) => (
            <Link href={href} className="feature-card premium-feature-card" key={title}>
              <span className="premium-feature-icon"><HomeIcon name={icon} /></span>
              <strong>{title}</strong>
              <span className="premium-card-chevron" aria-hidden="true">›</span>
            </Link>
          ))}
        </section>

        <section className="budget-strip premium-budget-strip" aria-label="Budget snapshot">
          <div><small>Trip budget</small><strong>{money(summary?.result?.totalBudget)}</strong></div>
          <div><small>Planned spend</small><strong>{money(summary?.result?.spendBeforeReserve)}</strong></div>
          <div><small>Available</small><strong className="available-value">{money(summary?.result?.available)}</strong></div>
          <div><small>Emergency reserve</small><strong className="reserve-value">{money(summary?.result?.emergencyReserve)}</strong></div>
        </section>

        <LegalFooter />
        <BottomNav current="Home" />
      </section>
    </main>
  );
}
