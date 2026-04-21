import React from 'react';
import type { PageId, Project } from '../types';
import { WorkCard } from './WorkCard';

export function WorkPage({
  go,
  openProject,
  kind,
  projects,
}: {
  go: (id: PageId) => void;
  openProject: (p: Project) => void;
  kind: 'web' | 'games';
  projects: Project[];
}) {
  const title = kind === 'web' ? 'Web design' : 'Game dev';
  const num = kind === 'web' ? '02' : '03';
  const sub = kind === 'web'
    ? 'Sites, products, marketing pages. Half for clients, half for the fun of it.'
    : 'Small weird games I make in my off-hours. Two shipped, two in progress.';
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">{num} / {kind}</div>
            <h2 className="section-title display">{title}</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>{sub}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="pill">{projects.length} projects</span>
            <button type="button" className="nav-link" onClick={() => go(kind === 'web' ? 'games' : 'web')}>→ see {kind === 'web' ? 'games' : 'web'}</button>
          </div>
        </div>
        <div className="work-grid">
          {projects.map((p, i) => <WorkCard key={p.id} project={p} onClick={() => openProject(p)} i={i} />)}
        </div>
      </div>
    </section>
  );
}
