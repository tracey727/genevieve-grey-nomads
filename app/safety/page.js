import Shell from '../../components/Shell';

export default function SafetyPage() {
  return (
    <Shell current="Safety">
      <section className="page-heading"><p className="eyebrow">Safety</p><h2>Critical actions stay simple</h2><p>This build keeps emergency access separate from travel convenience features. Live weather, fire, flood, tide and road feeds are not labelled live until verified providers are connected.</p></section>
      <section className="safety-grid">
        <a className="safety-card urgent" href="tel:000"><strong>Call 000</strong><span>Police, Fire or Ambulance</span></a>
        <a className="safety-card" href="https://www.google.com/maps/search/?api=1&query=hospital" target="_blank" rel="noreferrer"><strong>Nearest hospital</strong><span>Open map search ↗</span></a>
        <a className="safety-card" href="https://www.google.com/maps/search/?api=1&query=emergency+vet" target="_blank" rel="noreferrer"><strong>Emergency vet</strong><span>Open map search ↗</span></a>
        <a className="safety-card" href="https://www.google.com/maps/search/?api=1&query=police+station" target="_blank" rel="noreferrer"><strong>Police station</strong><span>Open map search ↗</span></a>
      </section>
      <section className="panel verification-panel"><h3>Safety data status</h3><dl className="verification-list"><div><dt>Weather / BOM</dt><dd>Provider not connected — no live claim</dd></div><div><dt>Road closures</dt><dd>Provider not connected — no live claim</dd></div><div><dt>Tides / coastal</dt><dd>Provider not connected — no live claim</dd></div><div><dt>Fuel prices</dt><dd>Provider not connected — use map search / verified source</dd></div></dl></section>
    </Shell>
  );
}
