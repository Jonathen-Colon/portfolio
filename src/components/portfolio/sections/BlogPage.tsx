import React from 'react';
import type { Post } from '../types';
import { ThumbPost } from '../thumbnails';

export function BlogPage({ openPost, posts }: { openPost: (p: Post) => void; posts: Post[] }) {
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">04 / devlog</div>
            <h2 className="section-title display">Devlog</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>Short posts about what I'm making and why. Unfiltered.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="pill sun">RSS</span>
            <span className="pill">{posts.length} posts</span>
          </div>
        </div>
        <div className="devlog">
          {posts.map(p => (
            <div key={p.id} className="devlog-entry" role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPost(p); } }}
              onClick={() => openPost(p)}>
              <div>
                <div className="devlog-date">{p.date}</div>
                <div style={{ marginTop: 6 }}>
                  <span className={`pill ${p.tag === 'Devlog' ? 'plum' : p.tag === 'Design' ? 'red' : p.tag === 'Code' ? 'cobalt' : 'lime'}`}>{p.tag}</span>
                </div>
              </div>
              <div>
                <div className="devlog-title">{p.title}</div>
                <div className="devlog-excerpt">{p.excerpt}</div>
                <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.read} · read →</div>
              </div>
              <div className="devlog-thumb"><ThumbPost post={p} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
