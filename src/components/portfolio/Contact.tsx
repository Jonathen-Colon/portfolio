import React, { useState } from 'react';

export type ContactFormInput = {
  name: string;
  email: string;
  kind: 'Project inquiry' | 'Game dev collab' | 'Speaking / interview' | 'Just saying hi' | 'Something else';
  body: string;
};

export function ContactPage({ onSubmitContact }: { onSubmitContact?: (input: ContactFormInput) => Promise<void> }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormInput>({ name: '', email: '', kind: 'Project inquiry', body: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      if (onSubmitContact) {
        await onSubmitContact(form);
      } else if (typeof window !== 'undefined') {
        const subject = encodeURIComponent(form.kind);
        const body = encodeURIComponent(`${form.body}\n\nFrom: ${form.name} <${form.email}>`);
        window.location.href = `mailto:hi@joncolon.co?subject=${subject}&body=${body}`;
      }
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setForm({ name: '', email: '', kind: 'Project inquiry', body: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message. Please try again.');
    } finally {
      setSending(false);
    }
  }
  return (
    <section className="section page">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">07 / contact</div>
            <h2 className="section-title display">Let's talk.</h2>
            <p style={{ maxWidth: 540, color: 'var(--ink-soft)', margin: '14px 0 0' }}>
              Best for project inquiries. I reply within a day or two.
            </p>
          </div>
        </div>
        <div className="contact-grid">
          <form onSubmit={submit}>
            <div className="form-field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@somewhere.com"
              />
            </div>
            <div className="form-field">
              <label>What's this about?</label>
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value as ContactFormInput['kind'] })}
              >
                <option>Project inquiry</option>
                <option>Game dev collab</option>
                <option>Speaking / interview</option>
                <option>Just saying hi</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea
                required
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Tell me about it. What are you making? What's the weird edge?"
              />
            </div>
            <button className="btn btn-alt" type="submit" disabled={sending}>
              {sending ? 'Sending…' : sent ? "✓ Sent — I'll reply soon" : <>Send message <span>→</span></>}
            </button>
            {error && (
              <p className="mono" style={{ marginTop: 10, color: 'var(--red)' }}>
                {error}
              </p>
            )}
          </form>
          <aside>
            <div className="card contact-aside-card">
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Direct
              </div>
              <a
                href="mailto:jonathen@joncolon.dev"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'inherit' }}
              >
                jonathen@joncolon.dev
              </a>
              <div className="mono" style={{ marginTop: 8, color: 'var(--muted)' }}>
                Copy · opens mail
              </div>
            </div>
            <div className="card contact-aside-card" style={{ background: 'var(--lime)' }}>
              <div className="eyebrow" style={{ marginBottom: 10, color: '#1a1a1a' }}>
                Elsewhere
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <a className="nav-link" style={{ justifySelf: 'start', background: '#141414', color: '#F4EFE6' }} href="https://x.com/oobijohnson" target="_blank" rel="noreferrer">
                  X / Twitter → @oobijohnson
                </a>
                <a className="nav-link" style={{ justifySelf: 'start', background: '#141414', color: '#F4EFE6' }} href="https://github.com/Jonathen-Colon" target="_blank" rel="noreferrer">
                  GitHub → Jonathen-Colon
                </a>
                <a className="nav-link" style={{ justifySelf: 'start', background: '#141414', color: '#F4EFE6' }} href="https://www.linkedin.com/in/jonathen-colon-51956789/" target="_blank" rel="noreferrer">
                  LinkedIn → in/jonathen-colon
                </a>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Booking May 2026 onward. <br />
              Pacific & Eastern times both fine.
              <br />
              Prefer async over meetings.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
