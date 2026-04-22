import React from 'react';
import type { Resume } from '../../data/portfolio';

export function ResumePage({
  resume,
  resumePdfUrl,
  resumePdfFilename,
}: {
  resume: Resume | null;
  resumePdfUrl?: string | null;
  resumePdfFilename?: string;
}) {
  if (!resume) return null;
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">08 / resume</div>
            <h2 className="section-title display">CV</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>
              The condensed version. {resumePdfUrl ? 'Download the latest PDF below.' : 'PDF upload can be managed from admin.'}
            </p>
          </div>
          {resumePdfUrl ? (
            <a className="btn btn-lime" href={resumePdfUrl} download={resumePdfFilename ?? 'resume.pdf'}>
              Download PDF <span>↓</span>
            </a>
          ) : (
            <button className="btn btn-lime" type="button" disabled title="Upload a CV PDF from /admin">
              Download PDF <span>↓</span>
            </button>
          )}
        </div>
        <div className="card flat resume-card-inner">
          <h3 className="eyebrow" style={{ margin: '28px 0 6px' }}>
            Work
          </h3>
          {resume.work.map((r, i) => (
            <div key={i} className="resume-row">
              <div className="resume-yr">{r.year}</div>
              <div>
                <div className="resume-title">{r.title}</div>
                <div className="resume-org">{r.org}</div>
              </div>
              <div className="resume-tag">
                <span className={`pill ${r.tag === 'Current' ? 'lime' : ''}`}>{r.tag}</span>
              </div>
            </div>
          ))}
          <h3 className="eyebrow" style={{ margin: '32px 0 6px' }}>
            Speaking
          </h3>
          {resume.speaking.map((r, i) => (
            <div key={i} className="resume-row">
              <div className="resume-yr">{r.year}</div>
              <div>
                <div className="resume-title">{r.title}</div>
                <div className="resume-org">{r.org}</div>
              </div>
              <div className="resume-tag">
                <span className="pill">Talk</span>
              </div>
            </div>
          ))}
          <h3 className="eyebrow" style={{ margin: '32px 0 6px' }}>
            Education
          </h3>
          {resume.education.map((r, i) => (
            <div key={i} className="resume-row">
              <div className="resume-yr">{r.year}</div>
              <div>
                <div className="resume-title">{r.title}</div>
                <div className="resume-org">{r.org}</div>
              </div>
              <div className="resume-tag">
                <span className="pill">BFA</span>
              </div>
            </div>
          ))}
          <h3 className="eyebrow" style={{ margin: '32px 0 16px' }}>
            Skills
          </h3>
          <div className="resume-skills">
            {resume.skills.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
