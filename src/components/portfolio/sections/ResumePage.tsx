import React from 'react';
import type { Resume } from '../types';

export function ResumePage({ resume }: { resume: Resume | null }) {
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
          <button type="button" className="btn btn-lime">Download PDF <span>↓</span></button>
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
