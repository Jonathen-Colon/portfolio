import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import { Component, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { Post, Project } from "../../data/portfolioContent";
import { convexClient, hasConvex } from "../../lib/convexClient";

function linesToBody(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function bodyToLines(body: string[]): string {
  return body.join("\n");
}

function formatAuthError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

type AdminErrorBoundaryProps = { signOut: () => void; children: ReactNode };
type AdminErrorBoundaryState = { error: Error | null };

class AdminErrorBoundary extends Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  state: AdminErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="wrap section">
          <header style={{ marginBottom: 28 }}>
            <p className="eyebrow">Private</p>
            <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "8px 0 0" }}>
              Content admin
            </h1>
          </header>
          <div className="card flat" style={{ padding: 24, maxWidth: 640 }}>
            <p className="mono" style={{ color: "var(--red)", marginBottom: 12 }}>
              {this.state.error.message}
            </p>
            <p style={{ color: "var(--muted)", marginBottom: 20 }}>
              This usually means the browser is talking to a different Convex deployment than the one your functions
              were pushed to, or a query failed on the server. After deploying Convex, reload this page.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" className="btn" onClick={() => this.setState({ error: null })}>
                Try again
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => this.props.signOut()}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminSignIn() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setFormError("Enter email and password.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    try {
      const result = await signIn("password", {
        flow: "signIn",
        email: trimmed,
        password,
      });
      if (result.redirect) {
        return;
      }
      if (!result.signingIn) {
        setFormError(
          "Could not finish sign-in. If this is a new deployment, set JWT_PRIVATE_KEY and JWKS in the Convex dashboard (run npm run generate:jwt-keys).",
        );
      }
    } catch (err) {
      setFormError(formatAuthError(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="card flat"
      style={{ padding: 24, maxWidth: 440, position: "relative", zIndex: 20, pointerEvents: "auto" }}
    >
      <p className="eyebrow" style={{ marginBottom: 8 }}>
        Convex Auth
      </p>
      <h2 className="display" style={{ fontSize: "1.75rem", margin: "0 0 16px" }}>
        Sign in
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 20 }}>
        Email and password are stored by Convex Auth. Use a strong password; password reset is not configured in this
        project yet.
      </p>
      {formError && (
        <p className="mono" style={{ color: "var(--red)", marginBottom: 12 }}>
          {formError}
        </p>
      )}
      <form onSubmit={(e) => void onSubmit(e)}>
        <div className="form-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            disabled={pending}
          />
        </div>
        <div className="form-field">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            disabled={pending}
          />
        </div>
        <button type="submit" className="btn" style={{ width: "100%" }} disabled={pending}>
          {pending ? "Please wait…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/** Convex `useQuery` throws on server errors; keep hooks out of the unauthenticated tree so the login form never crashes. */
function AdminAuthenticated() {
  const { signOut } = useAuthActions();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const posts = useQuery(api.posts.listPosts, {});
  const projects = useQuery(api.projects.listProjects, {});
  const contactsResult = useQuery(api.contacts.listContactsAdmin, {});
  const resumePdfResult = useQuery(api.assets.getResumePdfAdmin, {});
  const upsertPost = useMutation(api.posts.upsertPost);
  const upsertProject = useMutation(api.projects.upsertProject);
  const deletePost = useMutation(api.posts.deletePost);
  const deleteProject = useMutation(api.projects.deleteProject);
  const generateResumeUploadUrl = useMutation(api.assets.generateResumeUploadUrl);
  const setResumePdf = useMutation(api.assets.setResumePdf);

  const [tab, setTab] = useState<"posts" | "projects" | "contacts" | "resume">("posts");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const sortedPosts = useMemo(() => posts ?? [], [posts]);
  const sortedProjects = useMemo(() => projects ?? [], [projects]);

  const selectedPost = sortedPosts.find((p) => p.id === selectedPostId) ?? null;
  const selectedProject = sortedProjects.find((p) => p.id === selectedProjectId) ?? null;

  const [postForm, setPostForm] = useState<Partial<Post>>({});
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  useEffect(() => {
    if (!selectedPost) {
      setPostForm({});
      return;
    }
    setPostForm({ ...selectedPost });
  }, [selectedPost]);

  useEffect(() => {
    if (!selectedProject) {
      setProjectForm({});
      return;
    }
    setProjectForm({ ...selectedProject });
  }, [selectedProject]);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setError(null);
    setMessage(null);
    try {
      await fn();
      setMessage(ok);
    } catch (err) {
      setMessage(null);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (
    posts === undefined ||
    projects === undefined ||
    contactsResult === undefined ||
    resumePdfResult === undefined
  ) {
    return (
      <div className="wrap section-tight">
        <p className="eyebrow">Loading…</p>
      </div>
    );
  }

  if (!contactsResult.ok || !resumePdfResult.ok) {
    const detail = !contactsResult.ok ? contactsResult.error : resumePdfResult.error;
    return (
      <div className="wrap section">
        <header style={{ marginBottom: 28 }}>
          <p className="eyebrow">Private</p>
          <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "8px 0 0" }}>
            Content admin
          </h1>
        </header>
        <div className="card flat" style={{ padding: 24, maxWidth: 560 }}>
          <p className="mono" style={{ color: "var(--red)", marginBottom: 16 }}>
            {detail}
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>
            If your deployment sets <code className="mono">ADMIN_EMAIL</code>, sign in with that exact email address,
            or update the env var to match your Convex Auth account.
          </p>
          <button type="button" className="btn" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const contacts = contactsResult.contacts;
  const resumePdf = resumePdfResult.resume;

  return (
    <div className="wrap section">
      <header style={{ marginBottom: 32 }}>
        <p className="eyebrow">Private</p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "8px 0 0" }}>
              Content admin
            </h1>
            <p style={{ color: "var(--muted)", maxWidth: 560, marginTop: 12 }}>
              Signed in with Convex Auth. Mutations run with your session token.
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </header>

      {message && (
        <p className="mono" style={{ color: "var(--mint)", marginBottom: 12 }}>
          {message}
        </p>
      )}
      {error && (
        <p className="mono" style={{ color: "var(--red)", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <button type="button" className={tab === "posts" ? "btn" : "btn btn-ghost"} onClick={() => setTab("posts")}>
          Posts ({sortedPosts.length})
        </button>
        <button
          type="button"
          className={tab === "projects" ? "btn" : "btn btn-ghost"}
          onClick={() => setTab("projects")}
        >
          Projects ({sortedProjects.length})
        </button>
        <button type="button" className={tab === "contacts" ? "btn" : "btn btn-ghost"} onClick={() => setTab("contacts")}>
          Contacts ({contacts.length})
        </button>
        <button type="button" className={tab === "resume" ? "btn" : "btn btn-ghost"} onClick={() => setTab("resume")}>
          Resume PDF
        </button>
      </div>

      {tab === "posts" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 240px) 1fr", gap: 24 }}>
          <nav style={{ borderRight: "2px solid var(--line)", paddingRight: 16 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Posts
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {sortedPosts.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ width: "100%", textAlign: "left", fontSize: 14 }}
                    onClick={() => setSelectedPostId(p.id)}
                  >
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn"
              style={{ marginTop: 16, width: "100%" }}
              onClick={() => {
                setSelectedPostId(null);
                setPostForm({
                  id: `p${String(sortedPosts.length + 1).padStart(3, "0")}`,
                  date: new Date().toISOString().slice(0, 7),
                  title: "",
                  excerpt: "",
                  read: "5 min",
                  tag: "Meta",
                  thumb: "meta",
                  body: [],
                });
              }}
            >
              New post
            </button>
          </nav>
          <div>
            {!postForm.id && !selectedPostId ? (
              <p style={{ color: "var(--muted)" }}>Select a post or create a new one.</p>
            ) : (
              <div className="card flat" style={{ padding: 20 }}>
                <div className="form-field">
                  <label>id (slug)</label>
                  <input
                    value={postForm.id ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, id: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>date (YYYY-MM)</label>
                  <input
                    value={postForm.date ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>title</label>
                  <input
                    value={postForm.title ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>excerpt</label>
                  <textarea
                    value={postForm.excerpt ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, excerpt: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>read</label>
                  <input
                    value={postForm.read ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, read: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>tag</label>
                  <input
                    value={postForm.tag ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, tag: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>thumb</label>
                  <input
                    value={postForm.thumb ?? ""}
                    onChange={(e) => setPostForm((f) => ({ ...f, thumb: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>body (one paragraph per line)</label>
                  <textarea
                    value={bodyToLines(postForm.body ?? [])}
                    onChange={(e) => setPostForm((f) => ({ ...f, body: linesToBody(e.target.value) }))}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      const p = postForm as Post;
                      if (!p.id || !p.title) {
                        setError("id and title are required.");
                        return;
                      }
                      run(
                        () =>
                          upsertPost({
                            post: {
                              id: p.id,
                              date: p.date ?? "",
                              title: p.title,
                              excerpt: p.excerpt ?? "",
                              read: p.read ?? "",
                              tag: p.tag ?? "",
                              thumb: p.thumb ?? "",
                              body: p.body ?? [],
                            },
                          }),
                        "Post saved.",
                      );
                    }}
                  >
                    Save post
                  </button>
                  {selectedPostId && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        if (!window.confirm("Delete this post from Convex?")) return;
                        run(
                          async () => {
                            await deletePost({ id: selectedPostId });
                            setSelectedPostId(null);
                          },
                          "Post deleted.",
                        );
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 240px) 1fr", gap: 24 }}>
          <nav style={{ borderRight: "2px solid var(--line)", paddingRight: 16 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Projects
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {sortedProjects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ width: "100%", textAlign: "left", fontSize: 14 }}
                    onClick={() => setSelectedProjectId(p.id)}
                  >
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn"
              style={{ marginTop: 16, width: "100%" }}
              onClick={() => {
                setSelectedProjectId(null);
                setProjectForm({
                  id: "new-project",
                  title: "",
                  year: String(new Date().getFullYear()),
                  kind: "web",
                  role: "",
                  desc: "",
                  tags: [],
                  accent: "cobalt",
                  thumb: "atlas",
                  body: [],
                });
              }}
            >
              New project
            </button>
          </nav>
          <div>
            {!projectForm.id && !selectedProjectId ? (
              <p style={{ color: "var(--muted)" }}>Select a project or create a new one.</p>
            ) : (
              <div className="card flat" style={{ padding: 20 }}>
                <div className="form-field">
                  <label>id (slug)</label>
                  <input
                    value={projectForm.id ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, id: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>title</label>
                  <input
                    value={projectForm.title ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>year</label>
                  <input
                    value={projectForm.year ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>kind</label>
                  <select
                    value={projectForm.kind ?? "web"}
                    onChange={(e) =>
                      setProjectForm((f) => ({ ...f, kind: e.target.value as Project["kind"] }))
                    }
                  >
                    <option value="web">web</option>
                    <option value="game">game</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>role</label>
                  <input
                    value={projectForm.role ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, role: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>desc</label>
                  <textarea
                    value={projectForm.desc ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, desc: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>tags (comma-separated)</label>
                  <input
                    value={(projectForm.tags ?? []).join(", ")}
                    onChange={(e) =>
                      setProjectForm((f) => ({
                        ...f,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>accent</label>
                  <input
                    value={projectForm.accent ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, accent: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>thumb</label>
                  <input
                    value={projectForm.thumb ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, thumb: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>live URL (optional)</label>
                  <input
                    value={projectForm.live ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, live: e.target.value || undefined }))}
                  />
                </div>
                <div className="form-field">
                  <label>repo URL (optional)</label>
                  <input
                    value={projectForm.repo ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, repo: e.target.value || undefined }))}
                  />
                </div>
                <div className="form-field">
                  <label>itch URL (optional)</label>
                  <input
                    value={projectForm.itch ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, itch: e.target.value || undefined }))}
                  />
                </div>
                <div className="form-field">
                  <label>media URL (optional)</label>
                  <input
                    value={projectForm.media ?? ""}
                    onChange={(e) => setProjectForm((f) => ({ ...f, media: e.target.value || undefined }))}
                  />
                </div>
                <div className="form-field">
                  <label>body (one paragraph per line)</label>
                  <textarea
                    value={bodyToLines(projectForm.body ?? [])}
                    onChange={(e) => setProjectForm((f) => ({ ...f, body: linesToBody(e.target.value) }))}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      const p = projectForm as Project;
                      if (!p.id || !p.title) {
                        setError("id and title are required.");
                        return;
                      }
                      const payload = {
                        id: p.id,
                        title: p.title,
                        year: p.year ?? "",
                        kind: p.kind,
                        role: p.role ?? "",
                        desc: p.desc ?? "",
                        tags: p.tags ?? [],
                        accent: p.accent ?? "",
                        thumb: p.thumb ?? "",
                        body: p.body ?? [],
                        live: p.live?.trim() || undefined,
                        repo: p.repo?.trim() || undefined,
                        itch: p.itch?.trim() || undefined,
                        media: p.media?.trim() || undefined,
                        shots: p.shots?.length ? p.shots : undefined,
                      };
                      run(() => upsertProject({ project: payload }), "Project saved.");
                    }}
                  >
                    Save project
                  </button>
                  {selectedProjectId && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        if (!window.confirm("Delete this project from Convex?")) return;
                        run(
                          async () => {
                            await deleteProject({ id: selectedProjectId });
                            setSelectedProjectId(null);
                          },
                          "Project deleted.",
                        );
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="card flat" style={{ padding: 20 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>
            Contact submissions
          </p>
          {contacts.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No contact submissions yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {contacts.map((entry) => (
                <article key={entry._id} className="card" style={{ padding: 14, background: "var(--paper-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div className="resume-title">{entry.name}</div>
                      <a href={`mailto:${entry.email}`} className="mono" style={{ color: "var(--cobalt)" }}>
                        {entry.email}
                      </a>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="pill">{entry.kind}</span>
                      <div className="mono" style={{ marginTop: 8, color: "var(--muted)" }}>
                        {new Date(entry.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p style={{ marginTop: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{entry.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "resume" && (
        <div className="card flat" style={{ padding: 20 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>
            Upload CV PDF
          </p>
          <div className="form-field">
            <label htmlFor="resume-upload">PDF file</label>
            <input
              id="resume-upload"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <button
            type="button"
            className="btn"
            disabled={!resumeFile || resumeUploading}
            onClick={() => {
              const file = resumeFile;
              if (!file) {
                setError("Select a PDF file first.");
                return;
              }
              void run(async () => {
                setResumeUploading(true);
                try {
                  const uploadUrl = await generateResumeUploadUrl({});
                  const uploadResult = await fetch(uploadUrl, {
                    method: "POST",
                    headers: {
                      "Content-Type": file.type || "application/pdf",
                    },
                    body: file,
                  });
                  if (!uploadResult.ok) {
                    throw new Error("Failed to upload PDF to Convex storage.");
                  }
                  const payload = (await uploadResult.json()) as { storageId?: string };
                  if (!payload.storageId) {
                    throw new Error("Upload finished but no storageId was returned.");
                  }
                  await setResumePdf({
                    storageId: payload.storageId as Id<"_storage">,
                    filename: file.name,
                    contentType: file.type || undefined,
                    size: file.size,
                  });
                  setResumeFile(null);
                } finally {
                  setResumeUploading(false);
                }
              }, "Resume PDF uploaded.");
            }}
          >
            {resumeUploading ? "Uploading…" : "Upload resume PDF"}
          </button>
          <div style={{ marginTop: 18 }}>
            {resumePdf ? (
              <div className="card" style={{ padding: 14, background: "var(--paper-2)" }}>
                <div className="resume-title">{resumePdf.filename}</div>
                <div className="mono" style={{ color: "var(--muted)", marginTop: 8 }}>
                  {resumePdf.contentType ?? "application/pdf"}
                  {typeof resumePdf.size === "number" ? ` · ${(resumePdf.size / 1024).toFixed(1)} KB` : ""}
                  {resumePdf.uploadedAt ? ` · uploaded ${new Date(resumePdf.uploadedAt).toLocaleString()}` : ""}
                </div>
                {resumePdf.url ? (
                  <a href={resumePdf.url} className="btn btn-ghost" style={{ marginTop: 12 }}>
                    Open current PDF
                  </a>
                ) : (
                  <p className="mono" style={{ marginTop: 12, color: "var(--muted)" }}>
                    File is set but URL is unavailable right now.
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>No resume PDF uploaded yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminInner() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="wrap section-tight">
        <p className="eyebrow">Checking session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="wrap section">
        <header style={{ marginBottom: 28 }}>
          <p className="eyebrow">Private</p>
          <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "8px 0 0" }}>
            Content admin
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 560, marginTop: 12 }}>
            Sign in with Convex Auth (email + password). If your deployment sets{" "}
            <code className="mono">ADMIN_EMAIL</code>, only that address can save content.
          </p>
        </header>
        <AdminSignIn />
      </div>
    );
  }

  return (
    <AdminErrorBoundary signOut={() => void signOut()}>
      <AdminAuthenticated />
    </AdminErrorBoundary>
  );
}

export default function ContentAdmin() {
  if (!hasConvex() || !convexClient) {
    return (
      <div className="wrap section">
        <h1 className="display" style={{ fontSize: "2rem" }}>
          Convex not configured
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 520 }}>
          Add <code className="mono">PUBLIC_CONVEX_URL</code> to <code className="mono">.env.local</code> (same value as
          your Convex deployment URL), run <code className="mono">npm run convex:dev</code>, then reload this page.
        </p>
      </div>
    );
  }

  return (
    <ConvexAuthProvider client={convexClient}>
      <AdminInner />
    </ConvexAuthProvider>
  );
}
