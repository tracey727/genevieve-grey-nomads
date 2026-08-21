'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BrandHeader from '../components/BrandHeader';
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

function AussieLandscape() {
  return (
    <svg className="aussie-landscape" viewBox="0 0 720 260" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b3557" />
          <stop offset=".58" stopColor="#0b2943" />
          <stop offset="1" stopColor="#061827" />
        </linearGradient>
        <radialGradient id="sunset" cx="65%" cy="65%" r="32%">
          <stop offset="0" stopColor="#ffd79a" stopOpacity=".98" />
          <stop offset=".2" stopColor="#ec9b57" stopOpacity=".72" />
          <stop offset=".55" stopColor="#7d422e" stopOpacity=".24" />
          <stop offset="1" stopColor="#0a2137" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="uluru" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a54d29" />
          <stop offset=".55" stopColor="#74301f" />
          <stop offset="1" stopColor="#351812" />
        </linearGradient>
      </defs>
      <rect width="720" height="260" fill="url(#sky)" />
      <rect width="720" height="260" fill="url(#sunset)" />
      <circle cx="494" cy="164" r="26" fill="#ffc77b" opacity=".83" />
      <path d="M410 196 C438 182 463 186 488 178 C512 168 536 157 561 163 C584 168 600 188 626 194 L626 215 L398 215 Z" fill="url(#uluru)" />
      <path d="M407 199 C448 191 469 199 500 191 C535 182 563 175 601 194" fill="none" stroke="#c56d39" strokeWidth="3" opacity=".55" />
      <path d="M0 214 C110 205 213 221 312 212 C410 203 518 220 720 204 L720 260 L0 260 Z" fill="#03101a" />
      <g stroke="#101b19" strokeWidth="4" strokeLinecap="round" opacity=".9">
        <path d="M646 214 L654 120 M654 149 L623 123 M652 164 L687 132 M646 184 L612 170" />
        <path d="M76 215 L73 139 M73 164 L44 139 M76 174 L105 151" />
      </g>
      <g fill="#12211f" opacity=".96">
        <ellipse cx="624" cy="121" rx="22" ry="8" transform="rotate(-24 624 121)" />
        <ellipse cx="687" cy="130" rx="24" ry="8" transform="rotate(22 687 130)" />
        <ellipse cx="612" cy="169" rx="19" ry="7" transform="rotate(8 612 169)" />
        <ellipse cx="44" cy="138" rx="20" ry="7" transform="rotate(25 44 138)" />
        <ellipse cx="104" cy="150" rx="20" ry="7" transform="rotate(-20 104 150)" />
      </g>
    </svg>
  );
}

function AussieMedallion() {
  return (
    <svg className="aussie-medallion-art" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="medSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#164c70" />
          <stop offset=".58" stopColor="#d8874d" />
          <stop offset="1" stopColor="#0c2030" />
        </linearGradient>
      </defs>
      <rect width="120" height="150" rx="54" fill="url(#medSky)" />
      <circle cx="87" cy="61" r="14" fill="#ffd185" />
      <path d="M0 96 C22 84 43 95 62 90 C86 83 100 92 120 86 L120 150 L0 150 Z" fill="#0b1b25" />
      <path d="M0 104 C20 96 42 104 62 99 C83 94 103 99 120 96" fill="none" stroke="#ddb36a" strokeWidth="1.4" opacity=".45" />
      <g fill="#06111a" stroke="#06111a" strokeLinecap="round">
        <ellipse cx="49" cy="91" rx="13" ry="8" />
        <circle cx="61" cy="80" r="5" />
        <path d="M62 77 L65 68 L69 76 Z" />
        <path d="M39 91 C24 91 18 82 10 77" fill="none" strokeWidth="5" />
        <path d="M46 97 L40 116 M55 96 L60 117 M43 114 L35 122 M60 116 L68 121" fill="none" strokeWidth="4" />
        <path d="M58 84 L54 72" fill="none" strokeWidth="4" />
      </g>
    </svg>
  );
}

function NavIcon({ name }) {
  const common = { width: 25, height: 25, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'home') return <svg {...common}><path d="M5 15 16 5l11 10v12H9V15"/><path d="M13 27v-8h6v8"/></svg>;
  if (name === 'explore') return <svg {...common}><circle cx="16" cy="16" r="11"/><path d="m20 11-3 7-7 3 3-7z"/></svg>;
  if (name === 'maps') return <svg {...common}><path d="m4 7 8-3 8 3 8-3v21l-8 3-8-3-8 3z"/><path d="M12 4v21M20 7v21"/></svg>;
  if (name === 'messages') return <svg {...common}><path d="M5 6h22v15H13l-7 6v-6H5z"/><path d="M10 11h12M10 15h9"/></svg>;
  return <svg {...common}><path d="M7 9h18M7 16h18M7 23h18"/></svg>;
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
  const fuelRange = summary?.result?.safeRangeKm ? `${summary.result.safeRangeKm.toLocaleString('en-AU')} km` : 'Add vehicle details';
  const status = summary?.result?.status ? summary.result.status.replace('-', ' ') : 'Ready to plan';

  return (
    <main className="app-shell premium-app-shell">
      <section className="screen-frame home-screen premium-home">
        <div className="ornate-corner corner-tl" aria-hidden="true" />
        <div className="ornate-corner corner-tr" aria-hidden="true" />
        <div className="ornate-corner corner-bl" aria-hidden="true" />
        <div className="ornate-corner corner-br" aria-hidden="true" />
        <div className="eucalyptus eucalyptus-top" aria-hidden="true">{Array.from({ length: 8 }).map((_, i) => <span key={i} />)}</div>
        <div className="eucalyptus eucalyptus-bottom" aria-hidden="true">{Array.from({ length: 6 }).map((_, i) => <span key={i} />)}</div>

        <section className="premium-brand-stage">
          <AussieLandscape />
          <BrandHeader />
        </section>

        <section className="premium-journey-card" aria-label="Journey summary">
          <div className="journey-medallion"><AussieMedallion /></div>
          <div className="premium-journey-copy">
            <h2>G’day, {travellerName}</h2>
            <div className="premium-facts">
              <p><span>●</span><strong>Next stop:</strong> <b>{destination}</b></p>
              <p><span>☀</span><strong>Weather:</strong> <Link href="/around">Check verified conditions</Link></p>
              <p><span>▣</span><strong>Fuel range:</strong> <b>{fuelRange}</b></p>
              <p><span>$</span><strong>Budget status:</strong> <em className={`status ${summary?.result?.status || ''}`}>{status}</em></p>
            </div>
          </div>
        </section>

        <Link href="/safety" className="emergency-bar premium-emergency" aria-label="Open emergency and safety controls">
          <span className="emergency-medallion" aria-hidden="true"><span>✚</span></span>
          <span><strong>Emergency / Safety</strong><small>Tap for immediate assistance</small></span>
          <span className="emergency-chevron" aria-hidden="true">›</span>
        </Link>

        <section className="feature-grid premium-feature-grid" aria-label="Main features">
          {cards.map(([title, href, icon]) => (
            <Link href={href} className={`feature-card premium-feature-card feature-${icon}`} key={title}>
              <span className="premium-feature-icon"><HomeIcon name={icon} /></span>
              <strong>{title}</strong>
              <span className="premium-card-chevron" aria-hidden="true">›</span>
            </Link>
          ))}
        </section>

        <section className="budget-strip premium-budget-strip" aria-label="Budget snapshot">
          <div className="budget-emblem" aria-hidden="true"><span>$</span></div>
          <div><small>Trip budget</small><strong>{money(summary?.result?.totalBudget)}</strong></div>
          <div><small>Spent</small><strong>{money(summary?.result?.spendBeforeReserve)}</strong></div>
          <div><small>Available</small><strong className="available-value">{money(summary?.result?.available)}</strong></div>
          <div><small>Emergency<br/>reserve</small><strong className="reserve-value">{money(summary?.result?.emergencyReserve)}</strong></div>
        </section>

        <nav className="reference-bottom-nav" aria-label="Primary navigation">
          <Link href="/" className="active"><NavIcon name="home"/><small>Home</small></Link>
          <Link href="/around"><NavIcon name="explore"/><small>Explore</small></Link>
          <Link href="/trip"><NavIcon name="maps"/><small>My Maps</small></Link>
          <a href="mailto:tracey@genevieveapp.com.au"><NavIcon name="messages"/><small>Messages</small></a>
          <Link href="/billing"><NavIcon name="more"/><small>More</small></Link>
        </nav>
      </section>
    </main>
  );
}
