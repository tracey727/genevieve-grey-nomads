import Link from 'next/link';

const items = [
  { label: 'Home', href: '/', icon: '⌂', aliases: ['Home'] },
  { label: 'Explore', href: '/around', icon: '◇', aliases: ['Explore', 'Around Me'] },
  { label: 'My Maps', href: '/maps', icon: '▱', aliases: ['My Maps', 'Plan', 'My Trip'] },
  { label: 'Messages', href: '/messages', icon: '✉', aliases: ['Messages'] },
  { label: 'More', href: '/more', icon: '☰', aliases: ['More', 'Safety'] }
];

export default function BottomNav({ current = 'Home' }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ label, href, icon, aliases }) => (
        <Link key={label} href={href} className={aliases.includes(current) ? 'active' : ''}>
          <span aria-hidden="true">{icon}</span>
          <small>{label}</small>
        </Link>
      ))}
    </nav>
  );
}
