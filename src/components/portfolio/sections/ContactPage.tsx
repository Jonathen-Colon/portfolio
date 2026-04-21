import React, { useState } from 'react';

export function ContactPage() {
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
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@somewhere.com" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-kind">What's this about?</label>
              <select id="contact-kind" value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}>
                <option>Project inquiry</option>
                <option>Game dev collab</option>
                <option>Speaking / interview</option>
                <option>Just saying hi</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="contact-body">Message</label>
              <textarea id="contact-body" required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Tell me about it. What are you making? What's the weird edge?" />
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
