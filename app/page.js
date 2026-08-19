'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import LegalFooter from '../components/LegalFooter';

const cards = [
  ['Continue Journey', '/trip', 'A calm summary of the journey you have saved.', '➜'],
  ['Plan Trip', '/plan', 'Budget, distance, fuel range and overnight-stop planning.', '⌖'],
  ['Around Me', '/around', 'Find fuel, toilets, food, vets, camps and hospitals nearby.', '◎'],
  ['Safety', '/safety', 'Emergency access and safety checks without clutter.', '◇'],
  ['Budget Planner', '/plan#budget', 'Keep fuel, food, camping and reserve inside one trip budget.', '$'],
  ['My Trip', '/trip', 'Saved journeys and your latest planning snapshot.', '▣']
];

export default function Home() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('genevieve:last-plan');
      if (raw) setSummary(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <main className="app-shell">
      <div className="australiana-glow" aria-hidden="true" />
      <section className="screen-frame home-screen">
        <BrandHeader />
        <section className="journey-summary panel" aria-label="Journey summary">
          <div><p className="eyebrow">Welcome</p><h2>G’day, Traveller</h2><p className="muted">A quieter travel dashboard: journey, budget and safety first.</p></div>
          <dl className="summary-list">
            <div><dt>Journey</dt><dd>{summary?.origin && summary?.destination ? `${summary.origin} → ${summary.destination}` : 'Plan your next trip'}</dd></div>
            <div><dt>Distance</dt><dd>{summary?.result?.totalDistanceKm ? `${summary.result.totalDistanceKm.toLocaleString('en-AU')} km` : 'Not planned yet'}</dd></div>
            <div><dt>Budget</dt><dd>{summary?.result?.totalBudget ? `$${summary.result.totalBudget.toLocaleString('en-AU')}` : 'Set a trip budget'}</dd></div>
            <div><dt>Status</dt><dd className={`status ${summary?.result?.status || ''}`}>{summary?.result?.status ? summary.result.status.replace('-', ' ') : 'Ready'}</dd></div>
          </dl>
        </section>
        <Link href="/safety" className="emergency-bar" aria-label="Open emergency and safety options"><span className="emergency-icon" aria-hidden="true">✚</span><span><strong>Emergency / Safety</strong><small>Immediate access stays one tap away</small></span><span aria-hidden="true">›</span></Link>
        <section className="feature-grid" aria-label="Main features">{cards.map(([title, href, desc, icon]) => <Link href={href} className="feature-card" key={title}><span className="feature-icon" aria-hidden="true">{icon}</span><strong>{title}</strong><small>{desc}</small></Link>)}</section>
        <section className="budget-strip panel" aria-label="Budget snapshot">
          <div><small>Trip budget</small><strong>{summary?.result?.totalBudget ? `$${summary.result.totalBudget.toLocaleString('en-AU')}` : '—'}</strong></div>
          <div><small>Planned spend</small><strong>{summary?.result?.spendBeforeReserve != null ? `$${summary.result.spendBeforeReserve.toLocaleString('en-AU')}` : '—'}</strong></div>
          <div><small>Available</small><strong>{summary?.result?.available != null ? `$${summary.result.available.toLocaleString('en-AU')}` : '—'}</strong></div>
          <div><small>Emergency reserve</small><strong>{summary?.result?.emergencyReserve != null ? `$${summary.result.emergencyReserve.toLocaleString('en-AU')}` : '—'}</strong></div>
        </section>
        <LegalFooter />
        <BottomNav current="Home" />
      </section>
    </main>
  );
}
