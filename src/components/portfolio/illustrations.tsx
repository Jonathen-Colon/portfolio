import React from 'react';

export function HeroBackdrop() {
  return (
    <svg viewBox="0 0 400 460" style={{ width: '100%', height: 'auto', opacity: 0.9 }}>
      <defs>
        <pattern id="dots-bg" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#141414" />
        </pattern>
      </defs>
      <circle cx="280" cy="120" r="85" fill="#C8FF4D" stroke="#141414" strokeWidth="2.5" />
      <rect x="60" y="240" width="140" height="140" rx="20" fill="#FF3B1F" stroke="#141414" strokeWidth="2.5" transform="rotate(-8 130 310)" />
      <polygon points="260,280 370,280 370,400 260,400" fill="url(#dots-bg)" stroke="#141414" strokeWidth="2.5" />
      <path d="M 40 110 Q 140 20 240 110 T 440 110" stroke="#141414" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function PortraitIllustration() {
  return (
    <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="400" fill="#FFC83D" />
      <circle cx="60" cy="80" r="30" fill="#FF3B1F" />
      <rect x="240" y="300" width="70" height="70" fill="#2E4BFF" transform="rotate(12 275 335)" />
      <ellipse cx="160" cy="170" rx="70" ry="80" fill="#F4EFE6" stroke="#141414" strokeWidth="2.5" />
      <path d="M 100 140 Q 100 80 160 80 Q 220 80 220 140 Q 220 120 200 115 Q 180 110 160 112 Q 130 114 110 130 Z" fill="#141414" />
      <circle cx="135" cy="170" r="18" fill="none" stroke="#141414" strokeWidth="3" />
      <circle cx="185" cy="170" r="18" fill="none" stroke="#141414" strokeWidth="3" />
      <line x1="153" y1="170" x2="167" y2="170" stroke="#141414" strokeWidth="3" />
      <circle cx="135" cy="170" r="3" fill="#141414" />
      <circle cx="185" cy="170" r="3" fill="#141414" />
      <path d="M 140 205 Q 160 220 180 205" stroke="#141414" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="130" y="240" width="60" height="30" fill="#F4EFE6" stroke="#141414" strokeWidth="2.5" />
      <path d="M 60 280 Q 60 260 100 260 L 220 260 Q 260 260 260 280 L 260 400 L 60 400 Z" fill="#FF3B1F" stroke="#141414" strokeWidth="2.5" />
      <text x="160" y="330" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="30" fill="#F4EFE6">★</text>
      <g transform="translate(240, 100) rotate(10)">
        <circle r="34" fill="#C8FF4D" stroke="#141414" strokeWidth="2" />
        <text textAnchor="middle" y="-2" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141414">MAKES</text>
        <text textAnchor="middle" y="12" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141414">STUFF</text>
      </g>
    </svg>
  );
}
