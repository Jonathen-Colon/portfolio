import React from 'react';
import { pageToPath } from './routes';

export function Footer({ go }: { go: (id: string) => void }) {
  function navLink(pageId: string, label: string) {
    return (
      <a
        href={pageToPath(pageId)}
        onClick={(e) => {
          e.preventDefault();
          go(pageId);
        }}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </a>
    );
  }
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              Making stuff
              <br />
              since 2018.
            </div>
            <div className="mono" style={{ color: 'var(--muted)', marginTop: 18 }}>
              © {new Date().getFullYear()} Jon Colon · Southern MA
            </div>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li>{navLink('home', 'Home')}</li>
              <li>{navLink('web', 'Web work')}</li>
              <li>{navLink('games', 'Games')}</li>
              <li>{navLink('blog', 'Devlog')}</li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li>{navLink('about', 'Bio')}</li>
              <li>{navLink('resume', 'Resume')}</li>
              <li>{navLink('contact', 'Contact')}</li>
            </ul>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <ul>
              <li>
                <a href="mailto:jonathen@joncolon.dev">Email</a>
              </li>
              <li>
                <a href="https://x.com/oobijohnson" target="_blank" rel="noreferrer">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/Jonathen-Colon" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/jonathen-colon-51956789/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Hand-built with Astro, React and a lot of coffee</span>
        </div>
      </div>
    </footer>
  );
}
