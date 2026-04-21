import React from 'react';
import { PortraitIllustration } from '../illustrations';

export function AboutPage() {
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">05 / about</div>
            <h2 className="section-title display">Hi, I'm Jon.</h2>
          </div>
        </div>
        <div className="about-grid">
          <div>
            <p style={{ fontSize: 20, lineHeight: 1.5, color: 'var(--ink-soft)', marginTop: 0 }}>
              I design and build on the web. On Sundays, I make small strange games. Ten years of product design, six of shipping code, two of shipping games. I like projects where the brief has a weird edge to it — cozy games, niche tools, loud brands for quiet companies.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Before going independent in 2023, I led design at a few startups and spent a formative summer at R/GA. Now I take 3-4 projects a year and spend the rest of my time on games, writing, and running the neighborhood radio station's website.
            </p>
            <div className="fact-list">
              <div className="fact"><div className="fact-k">Based</div><div className="fact-v">Brooklyn, NY (Lisbon-ish in May)</div></div>
              <div className="fact"><div className="fact-k">Available</div><div className="fact-v">Taking 1-2 new projects starting May</div></div>
              <div className="fact"><div className="fact-k">Stack</div><div className="fact-v">React, Next.js, Godot, Unity, Figma, Aseprite</div></div>
              <div className="fact"><div className="fact-k">Prefer</div><div className="fact-v">Small teams, weird briefs, full control</div></div>
              <div className="fact"><div className="fact-k">Don't</div><div className="fact-v">Web3, generative AI art projects, fintech</div></div>
            </div>
          </div>
          <div>
            <div className="portrait"><PortraitIllustration /></div>
            <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="pill red">Designer</span>
                <span className="pill cobalt">Developer</span>
                <span className="pill plum">Gamedev</span>
                <span className="pill lime">Pixel art</span>
              </div>
              <div className="mono" style={{ color: 'var(--muted)', marginTop: 8 }}>Photo coming soon — placeholder for now</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
