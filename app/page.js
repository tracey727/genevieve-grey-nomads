'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import HomeIcon from '../components/HomeIcon';

const actions = [
  { title: 'Continue journey', href: '/trip', icon: 'journey', art: 'road' },
  { title: 'Plan trip', href: '/plan', icon: 'plan', art: 'map' },
  { title: 'Around me', href: '/around', icon: 'around', art: 'outback' },
  { title: 'Safety', href: '/safety', icon: 'safety' },
  { title: 'Budget planner', href: '/plan#budget', icon: 'budget' },
  { title: 'My trip', href: '/trip', icon: 'trip' }
];

function money(value) {
  return value != null && Number.isFinite(Number(value)) ? `$${Number(value).toLocaleString('en-AU')}` : '—';
}

function SummaryIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'pin') return <svg {...common}><path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>;
  if (name === 'sun') return <svg {...common}><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
  if (name === 'fuel') return <svg {...common}><path d="M5 21V4h9v17"/><path d="M5 8h9M3 21h13"/><path d="M14 7h2l3 3v7.5a1.5 1.5 0 0 0 3 0V9l-2-2"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8.5"/><path d="M14.5 8.5c-.7-.7-1.5-1-2.5-1-1.7 0-3 1-3 2.4 0 3.5 6 1.5 6 4.8 0 1.4-1.3 2.5-3.1 2.5-1.1 0-2.2-.4-3-1.2M12 5.5v13"/></svg>;
}

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [travellerName, setTravellerName] = useState('Traveller');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genevieve:last-plan');
      if (raw) setSummary(JSON.parse(raw));
      const profileRaw = localStorage.getItem('genevieve:traveller-profile');
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        const firstName = String(profile?.firstName || '').trim().slice(0, 40);
        if (firstName) setTravellerName(firstName);
      }
    } catch {}
  }, []);

  const destination = summary?.destination || 'Plan your next stop';
  const distance = summary?.result?.totalDistanceKm ? `${summary.result.totalDistanceKm.toLocaleString('en-AU')} km planned` : 'No journey selected';
  const fuelRange = summary?.result?.safeRangeKm ? `${summary.result.safeRangeKm.toLocaleString('en-AU')} km` : 'Add vehicle details';
  const budgetStatus = summary?.result?.status ? summary.result.status.replace('-', ' ') : 'Ready to plan';

  return (
    <main className="app-shell approved-home-shell">
      <section className="screen-frame approved-home-screen">
        <section className="approved-hero" aria-label="GENEVIEVE Grey Nomads Australian touring">
          <img src="/approved-home-hero.webp" alt="GENEVIEVE Australian outback touring artwork" />
        </section>

        <section className="approved-journey-card" aria-label="Current journey">
          <div className="journey-medallion" aria-hidden="true"><span /></div>
          <div className="approved-journey-copy">
            <h1>G’day, {travellerName}</h1>
            <Link href="/trip" className="journey-row">
              <SummaryIcon name="pin" />
              <span><small>Next stop</small><strong>{destination}</strong><em>{distance}</em></span>
            </Link>
            <Link href="/around" className="journey-row">
              <SummaryIcon name="sun" />
              <span><small>Conditions</small><strong>Check before you go</strong><em>Weather and local information</em></span>
            </Link>
            <Link href="/plan" className="journey-row">
              <SummaryIcon name="fuel" />
              <span><small>Fuel range</small><strong>{fuelRange}</strong><em>Conservative refuel planning</em></span>
            </Link>
            <Link href="/plan#budget" className="journey-row">
              <SummaryIcon name="money" />
              <span><small>Budget status</small><strong className={`status ${summary?.result?.status || ''}`}>{budgetStatus}</strong><em>Emergency reserve protected</em></span>
            </Link>
          </div>
        </section>

        <Link href="/safety" className="approved-emergency" aria-label="Open emergency and safety controls">
          <span className="emergency-shield" aria-hidden="true"><b>+</b></span>
          <span className="emergency-copy"><strong>Emergency / Safety</strong><small>Tap for immediate assistance</small></span>
          <span className="emergency-chevron" aria-hidden="true">›</span>
        </Link>

        <section className="approved-action-grid" aria-label="Travel tools">
          {actions.map((action, index) => (
            <Link href={action.href} className={`approved-action-card ${action.art ? `has-${action.art}` : ''}`} key={action.title}>
              {action.art && <span className="tile-landscape" aria-hidden="true" />}
              <span className="approved-action-icon"><HomeIcon name={action.icon} /></span>
              <strong>{index + 1}. {action.title}</strong>
              <span className="tile-chevron" aria-hidden="true">›</span>
            </Link>
          ))}
        </section>

        <section className="approved-budget-strip" aria-label="Trip budget snapshot">
          <Link href="/plan#budget"><small>Trip budget</small><strong>{money(summary?.result?.totalBudget)}</strong></Link>
          <Link href="/plan#budget"><small>Spent</small><strong>{money(summary?.result?.spendBeforeReserve)}</strong></Link>
          <Link href="/plan#budget"><small>Available</small><strong className="available-value">{money(summary?.result?.available)}</strong></Link>
          <Link href="/plan#budget"><small>Emergency reserve</small><strong className="reserve-value">{money(summary?.result?.emergencyReserve)}</strong></Link>
        </section>

        <BottomNav current="Home" />
      </section>
    </main>
  );
}
