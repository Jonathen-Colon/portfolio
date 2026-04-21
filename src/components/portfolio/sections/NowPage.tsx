import React from 'react';
import type { NowItem } from '../types';

export function NowPage({ nowItems }: { nowItems: NowItem[] }) {
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">06 / now</div>
            <h2 className="section-title display">What I'm up to</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>Updated April 12, 2026. A short list — what's actually happening this month.</p>
          </div>
          <span className="pill mint">● Live · updated monthly</span>
        </div>
        <div className="now-grid">
          {nowItems.map((it, i) => (
            <div key={i} className={`now-card ${it.color}${i === 0 ? ' big' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="now-icon">{it.icon}</div>
                {it.progress != null && <span className="mono">{it.progress}%</span>}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.05 }}>{it.title}</div>
                <p style={{ margin: '10px 0 0', opacity: 0.92 }}>{it.body}</p>
              </div>
              {it.progress != null && (
                <div className="progress"><div className="progress-bar" style={{ width: `${it.progress}%` }} /></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
