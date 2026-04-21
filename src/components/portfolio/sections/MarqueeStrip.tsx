import React from 'react';

export function MarqueeStrip() {
  const items = ['Available May 2026', 'Interactive prototypes', 'Web design', 'Indie games', 'Design systems', 'Brooklyn / Lisbon', 'Taking clients'];
  const full = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {full.map((it, i) => (
          <span key={i}><span>{it}</span><span className="dot" /></span>
        ))}
      </div>
    </div>
  );
}
