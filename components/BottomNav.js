import Link from 'next/link';

function NavIcon({ name }) {
  const common = { width: 23, height: 23, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

  if (name === 'home') return <svg {...common}><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>;
  if (name === 'explore') return <svg {...common}><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/></svg>;
  if (name === 'maps') return <svg {...common}><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/><circle cx="15" cy="11" r="1.8"/></svg>;
  if (name === 'messages') return <svg {...common}><path d="M4 5.5h16v11H9l-5 3v-14z"/><path d="M8 9h8M8 12.5h6"/></svg>;
  return <svg {...common}><path d="M5 7h14M5 12h14M5 17h14"/></svg>;
}

const items = [
  ['HOME', '/', 'home'],
  ['EXPLORE', '/around', 'explore'],
  ['MY MAPS', '/plan', 'maps'],
  ['MESSAGES', '/trip', 'messages'],
  ['MORE', '/safety', 'more']
];

export default function BottomNav({ current = 'HOME' }) {
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
