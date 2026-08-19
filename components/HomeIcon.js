export default function HomeIcon({ name }) {
  const common = { width: 54, height: 54, viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor', strokeWidth: 2.3, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

  const icons = {
    journey: <svg {...common}><path d="M10 50c8-18 14-30 23-36"/><path d="M28 15l6-2-1 6"/><path d="M18 51c8-7 14-10 21-11 6-1 10 1 15 6"/><path d="M15 41c6-2 10-5 13-10"/></svg>,
    plan: <svg {...common}><path d="M10 13l14-5 16 5 14-5v43l-14 5-16-5-14 5z"/><path d="M24 8v43M40 13v43"/><path d="M29 33c0-7 10-7 10 0 0 6-5 10-5 10s-5-4-5-10z"/><circle cx="34" cy="33" r="1.5"/></svg>,
    around: <svg {...common}><path d="M32 7c-9 0-16 7-16 16 0 12 16 29 16 29s16-17 16-29C48 14 41 7 32 7z"/><circle cx="32" cy="23" r="5"/><path d="M10 50c7-5 13-6 20-4M36 47c8-4 14-3 18 1"/></svg>,
    safety: <svg {...common}><path d="M32 7l19 7v14c0 13-8 23-19 29C21 51 13 41 13 28V14z"/><path d="M24 32l5 5 11-12"/></svg>,
    budget: <svg {...common}><rect x="15" y="8" width="34" height="48" rx="4"/><rect x="21" y="14" width="22" height="10" rx="2"/><path d="M22 32h3M31 32h3M40 32h3M22 40h3M31 40h3M40 40h3M22 48h3M31 48h3M40 48h3"/></svg>,
    trip: <svg {...common}><path d="M10 39h44v12H10z"/><path d="M16 39V25h29l7 14"/><path d="M23 25v14M38 25v14"/><circle cx="20" cy="52" r="4"/><circle cx="46" cy="52" r="4"/><path d="M8 44H4M60 44h-4"/></svg>
  };

  return icons[name] || icons.journey;
}
