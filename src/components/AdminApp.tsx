import {
  ConvexAuthProvider,
  useAuthActions,
} from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { getConvexPublicUrl } from "../lib/convexPublicUrl";
import {
  useConvexAuth,
  ConvexReactClient,
  useMutation,
  useQuery,
} from "convex/react";
import React, {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function formatAuthError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message: unknown }).message;
    if (typeof m === "string" && m) return m;
  }
  if (err && typeof err === "object" && "data" in err) {
    const d = (err as { data: unknown }).data;
    if (typeof d === "string") return d;
  }
  return "Something went wrong. Check Convex logs and env (ADMIN_EMAIL, JWT keys, CONVEX_SITE_URL).";
}

class AdminRuntimeErrorBoundary extends React.Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return {
      error:
        error instanceof Error ? error : new Error(String(error)),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[admin]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto paper-card bg-white p-8 border border-red-200 space-y-3">
          <p className="font-quirky font-bold text-text-dark">
            Admin UI crashed
          </p>
          <pre className="text-xs text-red-800 whitespace-pre-wrap break-words bg-red-50 p-3 rounded">
            {this.state.error.message}
          </pre>
          <p className="text-sm text-text-light">
            Often this is a duplicate <code className="text-xs">convex/react</code> bundle.
            Reinstall deps (<code className="text-xs">rm -rf node_modules</code> then{" "}
            <code className="text-xs">npm install</code>), set{" "}
            <code className="text-xs">PUBLIC_CONVEX_URL</code> in{" "}
            <code className="text-xs">.env.local</code>, then hard-refresh.
          </p>
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-lg bg-terracotta text-white font-quirky"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

class SubscriberQueryBoundary extends React.Component<
  { children: ReactNode; onReset?: () => void; signOut?: () => void },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-lg mx-auto paper-card bg-white p-8 border border-red-200">
          <p className="font-quirky font-bold text-text-dark mb-2">
            Could not load subscribers
          </p>
          <p className="text-sm text-text-light mb-4">
            {this.state.error.message}
          </p>
          <p className="text-sm text-text-light mb-4">
            If you see &quot;Forbidden&quot; or &quot;Unauthorized&quot;, sign in with the exact
            email set as{" "}
            <code className="text-xs bg-off-white-paper px-1 rounded">
              ADMIN_EMAIL
            </code>{" "}
            in Convex.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="text-sm px-4 py-2 rounded-lg bg-terracotta text-white font-quirky"
              onClick={() => {
                this.setState({ error: null });
                this.props.onReset?.();
              }}
            >
              Retry
            </button>
            <button
              type="button"
              className="text-sm px-4 py-2 rounded-lg border border-border-color"
              onClick={() => void this.props.signOut?.()}
            >
              Sign out
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminSignIn() {
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="max-w-md mx-auto paper-card bg-white p-8 border-2 border-dashed border-gray-200 relative">
      <div className="pin pin-terracotta" style={{ top: 15 }} />
      <h1 className="font-quirky text-2xl font-bold text-text-dark mb-2">
        Admin
      </h1>
      {/* <p className="text-text-light text-sm mb-6">
        Sign in with the admin email set in Convex as{" "}
        <code className="text-xs bg-off-white-paper px-1 rounded">ADMIN_EMAIL</code>
        . First visit: choose{" "}
        <span className="font-medium text-text-dark">Create admin account</span>{" "}
        and use that exact email. Run{" "}
        <code className="text-xs bg-off-white-paper px-1 rounded">
          npm run convex:setup-auth-env
        </code>{" "}
        for JWT keys + a variable checklist.
      </p> */}
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          setPending(true);
          const form = e.currentTarget;
          const fd = new FormData(form);
          fd.set("flow", mode);
          void signIn("password", fd)
            .catch((err: unknown) => {
              setError(formatAuthError(err));
            })
            .finally(() => setPending(false));
        }}
      >
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className="w-full h-12 px-3 border-b-2 border-border-color focus:border-terracotta outline-none rounded-t-md bg-off-white-paper text-text-dark"
        />
        <input
          name="password"
          type="password"
          required
          autoComplete={
            mode === "signUp" ? "new-password" : "current-password"
          }
          placeholder="Password"
          className="w-full h-12 px-3 border-b-2 border-border-color focus:border-terracotta outline-none rounded-t-md bg-off-white-paper text-text-dark"
        />
        <input type="hidden" name="flow" value={mode} />
        <button
          type="submit"
          disabled={pending}
          className="h-12 bg-terracotta hover:bg-terracotta/90 text-white font-quirky font-bold rounded-lg disabled:opacity-70"
        >
          {pending
            ? "Working…"
            : mode === "signIn"
              ? "Sign in"
              : "Create admin account"}
        </button>
      </form>
      <button
        type="button"
        className="mt-3 text-sm text-terracotta font-medium hover:underline"
        onClick={() => {
          setMode(mode === "signIn" ? "signUp" : "signIn");
          setError(null);
        }}
      >
        {mode === "signIn"
          ? "First time? Create admin account"
          : "Have an account? Sign in"}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-red-600 font-quirky">{error}</p>
      ) : null}
    </div>
  );
}

function SubscriberTable() {
  const { signOut } = useAuthActions();
  const rows = useQuery(api.subscribers.listForAdmin);
  const remove = useMutation(api.subscribers.remove);
  const [busy, setBusy] = useState<Id<"subscribers"> | null>(null);

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-quirky text-2xl font-bold text-text-dark">
          Subscribers
        </h1>
        <button
          type="button"
          className="text-sm px-4 py-2 rounded-lg border border-border-color text-text-dark hover:bg-off-white-paper"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>

      {rows === undefined ? (
        <p className="text-text-light font-quirky">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-text-light font-quirky">No subscribers yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row._id}>
              <div className="paper-card bg-white border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <a
                  className="text-terracotta font-medium hover:underline break-all order-1 sm:order-none min-w-0 flex-1"
                  href={`mailto:${row.email}`}
                >
                  {row.email}
                </a>
                <span className="text-xs text-text-light whitespace-nowrap order-3 sm:order-none">
                  {new Date(row.createdAt).toLocaleString()}
                </span>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline font-quirky disabled:opacity-50 self-start sm:self-auto order-2 sm:order-none shrink-0"
                  disabled={busy === row._id}
                  onClick={() => {
                    setBusy(row._id);
                    void remove({ id: row._id }).finally(() => setBusy(null));
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AuthenticatedSubscribersPanel() {
  const { signOut } = useAuthActions();
  const [boundaryKey, setBoundaryKey] = useState(0);

  return (
    <SubscriberQueryBoundary
      key={boundaryKey}
      onReset={() => setBoundaryKey((k) => k + 1)}
      signOut={() => void signOut()}
    >
      <SubscriberTable />
    </SubscriberQueryBoundary>
  );
}

function AdminBody() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [authSlow, setAuthSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAuthSlow(false);
      return;
    }
    const id = window.setTimeout(() => setAuthSlow(true), 6000);
    return () => window.clearTimeout(id);
  }, [isLoading]);

  if (isLoading && authSlow) {
    return (
      <div className="max-w-lg mx-auto paper-card bg-white p-8 border border-amber-200 space-y-3">
        <p className="font-quirky font-bold text-text-dark">
          Session check is taking a long time
        </p>
        <p className="text-sm text-text-light">
          Confirm <code className="text-xs bg-off-white-paper px-1">PUBLIC_CONVEX_URL</code>{" "}
          is set in <code className="text-xs bg-off-white-paper px-1">.env.local</code>{" "}
          (not commented out), matches your Convex deployment URL, then restart{" "}
          <code className="text-xs bg-off-white-paper px-1">npm run dev</code>.
        </p>
        <p className="text-sm text-text-light">
          Run <code className="text-xs bg-off-white-paper px-1">npm run convex:dev</code>{" "}
          so the backend is deployed. If the URL has <code>?code=</code> stuck from an
          OAuth attempt, open <code className="text-xs">/admin</code> without query
          params.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center text-text-light font-quirky py-12">
        Checking session…
      </p>
    );
  }

  if (!isAuthenticated) {
    return <AdminSignIn />;
  }

  return <AuthenticatedSubscribersPanel />;
}

export default function AdminApp() {
  const url = getConvexPublicUrl();
  const client = useMemo(
    () => (url ? new ConvexReactClient(url) : null),
    [url],
  );

  if (!client) {
    return (
      <div className="max-w-lg mx-auto paper-card bg-white p-8 border border-gray-200 text-center space-y-2">
        <p className="text-red-600 font-quirky">
          Missing or invalid <code className="text-sm">PUBLIC_CONVEX_URL</code>
        </p>
        <p className="text-text-light text-sm">
          Add a line like{" "}
          <code className="text-xs bg-off-white-paper px-1">
            PUBLIC_CONVEX_URL=https://…convex.cloud
          </code>{" "}
          to <code>.env.local</code> (see <code>.env.example</code>). Do not comment out
          the variable name. Restart the dev server after saving.
        </p>
      </div>
    );
  }

  return (
    <ConvexAuthProvider client={client}>
      <AdminRuntimeErrorBoundary>
        <AdminBody />
      </AdminRuntimeErrorBoundary>
    </ConvexAuthProvider>
  );
}
