import Shell from '../../components/Shell';
import EmergencyCallControl from '../../components/EmergencyCallControl';

export default function SafetyPage() {
  return (
    <Shell current="Safety">
      <section className="page-heading"><p className="eyebrow">Safety</p><h2>Critical actions stay simple</h2><p>Emergency access stays separate from travel convenience features. Weather and fuel data are shown as live only when their verified provider gate succeeds; otherwise GENEVIEVE fails closed and shows no unverified live value.</p></section>
      <EmergencyCallControl />
      <section className="safety-grid">
        <a className="safety-card" href="https://www.google.com/maps/search/?api=1&query=hospital" target="_blank" rel="noreferrer"><strong>Nearest hospital</strong><span>Open map search ↗</span></a>
        <a className="safety-card" href="https://www.google.com/maps/search/?api=1&query=emergency+vet" target="_blank" rel="noreferrer"><strong>Emergency vet</strong><span>Open map search ↗</span></a>
        <a className="safety-card" href="https://www.google.com/maps/search/?api=1&query=police+station" target="_blank" rel="noreferrer"><strong>Police station</strong><span>Open map search ↗</span></a>
      </section>
      <section className="panel verification-panel"><h3>Safety data status</h3><dl className="verification-list"><div><dt>Weather / BOM</dt><dd>Verified-provider gate available — live only when configured and validated</dd></div><div><dt>Road closures</dt><dd>No verified live provider connected — no live claim</dd></div><div><dt>Tides / coastal</dt><dd>No verified live provider connected — no live claim</dd></div><div><dt>Fuel prices</dt><dd>Verified-provider gate available in supported jurisdictions — otherwise no live claim</dd></div></dl></section>
    </Shell>
  );
}
