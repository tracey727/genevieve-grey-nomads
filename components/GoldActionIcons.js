function IconBase({ children }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Pine({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.72">
      <path d="M0 15V2" />
      <path d="M0 3l-5 6h10L0 3Z" />
      <path d="M0 7l-7 7h14L0 7Z" />
    </g>
  );
}

export function JourneyGoldIcon() {
  return (
    <IconBase>
      <g opacity="0.64">
        <Pine x="18" y="23" scale="0.82" />
        <Pine x="29" y="20" scale="1" />
        <Pine x="72" y="21" scale="0.88" />
        <Pine x="80" y="27" scale="0.68" />
      </g>
      <path d="M10 44c10-7 19-12 28-12 9 0 15 4 23 4 8 0 15-4 25-11" opacity="0.5" />
      <path d="M13 77c17-6 30-12 37-20 8-9 7-16 17-24" strokeWidth="4.8" opacity="0.34" />
      <path d="M14 78c17-7 30-13 37-21 8-9 7-16 18-24" strokeWidth="2.1" />
      <path d="M41 74c6-4 12-8 16-13M54 54c4-5 5-9 8-14" strokeWidth="1.2" opacity="0.7" />
      <path d="M8 82h80" opacity="0.18" />
    </IconBase>
  );
}

export function PlanGoldIcon() {
  return (
    <IconBase>
      <path d="M10 25l23-8 29 9 24-9v54l-24 8-29-9-23 8V25Z" strokeWidth="2.2" />
      <path d="M33 17v53M62 26v53" opacity="0.78" />
      <path d="M17 59c9-12 18-10 27-18 8-7 13-5 23 2 7 5 11 4 18 0" strokeDasharray="4 5" opacity="0.66" />
      <path d="M59 16c0-8 6-14 14-14s14 6 14 14c0 12-14 25-14 25S59 28 59 16Z" fill="currentColor" strokeWidth="0" />
      <circle cx="73" cy="16" r="4.2" fill="#08243a" stroke="none" />
      <circle cx="73" cy="16" r="2.2" opacity="0.35" />
    </IconBase>
  );
}

export function AroundGoldIcon() {
  return (
    <IconBase>
      <g opacity="0.58">
        <Pine x="18" y="28" scale="0.84" />
        <Pine x="28" y="23" scale="0.64" />
        <Pine x="70" y="31" scale="0.76" />
        <Pine x="80" y="26" scale="0.58" />
      </g>
      <path d="M8 45c13-7 24-9 35-4 10 5 17 5 27 1 7-3 13-4 18-3" opacity="0.42" />
      <path d="M13 80c12-3 24-7 33-14 10-7 14-16 23-22" strokeWidth="5" opacity="0.26" />
      <path d="M13 80c12-3 24-7 33-14 10-7 14-16 23-22" strokeWidth="1.9" />
      <path d="M55 68c4-4 7-8 10-13" opacity="0.68" />
      <path d="M45 18c0-8 6-14 14-14s14 6 14 14c0 12-14 25-14 25S45 30 45 18Z" fill="currentColor" strokeWidth="0" />
      <circle cx="59" cy="18" r="4.1" fill="#08243a" stroke="none" />
    </IconBase>
  );
}

export function SafetyGoldIcon() {
  return (
    <IconBase>
      <path d="M48 7 78 18v23c0 21-12 37-30 47C30 78 18 62 18 41V18L48 7Z" strokeWidth="3" />
      <path d="M48 14 70 22v18c0 16-8 29-22 38-14-9-22-22-22-38V22l22-8Z" opacity="0.34" />
      <path d="M34 46l9 9 19-21" strokeWidth="2.6" />
      <path d="M22 20 48 10l26 10" opacity="0.3" />
    </IconBase>
  );
}

export function BudgetGoldIcon() {
  return (
    <IconBase>
      <rect x="24" y="8" width="48" height="80" rx="7" strokeWidth="2.8" />
      <rect x="31" y="17" width="34" height="16" rx="3" strokeWidth="2" />
      <path d="M34 24h28" opacity="0.34" />
      <g strokeWidth="2.1">
        <rect x="31" y="42" width="8" height="8" rx="1.5" />
        <rect x="44" y="42" width="8" height="8" rx="1.5" />
        <rect x="57" y="42" width="8" height="8" rx="1.5" />
        <rect x="31" y="56" width="8" height="8" rx="1.5" />
        <rect x="44" y="56" width="8" height="8" rx="1.5" />
        <rect x="57" y="56" width="8" height="22" rx="1.5" />
        <rect x="31" y="70" width="8" height="8" rx="1.5" />
        <rect x="44" y="70" width="8" height="8" rx="1.5" />
      </g>
    </IconBase>
  );
}

export function TripGoldIcon() {
  return (
    <IconBase>
      <path d="M12 58h62c6 0 10 4 10 10v4H12V58Z" strokeWidth="2.4" />
      <path d="M21 58V33c0-7 5-12 12-12h27c7 0 13 4 16 10l8 17v10" strokeWidth="2.5" />
      <rect x="30" y="29" width="22" height="17" rx="3" />
      <rect x="59" y="29" width="12" height="14" rx="3" />
      <path d="M18 58h-8M84 58h6M16 65H8" opacity="0.72" />
      <circle cx="32" cy="72" r="8" fill="#08243a" strokeWidth="2.4" />
      <circle cx="68" cy="72" r="8" fill="#08243a" strokeWidth="2.4" />
      <circle cx="32" cy="72" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="68" cy="72" r="2.5" fill="currentColor" stroke="none" />
      <path d="M10 72h10M80 72h8" opacity="0.35" />
    </IconBase>
  );
}
