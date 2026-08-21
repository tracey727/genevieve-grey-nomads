'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import HomeIcon from '../components/HomeIcon';

const actions = [
  { number: '1', title: 'Continue journey', href: '/trip', icon: 'journey', art: 'road' },
  { number: '2', title: 'Plan trip', href: '/plan', icon: 'plan', art: 'map' },
  { number: '3', title: 'Around me', href: '/around', icon: 'around', art: 'outback' },
  { number: '4', title: 'Safety', href: '/safety', icon: 'safety' },
  { number: '5', title: 'Budget planner', href: '/plan#budget', icon: 'budget' },
  { number: '6', title: 'My trip', href: '/trip', icon: 'trip' }
];

function money(value) {
  return value != null && Number.isFinite(Number(value))
    ? `$${Number(value).toLocaleString('en-AU')}`
    : '—';
}

function SummaryIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  if (name === 'pin') {
    return <svg {...common}><path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>;
  }
  if (name === 'sun') {
    return <svg {...common}><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
  }
  if (name === 'fuel') {
    return <svg {...common}><path d="M5 21V4h9v17"/><path d="M5 8h9M3 21h13"/><path d="M14 7h2l3 3v7.5a1.5 1.5 0 0 0 3 0V9l-2-2"/></svg>;
  }
  return <svg {...common}><circle cx="12" cy="12" r="8.5"/><path d="M14.5 8.5c-.7-.7-1.5-1-2.5-1-1.7 0-3 1-3 2.4 0 3.5 6 1.5 6 4.8 0 1.4-1.3 2.5-3.1 2.5-1.1 0-2.2-.4-3-1.2M12 5.5v13"/></svg>;
}

function BrandMark() {
  return (
    <svg className="gg-brand-mark" viewBox="0 0 220 214" role="img" aria-label="GENEVIEVE tree, infinity and roots emblem">
      <defs>
        <linearGradient id="ggGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1d091" />
          <stop offset="0.48" stopColor="#b77a35" />
          <stop offset="1" stopColor="#f2c473" />
        </linearGradient>
        <linearGradient id="ggRose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7bd95" />
          <stop offset="0.5" stopColor="#8f3b35" />
          <stop offset="1" stopColor="#d5a66e" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#ggGold)" strokeLinecap="round" strokeLinejoin="round">
        <path strokeWidth="2.2" d="M110 86V41M110 55l-19-17M110 50l20-19M110 64L82 56M110 61l31-8M110 42l-8-18M111 44l10-20" />
        <path strokeWidth="1.5" d="M91 38 77 29M93 46 73 43M129 35l16-11M128 46l22-3M81 55 64 49M141 53l18-7M100 26 91 17M120 24l8-13" />
        <path strokeWidth="1.35" d="M78 29 69 22M73 43 62 38M145 24l8-7M150 43l11-3M91 17l-5-8M128 11l4-6" />
        <path strokeWidth="2.2" d="M110 86c-8-11-21-17-34-14-16 4-25 21-17 35 9 17 35 15 51-4 16 19 42 21 51 4 8-14-1-31-17-35-13-3-26 3-34 14Z" stroke="url(#ggRose)" />
        <path strokeWidth="2" d="M110 103v34M110 137c-5 13-17 21-30 30M110 139c5 12 18 21 32 29M110 140c-1 14-1 27 0 46M98 151 91 181M121 151l9 31M89 163l-21 17M132 164l20 17M103 166l-7 26M116 166l5 27" />
        <path strokeWidth="1.25" d="M80 168 72 193M91 181l-8 17M68 180l-12 10M142 169l9 23M130 182l5 17M152 181l14 9M96 192l-10 8M121 193l10 8M110 186l-1 18" />
      </g>
      <g fill="#d6ad70" opacity=".92">
        <circle cx="70" cy="23" r="2.2"/><circle cx="61" cy="38" r="1.9"/><circle cx="84" cy="9" r="2.1"/><circle cx="132" cy="5" r="2.1"/><circle cx="153" cy="17" r="2.2"/><circle cx="162" cy="40" r="1.9"/>
        <circle cx="82" cy="32" r="1.7"/><circle cx="99" cy="14" r="1.7"/><circle cx="140" cy="29" r="1.7"/><circle cx="74" cy="52" r="1.5"/><circle cx="151" cy="53" r="1.5"/>
      </g>
      <g fill="#d88e9d" opacity=".9">
        <circle cx="137" cy="27" r="3"/><circle cx="143" cy="31" r="2.1"/><circle cx="132" cy="31" r="2"/>
      </g>
    </svg>
  );
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
  const distance = summary?.result?.totalDistanceKm
    ? `${summary.result.totalDistanceKm.toLocaleString('en-AU')} km planned`
    : 'No journey selected';
  const fuelRange = summary?.result?.safeRangeKm
    ? `${summary.result.safeRangeKm.toLocaleString('en-AU')} km`
    : 'Add vehicle details';
  const budgetStatus = summary?.result?.status
    ? summary.result.status.replaceAll('-', ' ')
    : 'Ready to plan';

  return (
    <main className="app-shell gg-home-shell">
      <section className="screen-frame gg-home-screen">
        <header className="gg-brand-hero" aria-label="GENEVIEVE Grey Nomads Australian touring">
          <div className="gg-landscape" aria-hidden="true" />
          <div className="gg-hero-shade" aria-hidden="true" />
          <div className="gg-eucalyptus gg-eucalyptus-left" aria-hidden="true"><i/><i/><i/><i/><i/></div>
          <div className="gg-eucalyptus gg-eucalyptus-right" aria-hidden="true"><i/><i/><i/></div>
          <div className="gg-brand-lockup">
            <BrandMark />
            <div className="gg-brand-name">GENEVIEVE</div>
            <div className="gg-brand-tagline">Safety from roots to every journey.</div>
          </div>
        </header>

        <section className="gg-journey-card" aria-label="Current journey">
          <Link href="/around" className="gg-journey-picture" aria-label="Open Around Me">
            <span className="gg-kangaroo" aria-hidden="true">◆</span>
          </Link>

          <div className="gg-journey-copy">
            <h1>G’day, {travellerName}</h1>

            <Link href="/trip" className="gg-summary-row">
              <SummaryIcon name="pin" />
              <span><strong>Next stop: {destination}</strong><small>{distance}</small></span>
            </Link>

            <Link href="/around" className="gg-summary-row">
              <SummaryIcon name="sun" />
              <span><strong>Conditions: Check before you go</strong><small>Weather and local information</small></span>
            </Link>

            <Link href="/plan" className="gg-summary-row">
              <SummaryIcon name="fuel" />
              <span><strong>Fuel range: {fuelRange}</strong><small>Conservative refuel planning</small></span>
            </Link>

            <Link href="/plan#budget" className="gg-summary-row">
              <SummaryIcon name="money" />
              <span><strong>Budget status: <em className={`gg-status ${summary?.result?.status || ''}`}>{budgetStatus}</em></strong><small>Emergency reserve protected</small></span>
            </Link>
          </div>
        </section>

        <Link href="/safety" className="gg-emergency" aria-label="Open emergency and safety controls">
          <span className="gg-emergency-shield" aria-hidden="true"><b>+</b></span>
          <span className="gg-emergency-copy"><strong>Emergency / Safety</strong><small>Tap for immediate assistance</small></span>
          <span className="gg-chevron" aria-hidden="true">›</span>
        </Link>

        <section className="gg-action-grid" aria-label="Travel tools">
          {actions.map((action) => (
            <Link href={action.href} className={`gg-action-card gg-art-${action.art || 'plain'}`} key={action.title}>
              <span className="gg-action-art" aria-hidden="true" />
              <span className="gg-action-icon"><HomeIcon name={action.icon} /></span>
              <strong>{action.number}. {action.title}</strong>
              <span className="gg-tile-chevron" aria-hidden="true">›</span>
            </Link>
          ))}
        </section>

        <section className="gg-budget-strip" aria-label="Trip budget snapshot">
          <Link href="/plan#budget" className="gg-budget-icon" aria-label="Open budget planner">
            <span>$</span>
          </Link>
          <Link href="/plan#budget"><small>Trip budget</small><strong>{money(summary?.result?.totalBudget)}</strong></Link>
          <Link href="/plan#budget"><small>Spent</small><strong>{money(summary?.result?.spendBeforeReserve)}</strong></Link>
          <Link href="/plan#budget"><small>Available</small><strong className="gg-available">{money(summary?.result?.available)}</strong></Link>
          <Link href="/plan#budget"><small>Emergency<br/>reserve</small><strong className="gg-reserve">{money(summary?.result?.emergencyReserve)}</strong></Link>
        </section>

        <BottomNav current="Home" />
      </section>
    </main>
  );
}
