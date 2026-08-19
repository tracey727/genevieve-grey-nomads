export function HeroArt() {
  return (
    <svg className="australiana-vector" viewBox="0 0 760 300" role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0b3557"/><stop offset="0.62" stopColor="#071f36"/><stop offset="1" stopColor="#061727"/></linearGradient>
        <radialGradient id="heroSun"><stop offset="0" stopColor="#ffd98a"/><stop offset="0.48" stopColor="#f09a45"/><stop offset="1" stopColor="#8e351c" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="760" height="300" fill="url(#heroSky)"/>
      <circle cx="585" cy="178" r="68" fill="url(#heroSun)" opacity="0.92"/>
      <circle cx="585" cy="178" r="26" fill="#e8893c" opacity="0.78"/>
      <path d="M0 249 C95 226 160 239 242 231 C340 220 402 246 487 237 C581 227 655 201 760 217 L760 300 L0 300 Z" fill="#03111c" opacity="0.96"/>
      <path d="M0 268 C122 246 198 263 296 253 C407 241 492 270 596 251 C665 238 716 236 760 244 L760 300 L0 300 Z" fill="#020b12"/>
      <g fill="none" stroke="#7f9274" strokeWidth="3.2" strokeLinecap="round" opacity="0.58">
        <path d="M52 20 C72 66 83 112 72 171"/>
        <path d="M75 52 C105 46 126 30 143 12"/><path d="M77 75 C110 73 135 61 160 40"/><path d="M80 101 C113 105 143 96 173 77"/><path d="M77 130 C111 139 141 137 173 125"/>
        <path d="M708 38 C686 83 680 124 690 172"/>
        <path d="M689 66 C658 57 635 41 618 20"/><path d="M686 94 C654 91 625 80 600 57"/><path d="M687 123 C653 127 622 119 592 101"/>
      </g>
      <g fill="#75866c" opacity="0.53">
        <ellipse cx="117" cy="34" rx="19" ry="6" transform="rotate(-35 117 34)"/><ellipse cx="141" cy="57" rx="21" ry="6" transform="rotate(-28 141 57)"/><ellipse cx="153" cy="88" rx="20" ry="6" transform="rotate(-18 153 88)"/><ellipse cx="144" cy="121" rx="20" ry="6" transform="rotate(4 144 121)"/>
        <ellipse cx="645" cy="45" rx="19" ry="6" transform="rotate(35 645 45)"/><ellipse cx="620" cy="75" rx="21" ry="6" transform="rotate(26 620 75)"/><ellipse cx="608" cy="106" rx="20" ry="6" transform="rotate(18 608 106)"/>
      </g>
    </svg>
  );
}

export function JourneyMedallionArt() {
  return (
    <svg className="journey-medallion-svg" viewBox="0 0 120 140" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="medalSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#214e6b"/><stop offset="0.6" stopColor="#0d304d"/><stop offset="1" stopColor="#081d2f"/></linearGradient>
        <radialGradient id="medalSun"><stop offset="0" stopColor="#ffe09a"/><stop offset="1" stopColor="#e89943"/></radialGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="54" ry="64" fill="url(#medalSky)" stroke="#dfa34d" strokeWidth="1.3"/>
      <circle cx="82" cy="57" r="10" fill="url(#medalSun)"/>
      <path d="M17 102 C38 93 61 96 79 91 C91 88 103 82 111 78 L111 120 L15 120 Z" fill="#07141e" opacity="0.95"/>
      <g fill="#07131d">
        <path d="M38 92 C42 77 51 67 61 66 C71 65 76 71 79 79 C83 75 89 71 96 70 C91 77 86 82 80 86 C77 93 75 102 73 111 L66 111 C66 102 66 95 64 91 C59 96 54 101 51 108 L44 108 C48 99 52 92 57 87 C52 84 48 81 46 77 C43 82 42 88 42 94 Z"/>
        <path d="M59 66 C57 59 58 53 63 48 C66 54 68 59 67 65 Z"/>
        <path d="M64 65 C66 58 70 53 76 50 C76 57 73 62 69 67 Z"/>
        <path d="M39 89 C29 86 22 80 17 72 C28 76 37 78 47 77 Z"/>
      </g>
      <path d="M18 111 C40 106 59 109 78 105 C91 102 101 98 109 92" fill="none" stroke="#d9963d" strokeWidth="1.2" opacity="0.65"/>
    </svg>
  );
}
