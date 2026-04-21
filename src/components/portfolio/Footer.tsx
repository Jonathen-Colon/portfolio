import React from 'react';
import { Link } from 'react-router-dom';
import { pathForPage } from '../../lib/routes';
import type { PageId } from './types';

export function Footer() {
  const to = (id: PageId) => pathForPage(id);
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
              <li><Link to={to('home')}>Home</Link></li>
              <li><Link to={to('web')}>Web work</Link></li>
              <li><Link to={to('games')}>Games</Link></li>
              <li><Link to={to('blog')}>Devlog</Link></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><Link to={to('about')}>Bio</Link></li>
              <li><Link to={to('now')}>Now</Link></li>
              <li><Link to={to('resume')}>Resume</Link></li>
              <li><Link to={to('contact')}>Contact</Link></li>
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
