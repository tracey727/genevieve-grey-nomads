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
              <div className="gg-brand-artwork gg-brand-artwork-user">
                <img
                  className="gg-brand-user-logo"
                  src="/genevieve-tree-logo.webp"
                  alt="GENEVIEVE tree, infinity and roots logo"
                />
              </div>
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
