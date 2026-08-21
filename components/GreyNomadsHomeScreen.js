import Link from 'next/link';
import BottomNav from './BottomNav';

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

function MetallicTreeEmblem() {
  return (
    <svg className="gg-brand-emblem" viewBox="0 0 260 300" role="img" aria-label="GENEVIEVE tree, infinity and roots emblem">
      <defs>
        <linearGradient id="metalGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1bd" />
          <stop offset="0.18" stopColor="#d9a34f" />
          <stop offset="0.42" stopColor="#8c5a20" />
          <stop offset="0.64" stopColor="#f0c879" />
          <stop offset="0.82" stopColor="#b8782c" />
          <stop offset="1" stopColor="#f8dfa3" />
        </linearGradient>
        <radialGradient id="goldGlow" cx="50%" cy="44%" r="62%">
          <stop offset="0" stopColor="#f2c973" stopOpacity=".22" />
          <stop offset="1" stopColor="#f2c973" stopOpacity="0" />
        </radialGradient>
        <filter id="softGoldShadow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity=".48" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#e7b65c" floodOpacity=".22" />
        </filter>
      </defs>

      <ellipse cx="130" cy="145" rx="105" ry="120" fill="url(#goldGlow)" />
      <g fill="none" stroke="url(#metalGold)" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGoldShadow)">
        <path strokeWidth="5" d="M130 106c-15-17-37-25-55-18-24 9-27 37-7 51 19 14 43 5 62-17 19 22 43 31 62 17 20-14 17-42-7-51-18-7-40 1-55 18Z" />
        <path strokeWidth="5" d="M130 122c-18 21-28 42-17 60 8 13 26 13 34 0 11-18 1-39-17-60Z" />
        <path strokeWidth="4.5" d="M130 88c-16-18-25-37-15-52 7-11 23-11 30 0 10 15 1 34-15 52Z" />
        <path strokeWidth="4.5" d="M130 182c-15 18-23 38-13 52 7 10 20 10 27 0 10-14 2-34-14-52Z" />

        <path strokeWidth="3.8" d="M130 36V16M130 23l-14-12M130 22l15-11M130 34l-22-7M130 32l23-7" />
        <path strokeWidth="3.1" d="M116 17 106 7M144 17l10-9M107 27 93 22M153 25l15-5M118 10l-5-8M143 10l5-8" />
        <path strokeWidth="3.4" d="M130 58c-15-10-31-12-45-5M130 58c15-10 31-12 45-5M116 49c-10-8-23-10-34-6M144 49c10-8 23-10 34-6" />
        <path strokeWidth="2.8" d="M88 52 76 43M91 58 74 57M172 51l12-9M169 58l18-1M105 39 96 30M155 39l9-10" />

        <path strokeWidth="4.2" d="M130 234v18M130 250c-7 12-17 21-31 31M130 250c7 12 18 21 32 31M130 253c0 13 0 25-1 38" />
        <path strokeWidth="3" d="M116 264 105 291M144 264l11 27M104 276l-21 16M156 277l21 16M124 276l-6 20M137 277l7 20" />
        <path strokeWidth="2.1" d="M99 282 91 298M161 282l8 16M83 292l-12 6M177 293l12 5M118 296l-7 3M144 296l8 3" />
      </g>
      <g fill="#e994ad" opacity=".95" filter="url(#softGoldShadow)">
        <circle cx="159" cy="36" r="4.4"/><circle cx="166" cy="32" r="3.4"/><circle cx="169" cy="40" r="3.2"/><circle cx="154" cy="30" r="3.1"/><circle cx="160" cy="27" r="2.6"/>
      </g>
    </svg>
  );
}

export default function GreyNomadsHomeScreen({ actions, routes, content }) {
  return (
    <main className="app-shell gg-home-shell">
      <section className="screen-frame gg-home-screen" aria-label="GENEVIEVE Grey Nomads Home">
        <div className="gg-home-scroll">
          <header className="gg-brand-hero" aria-label="GENEVIEVE Grey Nomads Australian touring">
            <div className="gg-landscape" aria-hidden="true" />
            <div className="gg-hero-shade" aria-hidden="true" />
            <div className="gg-eucalyptus gg-eucalyptus-left" aria-hidden="true"><i/><i/><i/><i/><i/></div>
            <div className="gg-eucalyptus gg-eucalyptus-right" aria-hidden="true"><i/><i/><i/></div>
            <div className="gg-brand-lockup">
              <div className="gg-brand-artwork"><MetallicTreeEmblem /></div>
              <div className="gg-brand-name">GENEVIEVE</div>
              <div className="gg-brand-tagline">Safety from roots to every journey.</div>
            </div>
          </header>

          <section className="gg-journey-card" aria-label="Current journey">
            <Link href={routes.around} className="gg-journey-picture" aria-label="Open Explore" />

            <div className="gg-journey-copy">
              <h1>G’day, {content.travellerName}</h1>

              <Link href={routes.trip} className="gg-summary-row">
                <SummaryIcon name="pin" />
                <span><strong>Next stop: <b>{content.nextStop}</b></strong></span>
              </Link>

              <Link href={routes.around} className="gg-summary-row">
                <SummaryIcon name="sun" />
                <span><strong>Weather: <b>{content.weather}</b></strong></span>
              </Link>

              <Link href={routes.plan} className="gg-summary-row">
                <SummaryIcon name="fuel" />
                <span><strong>Fuel range: <b>{content.fuelRange}</b></strong></span>
              </Link>

              <Link href={routes.budget} className="gg-summary-row">
                <SummaryIcon name="money" />
                <span><strong>Budget status: <em className="gg-status on-budget">{content.budgetStatus}</em></strong></span>
              </Link>
            </div>
          </section>

          <Link href={routes.safety} className="gg-emergency" aria-label="Open emergency and safety controls">
            <span className="gg-emergency-shield" aria-hidden="true"><b>+</b></span>
            <span className="gg-emergency-copy"><strong>Emergency / Safety</strong><small>Tap for immediate assistance</small></span>
            <span className="gg-chevron" aria-hidden="true">›</span>
          </Link>

          <section className="gg-action-grid" aria-label="Travel tools">
            {actions.map((action) => {
              const Icon = action.Icon;
              return (
                <Link href={action.href} className={`gg-action-card gg-art-${action.art || 'plain'}`} key={action.title}>
                  <span className="gg-action-art" aria-hidden="true" />
                  <span className="gg-action-icon">{Icon ? <Icon /> : null}</span>
                  <strong>{action.number}. {action.title}</strong>
                  <span className="gg-tile-chevron" aria-hidden="true">›</span>
                </Link>
              );
            })}
          </section>

          <section className="gg-budget-strip gg-budget-strip-four" aria-label="Trip budget summary">
            <Link href={routes.budget}><small>Trip budget</small><strong>{content.tripBudget}</strong></Link>
            <Link href={routes.budget}><small>Spent</small><strong>{content.spent}</strong></Link>
            <Link href={routes.budget}><small>Available</small><strong className="gg-available">{content.available}</strong></Link>
            <Link href={routes.budget}><small>Emergency reserve</small><strong className="gg-reserve">{content.emergencyReserve}</strong></Link>
          </section>

          <BottomNav current="HOME" />
        </div>
      </section>
    </main>
  );
}
