function IconBase({ children }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function JourneyGoldIcon() {
  return <IconBase><path d="M11 50c8-18 15-29 24-36"/><path d="M29 15l7-2-2 7"/><path d="M17 50c8-7 15-10 23-10 6 0 10 2 14 6"/><path d="M16 39c7-2 12-6 16-12"/></IconBase>;
}

export function PlanGoldIcon() {
  return <IconBase><path d="M9 14l15-5 16 5 15-5v42l-15 5-16-5-15 5z"/><path d="M24 9v42M40 14v42"/><path d="M29 31c0-7 10-7 10 0 0 6-5 11-5 11s-5-5-5-11z"/><circle cx="34" cy="31" r="1.6"/></IconBase>;
}

export function AroundGoldIcon() {
  return <IconBase><path d="M32 7c-9 0-16 7-16 16 0 12 16 30 16 30s16-18 16-30C48 14 41 7 32 7z"/><circle cx="32" cy="23" r="5"/><path d="M10 51c8-5 14-6 21-4M37 48c7-4 13-3 17 1"/></IconBase>;
}

export function SafetyGoldIcon() {
  return <IconBase><path d="M32 7l19 7v14c0 13-8 23-19 29C21 51 13 41 13 28V14z"/><path d="M24 32l5 5 11-12"/></IconBase>;
}

export function BudgetGoldIcon() {
  return <IconBase><rect x="15" y="8" width="34" height="48" rx="4"/><rect x="21" y="14" width="22" height="10" rx="2"/><path d="M22 32h3M31 32h3M40 32h3M22 40h3M31 40h3M40 40h3M22 48h3M31 48h3M40 48h3"/></IconBase>;
}

export function TripGoldIcon() {
  return <IconBase><path d="M10 39h44v12H10z"/><path d="M16 39V25h29l7 14"/><path d="M23 25v14M38 25v14"/><circle cx="20" cy="52" r="4"/><circle cx="46" cy="52" r="4"/><path d="M8 44H4M60 44h-4"/></IconBase>;
}
