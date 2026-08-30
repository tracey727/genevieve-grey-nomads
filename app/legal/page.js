import Link from 'next/link';
import Shell from '../../components/Shell';
import styles from './legal.module.css';

export default function LegalPage() {
  return (
    <Shell current="My Trip">
      <section className="page-heading"><p className="eyebrow">Legal</p><h2>Clear rules, not fine-print traps</h2><p>The legal information for GENEVIEVE — The Budget Travels is kept in plain English and linked before subscription purchase.</p></section>
      <section className={styles.linkGrid}>
        <Link className={styles.linkCard} href="/terms"><strong>Terms of Use</strong><span>How the app can be used, safety limitations, third-party services and Australian consumer rights.</span></Link>
        <Link className={styles.linkCard} href="/subscriptions"><strong>Subscription & Refund Policy</strong><span>Recurring charges, renewal, cancellation, failed payments and refunds.</span></Link>
        <Link className={styles.linkCard} href="/privacy"><strong>Privacy Policy</strong><span>What information is collected, why, where it goes and how to contact us.</span></Link>
      </section>
    </Shell>
  );
}
