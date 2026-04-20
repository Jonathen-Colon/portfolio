import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { sanityClient } from '../lib/sanityClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  title: string;
  year: string;
  kind: string;
  role: string;
  desc: string;
  tags: string[];
  accent: string;
  thumb: string;
  live?: string;
  repo?: string;
  itch?: string;
  media?: string;
  body: string[];
  shots?: string[];
}

interface Post {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  read: string;
  tag: string;
  thumb: string;
  body: string[];
}

interface NowItem {
  title: string;
  body: string;
  progress: number | null;
  color: string;
  icon: string;
}

interface ResumeRow {
  title: string;
  org: string;
  year: string;
  tag?: string;
}

interface Resume {
  work: ResumeRow[];
  speaking: ResumeRow[];
  education: ResumeRow[];
  skills: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Data is fetched from Sanity CMS at runtime in PortfolioApp via useEffect.

// ─── PRNG ─────────────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Thumbnails ───────────────────────────────────────────────────────────────

function ThumbAtlas() {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#FF3B1F" />
      {[...Array(14)].map((_, i) => (
        <path key={i} d={`M-20 ${40 + i * 20} Q 120 ${20 + i * 15} 220 ${60 + i * 18} T 420 ${40 + i * 20}`} stroke="#141414" strokeWidth="1.5" fill="none" opacity={i % 3 === 0 ? 1 : 0.4} />
      ))}
      <circle cx="280" cy="130" r="6" fill="#141414" />
      <circle cx="280" cy="130" r="14" fill="none" stroke="#141414" strokeWidth="2" />
      <text x="296" y="134" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#141414" fontWeight="700">43.4°N</text>
    </svg>
  );
}

function ThumbField() {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#2E4BFF" />
      <rect x="40" y="30" width="320" height="200" fill="#F4EFE6" stroke="#141414" strokeWidth="2" rx="6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="60" y={60 + i * 24} width={i === 0 ? 220 : i === 3 ? 180 : 260} height="10" fill="#141414" opacity={i === 0 ? 1 : 0.35} rx="2" />
      ))}
      <circle cx="335" cy="50" r="6" fill="#C8FF4D" stroke="#141414" strokeWidth="2" />
    </svg>
  );
}

function ThumbBodega() {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#FFC83D" />
      <g transform="translate(200,140)">
        {[30, 60, 90, 120, 150].map((r, i) => (
          <circle key={r} r={r} fill="none" stroke="#141414" strokeWidth="2.5" opacity={1 - i * 0.12} />
        ))}
        <circle r="14" fill="#FF3B1F" stroke="#141414" strokeWidth="2" />
      </g>
      <text x="30" y="40" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="22" fill="#141414">ON AIR</text>
      <circle cx="110" cy="32" r="6" fill="#FF3B1F" />
    </svg>
  );
}

function ThumbParcel() {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#C8FF4D" />
      <path d="M 30 200 Q 110 80 200 140 T 370 60" stroke="#141414" strokeWidth="3" fill="none" strokeDasharray="1 10" strokeLinecap="round" />
      <rect x="20" y="190" width="24" height="24" fill="#141414" rx="4" />
      <polygon points="360,50 380,70 360,70" fill="#FF3B1F" stroke="#141414" strokeWidth="2" />
      <circle cx="200" cy="140" r="10" fill="#F4EFE6" stroke="#141414" strokeWidth="2" />
      <text x="30" y="40" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#141414">ROUTE 01 · 14 STOPS</text>
    </svg>
  );
}

function ThumbMoth() {
  const rand = mulberry32(42);
  const stars = [...Array(90)].map(() => ({ x: rand() * 400, y: rand() * 250, r: rand() * 1.8 + 0.3 }));
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#6B2BFF" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F4EFE6" />)}
      <g stroke="#FFC83D" strokeWidth="1.5" fill="#FFC83D">
        <line x1="120" y1="80" x2="160" y2="120" />
        <line x1="160" y1="120" x2="220" y2="100" />
        <line x1="220" y1="100" x2="260" y2="150" />
        <line x1="260" y1="150" x2="310" y2="120" />
        <circle cx="120" cy="80" r="3" />
        <circle cx="160" cy="120" r="3" />
        <circle cx="220" cy="100" r="3" />
        <circle cx="260" cy="150" r="3" />
        <circle cx="310" cy="120" r="3" />
      </g>
      <g transform="translate(180,180)">
        <ellipse cx="-8" cy="-4" rx="14" ry="8" fill="#F4EFE6" stroke="#141414" strokeWidth="1.5" transform="rotate(-20)" />
        <ellipse cx="8" cy="-4" rx="14" ry="8" fill="#F4EFE6" stroke="#141414" strokeWidth="1.5" transform="rotate(20)" />
        <ellipse cx="0" cy="0" rx="3" ry="10" fill="#141414" />
      </g>
    </svg>
  );
}

function ThumbRewind() {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#FF3B1F" />
      <rect x="20" y="20" width="150" height="14" fill="#141414" />
      <rect x="22" y="22" width="110" height="10" fill="#C8FF4D" />
      <rect x="230" y="20" width="150" height="14" fill="#141414" />
      <rect x="232" y="22" width="80" height="10" fill="#F4EFE6" />
      <rect x="90" y="140" width="30" height="70" fill="#141414" />
      <rect x="280" y="130" width="30" height="80" fill="#F4EFE6" stroke="#141414" strokeWidth="2" opacity="0.6" />
      <rect x="260" y="130" width="30" height="80" fill="#F4EFE6" stroke="#141414" strokeWidth="2" strokeDasharray="3 3" />
      <text x="200" y="130" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="52" fill="#141414" letterSpacing="-2">REWIND</text>
      <text x="200" y="70" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#141414">T-4.8s</text>
    </svg>
  );
}

function ThumbLattice() {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#4DE0B2" />
      <polygon points="140,80 260,80 300,150 200,200 100,150" fill="#F4EFE6" stroke="#141414" strokeWidth="2.5" opacity="0.8" />
      <polygon points="200,80 200,200 300,150" fill="#141414" opacity="0.08" />
      <line x1="0" y1="125" x2="140" y2="125" stroke="#FF3B1F" strokeWidth="3" />
      <line x1="140" y1="125" x2="260" y2="85" stroke="#FF3B1F" strokeWidth="3" />
      <line x1="260" y1="85" x2="260" y2="80" stroke="#FF3B1F" strokeWidth="3" />
      <line x1="260" y1="85" x2="400" y2="160" stroke="#FFC83D" strokeWidth="3" />
      <line x1="260" y1="85" x2="400" y2="40" stroke="#6B2BFF" strokeWidth="3" />
    </svg>
  );
}

function ThumbThicket() {
  const rand = mulberry32(7);
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="250" fill="#2E4BFF" />
      {[...Array(18)].map((_, i) => {
        const x = rand() * 400;
        const y = 120 + rand() * 100;
        const s = 14 + rand() * 24;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-2" y="0" width="4" height={s * 0.4} fill="#141414" />
            <circle cx="0" cy="-4" r={s * 0.5} fill="#C8FF4D" stroke="#141414" strokeWidth="1.5" />
          </g>
        );
      })}
      <text x="20" y="40" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="#F4EFE6">TREE #247 · AGE 43 · LIGHTNING x2</text>
    </svg>
  );
}

const THUMB_MAP: Record<string, () => React.ReactElement> = {
  atlas: ThumbAtlas,
  field: ThumbField,
  bodega: ThumbBodega,
  parcel: ThumbParcel,
  moth: ThumbMoth,
  rewind: ThumbRewind,
  lattice: ThumbLattice,
  thicket: ThumbThicket,
};

function ProjectThumb({ id }: { id: string }) {
  const Component = THUMB_MAP[id];
  if (!Component) return <div className="th cobalt-solid" style={{ width: '100%', height: '100%' }} />;
  return <Component />;
}

function ThumbPost({ post }: { post: Post }) {
  const bg: Record<string, string> = { Devlog: '#6B2BFF', Design: '#FF3B1F', Code: '#2E4BFF', Meta: '#C8FF4D' };
  const fg: Record<string, string> = { Devlog: '#F4EFE6', Design: '#F4EFE6', Code: '#F4EFE6', Meta: '#141414' };
  const bgColor = bg[post.tag] || '#141414';
  const fgColor = fg[post.tag] || '#F4EFE6';
  return (
    <svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="230" fill={bgColor} />
      <text x="20" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill={fgColor} letterSpacing="2">{post.tag.toUpperCase()}</text>
      <text x="20" y="130" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="42" fill={fgColor} letterSpacing="-1.5">
        <tspan x="20" dy="0">#</tspan>
        <tspan x="54">{post.id.slice(0, 3).toUpperCase()}</tspan>
      </text>
      <text x="20" y="210" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={fgColor}>{post.date}</text>
    </svg>
  );
}

// ─── Hero backdrop ────────────────────────────────────────────────────────────

function HeroBackdrop() {
  return (
    <svg viewBox="0 0 400 460" style={{ width: '100%', height: 'auto', opacity: 0.9 }}>
      <defs>
        <pattern id="dots-bg" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#141414" />
        </pattern>
      </defs>
      <circle cx="280" cy="120" r="85" fill="#C8FF4D" stroke="#141414" strokeWidth="2.5" />
      <rect x="60" y="240" width="140" height="140" rx="20" fill="#FF3B1F" stroke="#141414" strokeWidth="2.5" transform="rotate(-8 130 310)" />
      <polygon points="260,280 370,280 370,400 260,400" fill="url(#dots-bg)" stroke="#141414" strokeWidth="2.5" />
      <path d="M 40 110 Q 140 20 240 110 T 440 110" stroke="#141414" strokeWidth="3" fill="none" />
    </svg>
  );
}

// ─── Portrait illustration ────────────────────────────────────────────────────

function PortraitIllustration() {
  return (
    <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="400" fill="#FFC83D" />
      <circle cx="60" cy="80" r="30" fill="#FF3B1F" />
      <rect x="240" y="300" width="70" height="70" fill="#2E4BFF" transform="rotate(12 275 335)" />
      <ellipse cx="160" cy="170" rx="70" ry="80" fill="#F4EFE6" stroke="#141414" strokeWidth="2.5" />
      <path d="M 100 140 Q 100 80 160 80 Q 220 80 220 140 Q 220 120 200 115 Q 180 110 160 112 Q 130 114 110 130 Z" fill="#141414" />
      <circle cx="135" cy="170" r="18" fill="none" stroke="#141414" strokeWidth="3" />
      <circle cx="185" cy="170" r="18" fill="none" stroke="#141414" strokeWidth="3" />
      <line x1="153" y1="170" x2="167" y2="170" stroke="#141414" strokeWidth="3" />
      <circle cx="135" cy="170" r="3" fill="#141414" />
      <circle cx="185" cy="170" r="3" fill="#141414" />
      <path d="M 140 205 Q 160 220 180 205" stroke="#141414" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="130" y="240" width="60" height="30" fill="#F4EFE6" stroke="#141414" strokeWidth="2.5" />
      <path d="M 60 280 Q 60 260 100 260 L 220 260 Q 260 260 260 280 L 260 400 L 60 400 Z" fill="#FF3B1F" stroke="#141414" strokeWidth="2.5" />
      <text x="160" y="330" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="30" fill="#F4EFE6">★</text>
      <g transform="translate(240, 100) rotate(10)">
        <circle r="34" fill="#C8FF4D" stroke="#141414" strokeWidth="2" />
        <text textAnchor="middle" y="-2" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141414">MAKES</text>
        <text textAnchor="middle" y="12" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141414">STUFF</text>
      </g>
    </svg>
  );
}

// ─── Page components ──────────────────────────────────────────────────────────

function Hero({ go }: { go: (id: string) => void }) {
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
            <button className="btn" onClick={() => go('web')}>See the work <span>→</span></button>
            <button className="btn btn-ghost" onClick={() => go('contact')}>Say hi</button>
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

function MarqueeStrip() {
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

function WorkCard({ project, onClick, i }: { project: Project; onClick: () => void; i: number }) {
  return (
    <div className="work-card" onClick={onClick}
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

function WorkPage({ go, openProject, kind, projects }: { go: (id: string) => void; openProject: (p: Project) => void; kind: 'web' | 'games'; projects: Project[] }) {
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
            <button className="nav-link" onClick={() => go(kind === 'web' ? 'games' : 'web')}>→ see {kind === 'web' ? 'games' : 'web'}</button>
          </div>
        </div>
        <div className="work-grid">
          {projects.map((p, i) => <WorkCard key={p.id} project={p} onClick={() => openProject(p)} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function BlogPage({ openPost, posts }: { openPost: (p: Post) => void; posts: Post[] }) {
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
            <div key={p.id} className="devlog-entry" onClick={() => openPost(p)}>
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

function AboutPage() {
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

function NowPage({ nowItems }: { nowItems: NowItem[] }) {
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

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', kind: 'Project inquiry', body: '' });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', kind: 'Project inquiry', body: '' });
  }
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">07 / contact</div>
            <h2 className="section-title display">Let's talk.</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>Best for project inquiries. I reply within a day or two.</p>
          </div>
        </div>
        <div className="contact-grid">
          <form onSubmit={submit}>
            <div className="form-field">
              <label>Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@somewhere.com" />
            </div>
            <div className="form-field">
              <label>What's this about?</label>
              <select value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}>
                <option>Project inquiry</option>
                <option>Game dev collab</option>
                <option>Speaking / interview</option>
                <option>Just saying hi</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Tell me about it. What are you making? What's the weird edge?" />
            </div>
            <button className="btn btn-alt" type="submit">
              {sent ? "✓ Sent — I'll reply soon" : <>Send message <span>→</span></>}
            </button>
          </form>
          <aside>
            <div className="card" style={{ padding: 24, marginBottom: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Direct</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>hi@joncolon.co</div>
              <div className="mono" style={{ marginTop: 8, color: 'var(--muted)' }}>Copy · opens mail</div>
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 18, background: 'var(--lime)' }}>
              <div className="eyebrow" style={{ marginBottom: 10, color: '#1a1a1a' }}>Elsewhere</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <a className="nav-link" style={{ justifySelf: 'start', background: '#141414', color: '#F4EFE6' }} href="https://x.com/joncolon">X / Twitter → @joncolon</a>
                <a className="nav-link" style={{ justifySelf: 'start', background: '#141414', color: '#F4EFE6' }} href="https://github.com/joncolon">GitHub → joncolon</a>
                <a className="nav-link" style={{ justifySelf: 'start', background: '#141414', color: '#F4EFE6' }} href="https://linkedin.com/in/joncolon">LinkedIn → in/joncolon</a>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Booking May 2026 onward. <br />
              Pacific & Eastern times both fine.<br />
              Prefer async over meetings.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ResumePage({ resume }: { resume: Resume | null }) {
  if (!resume) return null;
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">08 / resume</div>
            <h2 className="section-title display">CV</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>The condensed version. PDF available on request.</p>
          </div>
          <button className="btn btn-lime">Download PDF <span>↓</span></button>
        </div>
        <div className="card flat" style={{ padding: '4px 32px' }}>
          <h3 className="eyebrow" style={{ margin: '28px 0 6px' }}>Work</h3>
          {resume.work.map((r, i) => (
            <div key={i} className="resume-row">
              <div className="resume-yr">{r.year}</div>
              <div><div className="resume-title">{r.title}</div><div className="resume-org">{r.org}</div></div>
              <div className="resume-tag"><span className={`pill ${r.tag === 'Current' ? 'lime' : ''}`}>{r.tag}</span></div>
            </div>
          ))}
          <h3 className="eyebrow" style={{ margin: '32px 0 6px' }}>Speaking</h3>
          {resume.speaking.map((r, i) => (
            <div key={i} className="resume-row">
              <div className="resume-yr">{r.year}</div>
              <div><div className="resume-title">{r.title}</div><div className="resume-org">{r.org}</div></div>
              <div className="resume-tag"><span className="pill">Talk</span></div>
            </div>
          ))}
          <h3 className="eyebrow" style={{ margin: '32px 0 6px' }}>Education</h3>
          {resume.education.map((r, i) => (
            <div key={i} className="resume-row">
              <div className="resume-yr">{r.year}</div>
              <div><div className="resume-title">{r.title}</div><div className="resume-org">{r.org}</div></div>
              <div className="resume-tag"><span className="pill">BFA</span></div>
            </div>
          ))}
          <h3 className="eyebrow" style={{ margin: '32px 0 16px' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 32 }}>
            {resume.skills.map(s => <span key={s} className="pill">{s}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-hero"><ProjectThumb id={project.id} /></div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span className={`pill ${project.accent}`}>{project.kind}</span>
            <span className="pill">{project.year}</span>
            <span className="pill">{project.role}</span>
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 18px' }}>{project.title}</h2>
          <p style={{ fontSize: 18, color: 'var(--ink-soft)', margin: '0 0 24px' }}>{project.desc}</p>
          {project.body.map((p, i) => <p key={i} style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{p}</p>)}
          {project.shots && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '28px 0' }}>
              {project.shots.map((s, i) => (
                <div key={i} style={{ aspectRatio: '4/3', border: '2px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                  <div className={`th ${s}`} style={{ width: '100%', height: '100%' }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {project.live && <button className="btn btn-alt">Live site <span>↗</span></button>}
            {project.repo && <button className="btn btn-ghost">GitHub <span>↗</span></button>}
            {project.itch && <button className="btn btn-lime">Play on itch.io <span>↗</span></button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-hero"><ThumbPost post={post} /></div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
            <span className={`pill ${post.tag === 'Devlog' ? 'plum' : post.tag === 'Design' ? 'red' : post.tag === 'Code' ? 'cobalt' : 'lime'}`}>{post.tag}</span>
            <span className="mono" style={{ color: 'var(--muted)' }}>{post.date}</span>
            <span className="mono" style={{ color: 'var(--muted)' }}>· {post.read}</span>
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', margin: '0 0 20px', lineHeight: 1.02 }}>{post.title}</h2>
          <p style={{ fontSize: 20, lineHeight: 1.5, color: 'var(--ink-soft)', fontWeight: 500, margin: '0 0 24px' }}>{post.excerpt}</p>
          {post.body.map((p, i) => <p key={i} style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{p}</p>)}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '2px dashed var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="mono" style={{ color: 'var(--muted)' }}>— Jon</div>
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ go }: { go: (id: string) => void }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 0.95 }}>Making stuff<br />since 2014.</div>
            <div className="mono" style={{ color: 'var(--muted)', marginTop: 18 }}>© {new Date().getFullYear()} Jon Colon · Brooklyn, NY</div>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><a onClick={() => go('home')} style={{ cursor: 'pointer' }}>Home</a></li>
              <li><a onClick={() => go('web')} style={{ cursor: 'pointer' }}>Web work</a></li>
              <li><a onClick={() => go('games')} style={{ cursor: 'pointer' }}>Games</a></li>
              <li><a onClick={() => go('blog')} style={{ cursor: 'pointer' }}>Devlog</a></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a onClick={() => go('about')} style={{ cursor: 'pointer' }}>Bio</a></li>
              <li><a onClick={() => go('now')} style={{ cursor: 'pointer' }}>Now</a></li>
              <li><a onClick={() => go('resume')} style={{ cursor: 'pointer' }}>Resume</a></li>
              <li><a onClick={() => go('contact')} style={{ cursor: 'pointer' }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <ul>
              <li><a href="https://x.com/joncolon">X / Twitter</a></li>
              <li><a href="https://github.com/joncolon">GitHub</a></li>
              <li><a href="https://linkedin.com/in/joncolon">LinkedIn</a></li>
              <li><a href="https://joncolon.itch.io">itch.io</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Hand-built with Astro, React and a lot of coffee</span>
          <span>v4.1 · last updated 04.12.26</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Home sections ────────────────────────────────────────────────────────────

function FeaturedWork({ openProject, go, webProjects, gameProjects }: { openProject: (p: Project) => void; go: (id: string) => void; webProjects: Project[]; gameProjects: Project[] }) {
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
          <button className="nav-link active" onClick={() => go('web')}>→ Web work</button>
          <button className="nav-link" onClick={() => go('games')}>→ Games</button>
        </div>
      </div>
      <div className="work-grid">
        {featured.map((p, i) => <WorkCard key={p.id} project={p} onClick={() => openProject(p)} i={i} />)}
      </div>
    </section>
  );
}

function HomeBlogTeaser({ openPost, go, posts }: { openPost: (p: Post) => void; go: (id: string) => void; posts: Post[] }) {
  const teaserPosts = posts.slice(0, 3);
  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <div className="section-num">03 / latest</div>
          <h2 className="section-title display">From the devlog</h2>
        </div>
        <button className="nav-link" onClick={() => go('blog')}>All posts →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {teaserPosts.map((p) => (
          <article key={p.id} className="card" style={{ cursor: 'pointer' }} onClick={() => openPost(p)}>
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

function HomeCTA({ go }: { go: (id: string) => void }) {
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
            <button className="btn btn-alt" onClick={() => go('contact')}>Start a project <span>→</span></button>
            <button className="btn btn-ghost" onClick={() => go('resume')}>See the resume</button>
            <button className="btn btn-lime" onClick={() => go('now')}>What I'm up to</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page list ────────────────────────────────────────────────────────────────

const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'web', label: 'Web' },
  { id: 'games', label: 'Games' },
  { id: 'blog', label: 'Devlog' },
  { id: 'about', label: 'About' },
  { id: 'now', label: 'Now' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function PortfolioApp() {
  const [page, setPage] = useState<string>(() => {
    try { return localStorage.getItem('jc-page') || 'home'; } catch { return 'home'; }
  });
  const [theme, setTheme] = useState<string>(() => {
    try { return localStorage.getItem('jc-theme') || 'light'; } catch { return 'light'; }
  });
  const [curtain, setCurtain] = useState<{ on: boolean; label: string }>({ on: false, label: '' });
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [webProjects, setWebProjects] = useState<Project[]>([]);
  const [gameProjects, setGameProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nowItems, setNowItems] = useState<NowItem[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch('*[_type == "project" && kind == "web"] | order(_createdAt asc)'),
      sanityClient.fetch('*[_type == "project" && kind == "game"] | order(_createdAt asc)'),
      sanityClient.fetch('*[_type == "post"] | order(date desc)'),
      sanityClient.fetch('*[_type == "nowItem"]'),
      sanityClient.fetch('*[_type == "resume"][0]'),
    ]).then(([web, game, ps, now, res]) => {
      setWebProjects(web ?? []);
      setGameProjects(game ?? []);
      setPosts(ps ?? []);
      setNowItems(now ?? []);
      setResume(res ?? null);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('jc-theme', theme); } catch { }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('jc-page', page); } catch { }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  const go = useCallback((id: string) => {
    if (id === page) return;
    const label = PAGES.find(p => p.id === id)?.label || '';
    setCurtain({ on: true, label });
    setMobileOpen(false);
    setTimeout(() => setPage(id), 380);
    setTimeout(() => setCurtain({ on: false, label: '' }), 820);
  }, [page]);

  // Custom cursor
  useEffect(() => {
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let tx = rx, ty = ry;
    let raf: number;
    function mm(e: MouseEvent) {
      tx = e.clientX; ty = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = tx + 'px'; dotRef.current.style.top = ty + 'px'; }
    }
    function tick() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ringRef.current) { ringRef.current.style.left = rx + 'px'; ringRef.current.style.top = ry + 'px'; }
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener('mousemove', mm);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', mm); cancelAnimationFrame(raf); };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-mono" style={{ color: 'var(--muted)', fontSize: 13, letterSpacing: '0.08em' }}>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />

      {curtain.on && (
        <div className="curtain sweep">
          <div className="curtain-label">{curtain.label}</div>
        </div>
      )}

      <nav className="nav">
        <div className="nav-inner">
          <a className="logo" onClick={() => go('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-badge">JC</span>
            <span>joncolon<span style={{ color: 'var(--red)' }}>.co</span></span>
          </a>
          <div className={`nav-links${mobileOpen ? ' open' : ''}`}>
            {PAGES.map(p => (
              <button key={p.id} className={`nav-link${page === p.id ? ' active' : ''}`} onClick={() => go(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle theme">
              {theme === 'light' ? '☾' : '☀'}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '≡'}
            </button>
          </div>
        </div>
      </nav>

      {page === 'home' && (
        <div className="page" key="home">
          <Hero go={go} />
          <MarqueeStrip />
          <FeaturedWork openProject={setModalProject} go={go} webProjects={webProjects} gameProjects={gameProjects} />
          <HomeBlogTeaser openPost={setModalPost} go={go} posts={posts} />
          <HomeCTA go={go} />
        </div>
      )}
      {page === 'web' && <div key="web"><WorkPage kind="web" go={go} openProject={setModalProject} projects={webProjects} /></div>}
      {page === 'games' && <div key="games"><WorkPage kind="games" go={go} openProject={setModalProject} projects={gameProjects} /></div>}
      {page === 'blog' && <div key="blog"><BlogPage openPost={setModalPost} posts={posts} /></div>}
      {page === 'about' && <div key="about"><AboutPage /></div>}
      {page === 'now' && <div key="now"><NowPage nowItems={nowItems} /></div>}
      {page === 'contact' && <div key="contact"><ContactPage /></div>}
      {page === 'resume' && <div key="resume"><ResumePage resume={resume} /></div>}

      <Footer go={go} />

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}
      {modalPost && <PostModal post={modalPost} onClose={() => setModalPost(null)} />}
    </>
  );
}
