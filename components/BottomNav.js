import Link from 'next/link';

const items = [
  ['Home', '/', '⌂'],
  ['Plan', '/plan', '⌖'],
  ['Around Me', '/around', '◎'],
  ['Safety', '/safety', '◇'],
  ['My Trip', '/trip', '▣']
];

export default function BottomNav({ current = 'Home' }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(([label, href, icon]) => (
        <Link key={label} href={href} className={current === label ? 'active' : ''}>
          <span aria-hidden="true">{icon}</span>
          <small>{label}</small>
        </Link>
      ))}
    </nav>
  );
}
