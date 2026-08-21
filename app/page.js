'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import HomeIcon from '../components/HomeIcon';

const actions = [
  { title: 'Continue journey', href: '/trip', icon: 'journey', copy: 'Pick up your current trip and saved details.' },
  { title: 'Plan a trip', href: '/plan', icon: 'plan', copy: 'Build a route around distance, time and budget.' },
  { title: 'Around me', href: '/around', icon: 'around', copy: 'Check useful places and verified local conditions.' },
  { title: 'Safety', href: '/safety', icon: 'safety', copy: 'Open safety guidance and emergency controls.' },
  { title: 'Budget planner', href: '/plan#budget', icon: 'budget', copy: 'Keep fuel, food, camping and reserve money visible.' },
  { title: 'My trip', href: '/trip', icon: 'trip', copy: 'Review, save, clear or delete your journeys.' }
];

function money(value) {
  return value != null && Number.isFinite(Number(value)) ? `$${Number(value).toLocaleString('en-AU')}` : '—';
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
  const distance = summary?.result?.totalDistanceKm ? `${summary.result.totalDistanceKm.toLocaleString('en-AU')} km` : 'Not planned';
  const fuelRange = summary?.result?.safeRangeKm ? `${summary.result.safeRangeKm.toLocaleString('en-AU')} km` : 'Add vehicle details';
  const budgetStatus = summary?.result?.status ? summary.result.status.replace('-', ' ') : 'Ready to plan';

  return (
    <main className="app-shell premium-app-shell">
      <section className="screen-frame premium-home premium-home-v3">
        <section className="home-hero" aria-label="GENEVIEVE Grey Nomads">
          <div className="hero-kicker">Grey Nomads · Australian touring</div>
          <div className="hero-constellation" aria-hidden="true">
            <span className="star hero-star-one" />
            <span className="star hero-star-two" />
            <span className="star hero-star-three" />
            <span className="star hero-star-four" />
            <span className="star hero-star-five" />
          </div>
          <BrandHeader />
          <div className="hero-copy">
            <p>Thoughtful planning for long roads, quiet stops and the freedom to travel well.</p>
            <div className="hero-trust-row" aria-label="Planning priorities">
              <span>Roads</span><i />
              <span>Budget</span><i />
              <span>Safety</span>
            </div>
          </div>
          <div className="hero-country-note">Made for the road ahead</div>
          <div className="australian-horizon" aria-hidden="true">
            <span className="horizon-sun" />
            <span className="horizon-range horizon-range-one" />
            <span className="horizon-range horizon-range-two" />
            <span className="horizon-road" />
            <span className="horizon-road-centre" />
          </div>
        </section>

        <section className="journey-overview" aria-label="Current journey">
          <div className="journey-heading">
            <span className="section-label">Your journey</span>
            <h2>G’day, {travellerName}</h2>
            <p>{summary ? 'Your current trip is ready when you are.' : 'Start with a simple plan and GENEVIEVE will keep the important details together.'}</p>
          </div>
          <div className="journey-facts">
            <Link href="/trip" className="journey-fact">
              <small>Next stop</small>
              <strong>{destination}</strong>
              <span>{distance}</span>
            </Link>
            <Link href="/around" className="journey-fact">
              <small>Conditions</small>
              <strong>Check before you go</strong>
              <span>Weather and nearby information</span>
            </Link>
            <Link href="/plan" className="journey-fact">
              <small>Fuel range</small>
              <strong>{fuelRange}</strong>
              <span>Conservative planning range</span>
            </Link>
            <Link href="/plan#budget" className="journey-fact">
              <small>Budget</small>
              <strong className={`status ${summary?.result?.status || ''}`}>{budgetStatus}</strong>
              <span>Reserve remains protected</span>
            </Link>
          </div>
        </section>

        <Link href="/safety" className="premium-safety-bar" aria-label="Open safety and emergency controls">
          <span className="premium-safety-icon" aria-hidden="true">✚</span>
          <span className="premium-safety-copy"><small>Safety first</small><strong>Emergency & safety</strong><em>Open guarded safety controls</em></span>
          <span className="premium-safety-arrow" aria-hidden="true">›</span>
        </Link>

        <section className="home-actions" aria-labelledby="home-actions-title">
          <div className="home-section-heading">
            <div><span className="section-label">Travel tools</span><h2 id="home-actions-title">Everything you need, without the clutter</h2></div>
          </div>
          <div className="premium-action-grid">
            {actions.map((action, index) => (
              <Link href={action.href} className="premium-action-card" key={action.title}>
                <span className="action-number">0{index + 1}</span>
                <span className="action-icon"><HomeIcon name={action.icon} /></span>
                <span className="action-copy"><strong>{action.title}</strong><small>{action.copy}</small></span>
                <span className="action-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="premium-budget-card" aria-label="Trip budget snapshot">
          <div className="budget-card-heading">
            <div><span className="section-label">Trip money</span><h2>Know what is safe to spend</h2></div>
            <Link href="/plan#budget">Open planner <span aria-hidden="true">›</span></Link>
          </div>
          <div className="premium-budget-metrics">
            <div><small>Trip budget</small><strong>{money(summary?.result?.totalBudget)}</strong></div>
            <div><small>Planned spend</small><strong>{money(summary?.result?.spendBeforeReserve)}</strong></div>
            <div><small>Available</small><strong className="available-value">{money(summary?.result?.available)}</strong></div>
            <div><small>Emergency reserve</small><strong className="reserve-value">{money(summary?.result?.emergencyReserve)}</strong></div>
          </div>
        </section>

        <div className="home-signoff" aria-hidden="true"><span /> Safety from roots to every journey. <span /></div>
        <BottomNav current="Home" />
      </section>
    </main>
  );
}
