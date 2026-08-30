import Link from 'next/link';
import Shell from '../../components/Shell';
import styles from '../legal/legal.module.css';

export const metadata = { title: 'Terms of Use | GENEVIEVE — The Budget Travels' };

export default function TermsPage() {
  return (
    <Shell current="My Trip">
      <article className={`panel ${styles.card}`}>
        <p className="eyebrow">GENEVIEVE — The Budget Travels</p><h2>Terms of Use</h2>
        <p className={styles.meta}>Last updated: 19 August 2026</p>
        <p>These Terms apply to the GENEVIEVE — The Budget Travels web application operated by Tracey Ann Kennedy trading as GENEVIEVE App™, ABN 36 530 564 761, PO Box 475, Labrador QLD 4215, Australia (“GENEVIEVE”, “we”, “us” or “our”).</p>

        <h3>1. What the app does</h3>
        <p>GENEVIEVE — The Budget Travels provides travel-planning, budgeting, nearby-search and safety-support tools. Route distances, budgets, fuel estimates, rest-stop suggestions and similar outputs are decision-support information. They are not guarantees of road conditions, fuel availability, prices, weather, campground access, legal permissions or personal safety.</p>
        <p>Where a live official provider has not been connected and verified, the app must not describe that information as live. Current signs, road authorities, emergency services, park operators, councils and other official instructions take priority over app information.</p>

        <h3>2. Your responsibilities</h3>
        <ul><li>Use the app lawfully and safely.</li><li>Check critical route, fuel, weather, road, camping and local-rule information before relying on it.</li><li>Do not use the app in a way that distracts you while driving.</li><li>Keep your device secure because current trip and membership links are associated with that device.</li></ul>

        <h3>3. Emergency and safety access</h3>
        <p>Emergency and core Safety access are designed to remain separate from paid membership. Payment failure, cancellation or subscription status must not block access to the app’s emergency entry points. In an emergency, contact the appropriate emergency service and follow official directions.</p>

        <h3>4. Third-party services</h3>
        <p>The app may open or rely on third-party services such as Stripe, Google Maps, Cloudflare and Neon. Those services operate under their own terms and privacy practices. A link or search result does not mean GENEVIEVE guarantees or endorses the availability, safety, price or suitability of a third-party business or location.</p>

        <h3>5. Subscriptions and payments</h3>
        <p>If you buy a subscription, the recurring price, billing period and renewal nature of the subscription must be displayed before you pay. Stripe processes subscription payments. Your subscription is also governed by our <Link href="/subscriptions">Subscription & Refund Policy</Link>.</p>

        <h3>6. Australian Consumer Law</h3>
        <p>Nothing in these Terms excludes, restricts or modifies any consumer guarantee, right or remedy that cannot lawfully be excluded under the Australian Consumer Law or other applicable law. If the service fails to meet a non-excludable consumer guarantee, you may have rights to a remedy including cancellation, refund or compensation depending on the circumstances.</p>

        <h3>7. Availability and changes</h3>
        <p>We may maintain, improve or change the app. We will not use these Terms to remove non-excludable consumer rights. A material adverse change to a paid subscription will be applied prospectively and, where appropriate, with reasonable notice and an opportunity to cancel before the change takes effect.</p>

        <h3>8. Acceptable use</h3>
        <p>You must not interfere with the app, probe or bypass security controls, use another person’s membership without authority, automate abusive requests, submit unlawful material, or attempt to obtain data that is not yours. We may restrict access where reasonably necessary to protect users, the service or legal rights.</p>

        <h3>9. Intellectual property</h3>
        <p>GENEVIEVE names, branding, app design, original software and original content are owned by or licensed to the operator. These Terms give you a personal, revocable right to use the service; they do not transfer ownership of intellectual property.</p>

        <h3>10. Privacy</h3>
        <p>Our handling of personal information is described in the <Link href="/privacy">Privacy Policy</Link>.</p>

        <h3>11. Liability</h3>
        <p>To the maximum extent permitted by law, GENEVIEVE is not responsible for loss caused solely by inaccurate or unavailable third-party information, a user ignoring official warnings, unsafe driving decisions, device or network failure, or circumstances outside our reasonable control. This clause does not exclude liability or remedies that cannot lawfully be excluded.</p>

        <h3>12. Governing law</h3>
        <p>These Terms are governed by the laws applying in Queensland, Australia, subject to any mandatory rights or jurisdiction that applies to you.</p>

        <h3>13. Contact</h3>
        <p>Email <a href="mailto:tracey@genevieveapp.com.au">tracey@genevieveapp.com.au</a> or write to PO Box 475, Labrador QLD 4215, Australia.</p>
      </article>
    </Shell>
  );
}
