import Link from 'next/link';
import Shell from '../../components/Shell';

export default function MorePage() {
  return (
    <Shell current="More">
      <section className="page-heading"><p className="eyebrow">More</p><h2>GENEVIEVE travel controls</h2><p>Everything that should stay one tap away without overcrowding the front screen.</p></section>
      <section className="nearby-grid">
        <Link className="nearby-card" href="/safety"><strong>Safety</strong><span>Emergency and safety controls →</span></Link>
        <Link className="nearby-card" href="/billing"><strong>Membership</strong><span>Subscription and payment settings →</span></Link>
        <Link className="nearby-card" href="/trip"><strong>My trip</strong><span>Saved journeys →</span></Link>
        <Link className="nearby-card" href="/plan"><strong>Budget planner</strong><span>Plan safely →</span></Link>
        <Link className="nearby-card" href="/privacy"><strong>Privacy</strong><span>Read privacy information →</span></Link>
        <Link className="nearby-card" href="/terms"><strong>Terms</strong><span>Read terms →</span></Link>
      </section>
    </Shell>
  );
}
