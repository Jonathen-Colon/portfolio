import React from 'react';
import type { Post, Project } from '../../data/portfolioContent';
import { Hero } from './Hero';
import { MarqueeStrip } from './Marquee';
import { FeaturedWork } from './Work';
import { HomeBlogTeaser } from './Blog';

function HomeCTA({ go }: { go: (id: string) => void }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="home-cta-panel">
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: 14,
              }}
            >
              → Available May 2026
            </div>
            <div className="display" style={{ fontSize: 'clamp(40px, 6vw, 78px)', lineHeight: 0.95, margin: 0 }}>
              Got a weird
              <br />
              brief? <span style={{ color: 'var(--red)' }}>Let's talk.</span>
            </div>
            <p style={{ maxWidth: 520, marginTop: 20, fontSize: 18, opacity: 0.85 }}>
              1-2 slots opening in May. Web, brand, a bit of product. Small teams doing unusual things only.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <button className="btn btn-alt" onClick={() => go('contact')}>
              Start a project <span>→</span>
            </button>
            <button className="btn btn-ghost" onClick={() => go('resume')}>
              See the resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeRoute({
  go,
  openProject,
  openPost,
  webProjects,
  gameProjects,
  posts,
}: {
  go: (id: string) => void;
  openProject: (p: Project) => void;
  openPost: (p: Post) => void;
  webProjects: Project[];
  gameProjects: Project[];
  posts: Post[];
}) {
  return (
    <div className="page" key="home">
      <Hero go={go} webProjectCount={webProjects.length} gameProjectCount={gameProjects.length} postCount={posts.length} />
      <MarqueeStrip />
      <FeaturedWork openProject={openProject} go={go} webProjects={webProjects} gameProjects={gameProjects} />
      <HomeBlogTeaser openPost={openPost} go={go} posts={posts} />
      <HomeCTA go={go} />
    </div>
  );
}
