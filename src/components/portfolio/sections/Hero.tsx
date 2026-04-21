import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { PageId } from '../types';
import { HeroBackdrop } from '../illustrations';

export function Hero({ go }: { go: (id: PageId) => void }) {
  const phrases = useMemo(() => [
    'interactive prototypes',
    'devlogs & games',
    'chunky websites',
    'things that click',
    'pixel art at 2 a.m.',
  ], []);
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState('');
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');
  const parallaxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const current = phrases[idx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (sub.length < current.length) {
        t = setTimeout(() => setSub(current.slice(0, sub.length + 1)), 55);
      } else {
        t = setTimeout(() => setPhase('deleting'), 1600);
      }
    } else {
      if (sub.length > 0) {
        t = setTimeout(() => setSub(current.slice(0, sub.length - 1)), 28);
      } else {
        setIdx((idx + 1) % phrases.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [sub, phase, idx, phrases]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      const el = parallaxRef.current;
      if (!el) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;
      el.style.setProperty('--px', String(x));
      el.style.setProperty('--py', String(y));
    }
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <section className="hero wrap" ref={parallaxRef}>
      <div style={{ position: 'absolute', inset: '40px 28px 40px auto', width: 360, pointerEvents: 'none', transform: 'translate(calc(var(--px, 0) * -12px), calc(var(--py, 0) * -8px))', transition: 'transform 120ms linear', zIndex: 0 }}>
        <HeroBackdrop />
      </div>
      <div className="hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="hero-kicker">
            <span className="pill red"><span style={{ width: 8, height: 8, borderRadius: 99, background: '#fff', display: 'inline-block', boxShadow: '0 0 0 2px #141414' }} /> Available May</span>
            <span className="pill">Brooklyn / Lisbon</span>
          </div>
          <h1 className="hero-title display">
            <span className="word">Jon</span>{' '}
            <span className="word accent">Colon</span>
            <br />
            <span className="word outline">makes</span>{' '}
            <span className="word">stuff.</span>
          </h1>
          <p className="hero-sub">
            Designer, developer and part-time game dev. Currently making{' '}
            <span className="typing">{sub}</span>
          </p>
          <div className="hero-ctas">
            <button type="button" className="btn" onClick={() => go('web')}>See the work <span>→</span></button>
            <button type="button" className="btn btn-ghost" onClick={() => go('contact')}>Say hi</button>
          </div>
        </div>
        <div className="hero-side">
          <div className="stat-card lime">
            <div><div className="stat-k">8</div><div className="stat-v">Shipped this year</div></div>
            <div style={{ fontSize: 38 }}>✷</div>
          </div>
          <div className="stat-card cobalt">
            <div><div className="stat-k">2</div><div className="stat-v">Games in-flight</div></div>
            <div style={{ fontSize: 38 }}>◐</div>
          </div>
          <div className="stat-card sun">
            <div><div className="stat-k">14</div><div className="stat-v">Devlog posts</div></div>
            <div style={{ fontSize: 38 }}>❡</div>
          </div>
        </div>
      </div>
    </section>
  );
}
