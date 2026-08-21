import Link from 'next/link';

function NavIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'home') return <svg {...common}><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>;
  if (name === 'plan') return <svg {...common}><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/><circle cx="15" cy="11" r="1.8"/></svg>;
  if (name === 'around') return <svg {...common}><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/></svg>;
  if (name === 'safety') return <svg {...common}><path d="M12 3 19 6v5c0 4.6-2.7 7.8-7 10-4.3-2.2-7-5.4-7-10V6z"/><path d="m9.3 12 1.7 1.7 3.8-4"/></svg>;
  return <svg {...common}><path d="M4 6.5h16v11H4z"/><path d="M8 6.5V5h8v1.5"/><path d="M8 11h8M8 14.5h5"/></svg>;
}

const items = [
  ['Home', '/', 'home'],
  ['Plan', '/plan', 'plan'],
  ['Around Me', '/around', 'around'],
  ['Safety', '/safety', 'safety'],
  ['My Trip', '/trip', 'trip']
];

export default function BottomNav({ current = 'Home' }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(([label, href, icon]) => (
        <Link key={label} href={href} className={current === label ? 'active' : ''}>
          <NavIcon name={icon} />
          <small>{label}</small>
        </Link>
      ))}
    </nav>
  );
}
