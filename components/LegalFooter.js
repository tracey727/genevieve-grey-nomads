import Link from 'next/link';
import styles from './LegalFooter.module.css';

export default function LegalFooter() {
  return (
    <footer className={styles.footer} aria-label="Legal and membership links">
      <Link href="/billing">Membership</Link>
      <span aria-hidden="true">·</span>
      <Link href="/legal">Legal</Link>
      <span aria-hidden="true">·</span>
      <Link href="/privacy">Privacy</Link>
      <span aria-hidden="true">·</span>
      <a href="mailto:tracey@genevieveapp.com.au">Support</a>
    </footer>
  );
}
