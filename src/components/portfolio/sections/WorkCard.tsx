import React from 'react';
import type { Project } from '../types';
import { ProjectThumb } from '../thumbnails';

export function WorkCard({ project, onClick, i }: { project: Project; onClick: () => void; i: number }) {
  return (
    <div className="work-card" role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      onClick={onClick}
      onMouseEnter={() => document.body.classList.add('cursor-hot')}
      onMouseLeave={() => document.body.classList.remove('cursor-hot')}>
      <div className="work-corner">
        <span className={`pill ${project.accent}`}>{project.year}</span>
      </div>
      <div className="work-thumb">
        <ProjectThumb id={project.id} />
      </div>
      <div className="work-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <div className="work-title">{project.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--muted)' }}>0{i + 1}</div>
        </div>
        <p className="work-desc">{project.desc}</p>
        <div className="work-tags">{project.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
      </div>
    </div>
  );
}
