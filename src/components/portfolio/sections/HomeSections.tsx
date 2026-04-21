import React from 'react';
import type { PageId, Post, Project } from '../types';
import { ThumbPost } from '../thumbnails';
import { WorkCard } from './WorkCard';

export function FeaturedWork({
  openProject,
  go,
  webProjects,
  gameProjects,
}: {
  openProject: (p: Project) => void;
  go: (id: PageId) => void;
  webProjects: Project[];
  gameProjects: Project[];
}) {
  const featured = [...webProjects.slice(0, 2), ...gameProjects.slice(0, 2)];
  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <div className="section-num">02 / selected</div>
          <h2 className="section-title display">Selected work</h2>
          <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>A mix of recent web and games. More on each sub-page.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="nav-link active" onClick={() => go('web')}>→ Web work</button>
          <button type="button" className="nav-link" onClick={() => go('games')}>→ Games</button>
        </div>
      </div>
      <div className="work-grid">
        {featured.map((p, i) => <WorkCard key={p.id} project={p} onClick={() => openProject(p)} i={i} />)}
      </div>
    </section>
  );
}

export function HomeBlogTeaser({
  openPost,
  go,
  posts,
}: {
  openPost: (p: Post) => void;
  go: (id: PageId) => void;
  posts: Post[];
}) {
  const teaserPosts = posts.slice(0, 3);
  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <div className="section-num">03 / latest</div>
          <h2 className="section-title display">From the devlog</h2>
        </div>
        <button type="button" className="nav-link" onClick={() => go('blog')}>All posts →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {teaserPosts.map((p) => (
          <article key={p.id} className="card" style={{ cursor: 'pointer' }}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPost(p); } }}
            onClick={() => openPost(p)}>
            <div style={{ aspectRatio: '16/10', borderBottom: '2px solid var(--line)', overflow: 'hidden' }}>
              <ThumbPost post={p} />
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <span className={`pill ${p.tag === 'Devlog' ? 'plum' : p.tag === 'Design' ? 'red' : p.tag === 'Code' ? 'cobalt' : 'lime'}`}>{p.tag}</span>
                <span className="mono" style={{ color: 'var(--muted)' }}>{p.date}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 8 }}>{p.title}</div>
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeCTA({ go }: { go: (id: PageId) => void }) {
  return (
    <section className="section">
      <div className="wrap">
        <div style={{ border: '2px solid var(--line)', borderRadius: 24, padding: '64px 40px', background: 'var(--ink)', color: 'var(--bg)', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 14 }}>→ Available May 2026</div>
            <div className="display" style={{ fontSize: 'clamp(40px, 6vw, 78px)', lineHeight: 0.95, margin: 0 }}>
              Got a weird<br />brief? <span style={{ color: 'var(--red)' }}>Let's talk.</span>
            </div>
            <p style={{ maxWidth: 520, marginTop: 20, fontSize: 18, opacity: 0.85 }}>1-2 slots opening in May. Web, brand, a bit of product. Small teams doing unusual things only.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <button type="button" className="btn btn-alt" onClick={() => go('contact')}>Start a project <span>→</span></button>
            <button type="button" className="btn btn-ghost" onClick={() => go('resume')}>See the resume</button>
            <button type="button" className="btn btn-lime" onClick={() => go('now')}>What I'm up to</button>
          </div>
        </div>
      </div>
    </section>
  );
}
