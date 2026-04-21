import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import type { PageId, PortfolioData, Post, Project } from './types';
import { NAV_PAGES, pathForPage, pageTitleFor, pageIdFromPathname } from '../../lib/routes';
import { sanityClient } from '../../lib/sanityClient';
import { PostModal, ProjectModal } from './modals';
import { Footer } from './Footer';
import { Hero } from './sections/Hero';
import { MarqueeStrip } from './sections/MarqueeStrip';
import { WorkPage } from './sections/WorkPage';
import { BlogPage } from './sections/BlogPage';
import { AboutPage } from './sections/AboutPage';
import { NowPage } from './sections/NowPage';
import { ContactPage } from './sections/ContactPage';
import { ResumePage } from './sections/ResumePage';
import { FeaturedWork, HomeBlogTeaser, HomeCTA } from './sections/HomeSections';

function ShellInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = pageIdFromPathname(location.pathname);

  const [theme, setTheme] = useState<string>(() => {
    try { return localStorage.getItem('jc-theme') || 'light'; } catch { return 'light'; }
  });
  const [curtain, setCurtain] = useState<{ on: boolean; label: string }>({ on: false, label: '' });
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const emptyData = useRef<PortfolioData>({
    webProjects: [],
    gameProjects: [],
    posts: [],
    nowItems: [],
    resume: null,
  });
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => emptyData.current);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch('*[_type == "project" && kind == "web"] | order(_createdAt asc)'),
      sanityClient.fetch('*[_type == "project" && kind == "game"] | order(_createdAt asc)'),
      sanityClient.fetch('*[_type == "post"] | order(date desc)'),
      sanityClient.fetch('*[_type == "nowItem"]'),
      sanityClient.fetch('*[_type == "resume"][0]'),
    ]).then(([web, game, ps, now, res]) => {
      setPortfolio({
        webProjects: web ?? [],
        gameProjects: game ?? [],
        posts: ps ?? [],
        nowItems: now ?? [],
        resume: res ?? null,
      });
    }).finally(() => setLoading(false));
  }, []);

  const { webProjects, gameProjects, posts, nowItems, resume } = portfolio;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('jc-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    document.title = pageTitleFor(page);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  const go = useCallback((id: PageId) => {
    const path = pathForPage(id);
    if (path === location.pathname || (id === 'home' && location.pathname === '/')) return;
    const label = NAV_PAGES.find(p => p.id === id)?.label || '';
    setCurtain({ on: true, label });
    setMobileOpen(false);
    setTimeout(() => navigate(path), 380);
    setTimeout(() => setCurtain({ on: false, label: '' }), 820);
  }, [navigate, location.pathname]);

  useEffect(() => {
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let tx = rx;
    let ty = ry;
    let raf: number;
    function mm(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${tx}px`;
        dotRef.current.style.top = `${ty}px`;
      }
    }
    function tick() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener('mousemove', mm);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', mm);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.08em' }}>Loading...</span>
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
          <a className="logo" href={pathForPage('home')} onClick={(e) => { e.preventDefault(); go('home'); }}>
            <span className="logo-badge">JC</span>
            <span>joncolon<span style={{ color: 'var(--red)' }}>.co</span></span>
          </a>
          <div className={`nav-links${mobileOpen ? ' open' : ''}`}>
            {NAV_PAGES.map(p => (
              <a
                key={p.id}
                href={pathForPage(p.id)}
                className={`nav-link${page === p.id ? ' active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(p.id);
                }}
              >
                {p.label}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button type="button" className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle theme">
              {theme === 'light' ? '☾' : '☀'}
            </button>
            <button type="button" className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '≡'}
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={(
            <div className="page" key="home">
              <Hero go={go} />
              <MarqueeStrip />
              <FeaturedWork openProject={setModalProject} go={go} webProjects={webProjects} gameProjects={gameProjects} />
              <HomeBlogTeaser openPost={setModalPost} go={go} posts={posts} />
              <HomeCTA go={go} />
            </div>
          )}
        />
        <Route
          path="/web"
          element={(
            <div key="web">
              <WorkPage kind="web" go={go} openProject={setModalProject} projects={webProjects} />
            </div>
          )}
        />
        <Route
          path="/games"
          element={(
            <div key="games">
              <WorkPage kind="games" go={go} openProject={setModalProject} projects={gameProjects} />
            </div>
          )}
        />
        <Route path="/blog" element={<div key="blog"><BlogPage openPost={setModalPost} posts={posts} /></div>} />
        <Route path="/about" element={<div key="about"><AboutPage /></div>} />
        <Route path="/now" element={<div key="now"><NowPage nowItems={nowItems} /></div>} />
        <Route path="/contact" element={<div key="contact"><ContactPage /></div>} />
        <Route path="/resume" element={<div key="resume"><ResumePage resume={resume} /></div>} />
      </Routes>

      <Footer />

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}
      {modalPost && <PostModal post={modalPost} onClose={() => setModalPost(null)} />}
    </>
  );
}

export default function PortfolioShell() {
  return (
    <BrowserRouter>
      <ShellInner />
    </BrowserRouter>
  );
}
