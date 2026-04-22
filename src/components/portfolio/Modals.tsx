import React, { useEffect } from 'react';
import type { Post, Project } from '../../data/portfolioContent';
import { ProjectThumb, ThumbPost } from './Thumbnails';

/** Open in a new tab; add https:// when the URL has no scheme (e.g. admin-pasted domains). */
function externalHref(raw: string): string {
  const t = raw.trim();
  if (!t) return '#';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-hero">
          <ProjectThumb id={project.id} media={project.media} />
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span className={`pill ${project.accent}`}>{project.kind}</span>
            <span className="pill">{project.year}</span>
            <span className="pill">{project.role}</span>
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 18px' }}>
            {project.title}
          </h2>
          <p style={{ fontSize: 18, color: 'var(--ink-soft)', margin: '0 0 24px' }}>{project.desc}</p>
          {project.body.map((p, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
              {p}
            </p>
          ))}
          {project.shots && (
            <div className="modal-shots-grid">
              {project.shots.map((s, i) => (
                <div key={i} style={{ aspectRatio: '4/3', border: '2px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                  <div className={`th ${s}`} style={{ width: '100%', height: '100%' }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {project.live && (
              <a
                className="btn btn-alt"
                href={externalHref(project.live)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live site <span>↗</span>
              </a>
            )}
            {project.repo && (
              <a
                className="btn btn-ghost"
                href={externalHref(project.repo)}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span>↗</span>
              </a>
            )}
            {project.itch && (
              <a
                className="btn btn-lime"
                href={externalHref(project.itch)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Play on itch.io <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-hero">
          <ThumbPost post={post} />
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
            <span
              className={`pill ${
                post.tag === 'Devlog' ? 'plum' : post.tag === 'Design' ? 'red' : post.tag === 'Code' ? 'cobalt' : 'lime'
              }`}
            >
              {post.tag}
            </span>
            <span className="mono" style={{ color: 'var(--muted)' }}>
              {post.date}
            </span>
            <span className="mono" style={{ color: 'var(--muted)' }}>
              · {post.read}
            </span>
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', margin: '0 0 20px', lineHeight: 1.02 }}>
            {post.title}
          </h2>
          <p style={{ fontSize: 20, lineHeight: 1.5, color: 'var(--ink-soft)', fontWeight: 500, margin: '0 0 24px' }}>{post.excerpt}</p>
          {post.body.map((p, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
              {p}
            </p>
          ))}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: '2px dashed var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div className="mono" style={{ color: 'var(--muted)' }}>
              — Jon
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="pill">Reply →</span>
              <span className="pill">Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
